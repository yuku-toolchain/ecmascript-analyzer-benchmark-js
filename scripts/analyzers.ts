import { posix } from "node:path";
import type { FileSystem } from "typescript-7/unstable/fs";
import type { Dataset, SourceFile } from "./datasets.ts";
import { link, type Resolver } from "./link.ts";

/** One analyzer, loaded and ready, possibly with a server process behind it. */
export interface Session {
  analyze(files: readonly SourceFile[]): unknown;
  close(): void;
}

export interface Analyzer {
  key: string;
  name: string;
  packages: string;
  description: string;
  url: string;
  color: string;
  open(dataset: Dataset): Promise<Session>;
}

const COMPILER_OPTIONS = {
  noLib: true,
  allowJs: true,
  allowImportingTsExtensions: true,
  noEmit: true,
  types: [],
};

export const ANALYZERS: Analyzer[] = [
  {
    key: "yuku",
    name: "Yuku",
    packages: "yuku-analyzer",
    description: "Computed natively in Zig, in the same pass as the parse.",
    url: "https://github.com/yuku-toolchain/yuku",
    color: "#FF6B35",
    async open(dataset) {
      const { Analyzer } = await import("yuku-analyzer");
      return {
        analyze(files) {
          const analyzer = new Analyzer({ resolve: moduleResolver(dataset, files) });
          for (const file of files) {
            analyzer.setFile(file.path, file.source, { lang: file.lang, sourceType: file.sourceType });
          }
          analyzer.link();
          for (const module of analyzer.modules.values()) {
            void module.ast;
            void module.scopes;
            for (const reference of module.references) void reference.binding;
            for (const entry of module.imports) entry.local?.definition();
          }
          return analyzer;
        },
        close() {},
      };
    },
  },
  {
    key: "typescript",
    name: "TypeScript",
    packages: "typescript@7",
    description: "The TypeScript compiler, written in Go, through its API.",
    url: "https://github.com/microsoft/typescript-go",
    color: "#3A86FF",
    async open(dataset) {
      const { API } = await import("typescript-7/unstable/sync");
      const { SyntaxKind } = await import("typescript-7/unstable/ast");
      const collect = referenceCollector<import("typescript-7/unstable/ast").Node>(SyntaxKind);
      const { files, fileSystem, index } = memoryFileSystem();
      const api = new API({ cwd: "/", fs: fileSystem });
      let run = 0;

      return {
        // each run gets fresh paths, so nothing the server cached from an earlier run applies
        analyze(sources) {
          const root = `/run${run++}`;
          const config = `${root}/tsconfig.json`;
          const paths = sources.map((source) => `${root}/${source.path}`);
          sources.forEach((source, i) => files.set(paths[i]!, source.source));
          const compilerOptions = {
            ...COMPILER_OPTIONS,
            jsx: "preserve",
            target: "esnext",
            module: "esnext",
            moduleResolution: "bundler",
            paths: tsconfigPaths(dataset, root),
          };
          files.set(config, JSON.stringify({ compilerOptions, files: paths }));
          index();

          const snapshot = api.updateSnapshot({ openProjects: [config] });
          const { program, checker } = snapshot.getProject(config)!;
          for (const path of paths) {
            const { references, aliases } = collect(program.getSourceFile(path)!);
            if (references.length > 0) checker.getSymbolAtLocation(references);
            if (aliases.length === 0) continue;
            for (const symbol of checker.getSymbolAtLocation(aliases)) {
              if (symbol) checker.getAliasedSymbol(symbol);
            }
          }

          api.updateSnapshot({ closeProjects: [config] });
          snapshot.dispose();
          for (const path of paths) files.delete(path);
          files.delete(config);
          return program;
        },
        close() {
          api.close();
        },
      };
    },
  },
  {
    key: "typescript_eslint",
    name: "typescript-eslint",
    packages: "@typescript-eslint/typescript-estree + @typescript-eslint/scope-manager",
    description: "The parser and scope analysis behind typescript-eslint, linked across files by the benchmark.",
    url: "https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/scope-manager",
    color: "#7209B7",
    async open(dataset) {
      const { parse } = await import("@typescript-eslint/typescript-estree");
      const { analyze } = await import("@typescript-eslint/scope-manager");
      return {
        analyze(files) {
          const modules = new Map(files.map((file) => {
            const jsx = file.lang === "js" || file.lang === "jsx";
            const ast = parse(file.source, { range: true, filePath: file.path, jsx });
            const manager = analyze(ast, { sourceType: file.sourceType, lib: [] });
            for (const scope of manager.scopes) {
              for (const reference of scope.references) void reference.resolved;
            }
            return [file.path, { ast, manager }];
          }));
          return link(modules, moduleResolver(dataset, files));
        },
        close() {},
      };
    },
  },
];

export function findAnalyzer(key: string): Analyzer {
  const analyzer = ANALYZERS.find((a) => a.key === key);
  if (!analyzer) throw new Error(`Unknown analyzer: ${key}`);
  return analyzer;
}

// a dataset's module names as a tsconfig `paths`, with absolute targets under `root`
function tsconfigPaths(dataset: Dataset, root: string): Record<string, string[]> {
  const base = `${root}/projects/${dataset.key}`;
  const entries = Object.entries(dataset.project?.paths ?? {});
  return Object.fromEntries(entries.map(([name, targets]) => [name, targets.map((t) => `${base}/${t}`)]));
}

const EXTENSIONS = [".ts", ".tsx", ".d.ts", ".js", ".jsx", ".mts", ".mjs", ".cts", ".cjs"];
const SOURCE_EXTENSIONS: Record<string, string[]> = {
  ".js": [".ts", ".tsx", ".d.ts"],
  ".jsx": [".tsx"],
  ".mjs": [".mts", ".d.mts"],
  ".cjs": [".cts", ".d.cts"],
};

