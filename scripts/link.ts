import type { Scope, ScopeManager, Variable } from "@typescript-eslint/scope-manager";
import type { TSESTree } from "@typescript-eslint/typescript-estree";

/**
 * Links ESTree modules across files, the work typescript-eslint leaves to its user and Yuku
 * does in `analyzer.link()`. Every specifier goes through `resolve`, and every import and
 * re-export follows the specification's ResolveExport, through `export *`, to the variable
 * that declares it.
 */
export function link(
  modules: Map<string, { ast: TSESTree.Program; manager: ScopeManager }>,
  resolve: Resolver,
): Map<Variable, Definition> {
  const records = new Map<string, ModuleRecord>();
  for (const [path, { ast, manager }] of modules) records.set(path, moduleRecord(path, ast, manager));

  const target = (from: ModuleRecord, specifier: string): ModuleRecord | null => {
    let found = from.targets.get(specifier);
    if (found === undefined) {
      const path = resolve(specifier, from.path);
      found = typeof path === "string" ? (records.get(path) ?? null) : null;
      from.targets.set(specifier, found);
    }
    return found;
  };

  const resolutions = new Map<ModuleRecord, Map<string, Resolution>>();
  const resolveExport = (module: ModuleRecord, name: string): Resolution => {
    let byName = resolutions.get(module);
    if (byName === undefined) resolutions.set(module, (byName = new Map()));
    let resolution = byName.get(name);
    if (resolution === undefined) {
      byName.set(name, null);
      resolution = resolveExportUncached(module, name);
      byName.set(name, resolution);
    }
    return resolution;
  };

  const followImport = (module: ModuleRecord, entry: ImportEntry): Resolution => {
    const from = target(module, entry.specifier);
    if (from === null) return null;
    return entry.name === "*" ? { module: from, variable: null } : resolveExport(from, entry.name);
  };

  const resolveExportUncached = (module: ModuleRecord, name: string): Resolution => {
    const entry = module.exports.get(name);
    if (entry !== undefined) {
      if (entry.specifier === null) {
        if (entry.local === null) return null;
        const imported = module.importsByLocal.get(entry.local);
        if (imported !== undefined) return followImport(module, imported);
        const variable = module.scope.set.get(entry.local);
        return variable === undefined ? null : { module, variable };
      }
      const from = target(module, entry.specifier);
      if (from === null) return null;
      return entry.name === "*" ? { module: from, variable: null } : resolveExport(from, entry.name);
    }
    if (name === "default") return null;

    let found: Resolution = null;
    for (const specifier of module.stars) {
      const from = target(module, specifier);
      if (from === null) continue;
      const resolution = resolveExport(from, name);
      if (resolution === AMBIGUOUS) return AMBIGUOUS;
      if (resolution === null) continue;
      if (found === null) {
        found = resolution;
      } else if (resolution.module !== found.module || resolution.variable !== found.variable) {
        return AMBIGUOUS;
      }
    }
    return found;
  };

  const definitions = new Map<Variable, Definition>();
  for (const module of records.values()) {
    for (const entry of module.imports) {
      const resolution = followImport(module, entry);
      const local = module.scope.set.get(entry.local);
      if (local !== undefined && resolution !== null && resolution !== AMBIGUOUS) {
        definitions.set(local, resolution);
      }
    }
    for (const entry of module.exports.values()) {
      if (entry.specifier === null) continue;
      const from = target(module, entry.specifier);
      if (from !== null && entry.name !== "*") resolveExport(from, entry.name);
    }
  }
  return definitions;
}

/** A module path for a specifier, false for a module outside the project, null when unresolved. */
export type Resolver = (specifier: string, importer: string) => string | false | null;

export interface Definition {
  module: ModuleRecord;
  /** Null for a whole module namespace. */
  variable: Variable | null;
}

const AMBIGUOUS = Symbol("ambiguous");
type Resolution = Definition | null | typeof AMBIGUOUS;

interface ImportEntry {
  local: string;
  /** The imported name, "default", or "*" for a namespace. */
  name: string;
  specifier: string;
}

