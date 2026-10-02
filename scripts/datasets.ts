import { globSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, sep } from "node:path";

export type Lang = "js" | "jsx" | "ts" | "tsx" | "dts";
export type SourceType = "module" | "script";

export interface SourceFile {
  path: string;
  lang: Lang;
  sourceType: SourceType;
  source: string;
}

/** A real codebase, pinned to a commit. */
export interface Project {
  repository: string;
  commit: string;
  /** The directories analyzed, from the repository root. */
  sources: string[];
  /** Paths under `sources` the project's own tsconfig leaves out. */
  exclude?: string[];
  /** Module names mapped to directories or files, as a tsconfig `paths`. */
  paths?: Record<string, string[]>;
}

export interface Dataset {
  key: string;
  title: string;
  url: string;
  /** One file from the benchmark files repository. */
  file?: { name: string; sourceType: SourceType };
  project?: Project;
}

export const FILES_DIR = "files";
export const PROJECTS_DIR = "projects";
export const FILES_REPOSITORY = "https://github.com/yuku-toolchain/parser-benchmark-files";

const FILES_URL =
  "https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main";
const SOURCE_GLOB = "**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}";

function project(key: string, title: string, project: Project): Dataset {
  const url = `https://github.com/${project.repository}/tree/${project.commit}`;
  return { key, title, url, project };
}

function file(key: string, name: string, sourceType: SourceType = "module"): Dataset {
  return { key, title: name, url: `${FILES_URL}/${name}`, file: { name, sourceType } };
}

export const DATASETS: Dataset[] = [
  project("typescript", "TypeScript compiler", {
    repository: "microsoft/TypeScript",
    commit: "050880ce59e30b356b686bd3144efe24f875ebc8",
    sources: ["src/compiler"],
  }),
  project("excalidraw", "Excalidraw", {
    repository: "excalidraw/excalidraw",
    commit: "1919728724a1b71af73cb7e6d2d1a418a1415b1c",
    sources: ["packages"],
  }),
  project("three", "three.js", {
    repository: "mrdoob/three.js",
    commit: "157f0885b8428b5ffe8f6f7309b2d6f59faa1497",
    sources: ["src"],
  }),
  project("vue", "Vue", {
    repository: "vuejs/core",
    commit: "4ab865a848a1da3d10fb674f857e5fff13094644",
    sources: ["packages"],
    exclude: ["packages/runtime-core/types"],
    paths: { "@vue/*": ["packages/*/src"], vue: ["packages/vue/src"] },
  }),
  project("zod", "Zod", {
    repository: "colinhacks/zod",
    commit: "004d800c9e3cd4c79930f55aa4ad080225b22efd",
    sources: ["packages/zod/src"],
  }),
  project("date_fns", "date-fns", {
    repository: "date-fns/date-fns",
    commit: "717ce0a807ea4c6b540d015b5c408723175b2838",
    sources: ["pkgs/core/src"],
  }),
  project("svelte", "Svelte", {
    repository: "sveltejs/svelte",
    commit: "020242d6bef059df9ae8c13dc8dbff4c9b31e0ff",
    sources: ["packages/svelte/src"],
  }),
  project("preact", "Preact", {
    repository: "preactjs/preact",
    commit: "3fcc391adc243d479ab10b4cf70fa609708c9348",
    sources: ["src", "hooks/src", "compat/src"],
    paths: { preact: ["src/index.js"], "preact/hooks": ["hooks/src/index.js"] },
  }),
  file("typescript_js", "typescript.js"),
  file("checker", "checker.ts"),
  file("lib_dom", "lib.dom.d.ts", "script"),
  file("react", "react.js"),
];

export function findDataset(key: string): Dataset {
  const dataset = DATASETS.find((d) => d.key === key);
  if (!dataset) throw new Error(`Unknown dataset: ${key}`);
  return dataset;
}

export function projectRoot(dataset: Dataset): string {
  return join(PROJECTS_DIR, dataset.key);
}

export function datasetPaths(dataset: Dataset): string[] {
  if (dataset.file) return [join(FILES_DIR, dataset.file.name)];
  const project = dataset.project!;
  const root = projectRoot(dataset);
  const excluded = (project.exclude ?? []).map((path) => join(root, path) + sep);
  return project.sources
    .flatMap((source) => globSync(SOURCE_GLOB, { cwd: join(root, source) }).map((path) => join(root, source, path)))
    .filter((path) => !excluded.some((prefix) => path.startsWith(prefix)))
    .sort();
}

export function langOf(path: string): Lang {
  if (/\.d\.[mc]?ts$/.test(path)) return "dts";
  if (/\.[mc]?ts$/.test(path)) return "ts";
  if (path.endsWith(".tsx")) return "tsx";
  if (path.endsWith(".jsx")) return "jsx";
  return "js";
}

export async function readDataset(dataset: Dataset): Promise<SourceFile[]> {
  const sourceType = dataset.file?.sourceType ?? "module";
  return Promise.all(
    datasetPaths(dataset).map(async (path) => ({
      path,
      lang: langOf(path),
      sourceType,
      source: await readFile(path, "utf-8"),
    })),
  );
}