/**
 * Resolves relative specifiers by probing extensions and index files as TypeScript does, and a
 * dataset's module names as TypeScript resolves its `paths`. Yuku and typescript-eslint share it.
 */
function moduleResolver(dataset: Dataset, files: readonly SourceFile[]): Resolver {
  const paths = Object.entries(dataset.project?.paths ?? {});
  const known = new Set(files.map((file) => file.path));
  const root = `projects/${dataset.key}`;

  const probe = (base: string): string | null => {
    if (known.has(base)) return base;
    const extension = posix.extname(base);
    for (const source of SOURCE_EXTENSIONS[extension] ?? []) {
      const path = base.slice(0, -extension.length) + source;
      if (known.has(path)) return path;
    }
    for (const probe of EXTENSIONS) if (known.has(base + probe)) return base + probe;
    for (const probe of EXTENSIONS) if (known.has(`${base}/index${probe}`)) return `${base}/index${probe}`;
    return null;
  };

  return (specifier, importer) => {
    if (specifier.startsWith(".")) return probe(posix.join(posix.dirname(importer), specifier));
    for (const [name, targets] of paths) {
      const star = name.indexOf("*");
      const prefix = star === -1 ? name : name.slice(0, star);
      const suffix = star === -1 ? "" : name.slice(star + 1);
      if (star === -1 ? specifier !== name : !specifier.startsWith(prefix) || !specifier.endsWith(suffix)) {
        continue;
      }
      const captured = specifier.slice(prefix.length, specifier.length - suffix.length);
      for (const target of targets) {
        const found = probe(`${root}/${target.replace("*", captured)}`);
        if (found !== null) return found;
      }
    }
    return false;
  };
}

interface SyntaxNode {
  readonly kind: number;
  readonly parent: SyntaxNode;
  forEachChild<T>(visitor: (node: SyntaxNode) => T): T | undefined;
}

type Fields = Partial<Record<"name" | "propertyName" | "expression" | "left" | "initializer", unknown>>;

/**
 * Finds the identifiers a TypeScript AST resolves as references, the work Yuku reports as
 * `module.references`, and the names its imports and exports alias, which Yuku links. Both
 * TypeScript versions share the AST shape, only their kind numbers differ.
 */
function referenceCollector<Node>(kinds: Record<string, string | number>) {
  const kind = (name: string) => kinds[name] as number;
  const IDENTIFIER = kind("Identifier");
  const PROPERTY_ACCESS = kind("PropertyAccessExpression");
  const QUALIFIED_NAME = kind("QualifiedName");
  const BINDING_ELEMENT = kind("BindingElement");
  const ALIASES = new Set(
    [
      "ImportClause",
      "NamespaceImport",
      "ImportSpecifier",
      "ImportEqualsDeclaration",
      "ExportSpecifier",
      "NamespaceExport",
    ].map(kind),
  );
  const LABELS = new Set(
    ["LabeledStatement", "BreakStatement", "ContinueStatement", "MetaProperty"].map(kind),
  );

  function isReference(node: SyntaxNode, parent: SyntaxNode & Fields): boolean {
    if (parent.kind === PROPERTY_ACCESS) return parent.expression === node;
    if (parent.kind === QUALIFIED_NAME) return parent.left === node;
    if (parent.kind === BINDING_ELEMENT) return parent.initializer === node;
    if (LABELS.has(parent.kind)) return false;
    return parent.name !== node && parent.propertyName !== node;
  }

  return (root: Node) => {
    const references: Node[] = [];
    const aliases: Node[] = [];
    const visit = (node: SyntaxNode): void => {
      if (node.kind !== IDENTIFIER) {
        node.forEachChild(visit);
        return;
      }
      const parent = node.parent as SyntaxNode & Fields;
      if (ALIASES.has(parent.kind)) {
        if (parent.name === node) aliases.push(node as Node);
      } else if (isReference(node, parent)) {
        references.push(node as Node);
      }
    };
    visit(root as SyntaxNode);
    return { references, aliases };
  };
}

interface Directory {
  files: string[];
  directories: string[];
}

// every directory above the given absolute paths, with its entries, for module resolution
function directoryIndex(paths: Iterable<string>): Map<string, Directory> {
  const index = new Map<string, Directory>([["/", { files: [], directories: [] }]]);
  // recurses once per path segment, and "/" is always present
  const directory = (path: string): Directory => {
    let entry = index.get(path);
    if (entry !== undefined) return entry;
    entry = { files: [], directories: [] };
    index.set(path, entry);
    directory(posix.dirname(path)).directories.push(posix.basename(path));
    return entry;
  };
  for (const path of paths) directory(posix.dirname(path)).files.push(posix.basename(path));
  return index;
}

function memoryFileSystem() {
  const files = new Map<string, string>();
  let directories = new Map<string, Directory>();
  const trim = (name: string) => (name.length > 1 && name.endsWith("/") ? name.slice(0, -1) : name);
  const fileSystem: FileSystem = {
    readFile: (name) => files.get(name) ?? null,
    fileExists: (name) => files.has(name),
    directoryExists: (name) => directories.has(trim(name)),
    getAccessibleEntries: (name) => directories.get(trim(name)) ?? { files: [], directories: [] },
    realpath: (name) => name,
  };
  return {
    files,
    fileSystem,
    /** Indexes the directories after the files change. */
    index() {
      directories = directoryIndex(files.keys());
    },
  };
}