interface ExportEntry {
  /** The local name it exports, or null for an anonymous default. */
  local: string | null;
  /** The module it re-exports from, or null for a local export. */
  specifier: string | null;
  /** The name it takes from that module, "*" for a namespace. */
  name: string;
}

interface ModuleRecord {
  path: string;
  scope: Scope;
  imports: ImportEntry[];
  importsByLocal: Map<string, ImportEntry>;
  exports: Map<string, ExportEntry>;
  stars: string[];
  targets: Map<string, ModuleRecord | null>;
}

function moduleRecord(path: string, ast: TSESTree.Program, manager: ScopeManager): ModuleRecord {
  const global = manager.globalScope!;
  const scope = global.childScopes.find((child) => child.type === "module") ?? global;
  const record: ModuleRecord = {
    path,
    scope,
    imports: [],
    importsByLocal: new Map(),
    exports: new Map(),
    stars: [],
    targets: new Map(),
  };
  const addImport = (entry: ImportEntry) => {
    record.imports.push(entry);
    record.importsByLocal.set(entry.local, entry);
  };
  const addExport = (exported: string, entry: ExportEntry) => {
    if (!record.exports.has(exported)) record.exports.set(exported, entry);
  };

  for (const statement of ast.body) {
    switch (statement.type) {
      case "ImportDeclaration":
        for (const specifier of statement.specifiers) {
          const name =
            specifier.type === "ImportDefaultSpecifier"
              ? "default"
              : specifier.type === "ImportNamespaceSpecifier"
                ? "*"
                : nameOf(specifier.imported);
          addImport({ local: specifier.local.name, name, specifier: statement.source.value });
        }
        break;
      case "TSImportEqualsDeclaration":
        if (statement.moduleReference.type === "TSExternalModuleReference") {
          const specifier = statement.moduleReference.expression.value;
          addImport({ local: statement.id.name, name: "*", specifier });
        }
        break;
      case "ExportNamedDeclaration": {
        const source = statement.source?.value ?? null;
        for (const specifier of statement.specifiers) {
          const local = nameOf(specifier.local);
          const entry = source === null
            ? { local, specifier: null, name: local }
            : { local: null, specifier: source, name: local };
          addExport(nameOf(specifier.exported), entry);
        }
        if (statement.declaration !== null) {
          for (const name of declaredNames(statement.declaration)) {
            addExport(name, { local: name, specifier: null, name });
          }
        }
        break;
      }
      case "ExportDefaultDeclaration": {
        const declaration = statement.declaration;
        const local =
          declaration.type === "Identifier"
            ? declaration.name
            : "id" in declaration && declaration.id?.type === "Identifier"
              ? declaration.id.name
              : null;
        addExport("default", { local, specifier: null, name: "default" });
        break;
      }
      case "ExportAllDeclaration":
        if (statement.exported === null) {
          record.stars.push(statement.source.value);
        } else {
          addExport(nameOf(statement.exported), { local: null, specifier: statement.source.value, name: "*" });
        }
        break;
    }
  }
  return record;
}

function nameOf(node: TSESTree.Identifier | TSESTree.StringLiteral): string {
  return node.type === "Identifier" ? node.name : node.value;
}

function declaredNames(declaration: TSESTree.NamedExportDeclarations): string[] {
  if (declaration.type === "VariableDeclaration") {
    const names: string[] = [];
    for (const declarator of declaration.declarations) patternNames(declarator.id, names);
    return names;
  }
  if (declaration.id?.type === "Identifier") return [declaration.id.name];
  return [];
}

function patternNames(pattern: TSESTree.Node, names: string[]): void {
  switch (pattern.type) {
    case "Identifier":
      names.push(pattern.name);
      break;
    case "ObjectPattern":
      for (const property of pattern.properties) {
        patternNames(property.type === "Property" ? property.value : property, names);
      }
      break;
    case "ArrayPattern":
      for (const element of pattern.elements) if (element !== null) patternNames(element, names);
      break;
    case "RestElement":
      patternNames(pattern.argument, names);
      break;
    case "AssignmentPattern":
      patternNames(pattern.left, names);
      break;
  }
}
