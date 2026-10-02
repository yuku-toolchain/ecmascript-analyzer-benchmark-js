import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DATASETS, FILES_DIR, FILES_REPOSITORY, projectRoot, type Dataset } from "./datasets.ts";

function git(args: string[], cwd?: string): string | null {
  const result = Bun.spawnSync({ cmd: ["git", ...args], cwd, stdout: "pipe", stderr: "pipe" });
  return result.exitCode === 0 ? result.stdout.toString().trim() : null;
}

async function loadFiles(): Promise<void> {
  const remote = git(["ls-remote", FILES_REPOSITORY, "HEAD"])?.split(/\s+/)[0] ?? null;
  const local = existsSync(join(FILES_DIR, ".git")) ? git(["-C", FILES_DIR, "rev-parse", "HEAD"]) : null;

  if (remote === null) {
    if (local !== null) return console.warn("Could not reach the files repository, using existing files");
    throw new Error("Could not reach the files repository and no files are present");
  }
  if (local === remote) return;

  console.log("Downloading benchmark files...");
  await rm(FILES_DIR, { recursive: true, force: true });
  const cloned = git(["clone", "--quiet", "--single-branch", "--depth", "1", FILES_REPOSITORY, FILES_DIR]);
  if (cloned === null) throw new Error("Failed to download the benchmark files");
}

async function loadProject(dataset: Dataset): Promise<void> {
  const project = dataset.project!;
  const root = projectRoot(dataset);
  const marker = join(root, ".rev");
  const wanted = `${project.repository} ${project.commit} ${project.sources.join(" ")}`;
  if ((await readFile(marker, "utf-8").catch(() => null)) === wanted) return;

  console.log(`Downloading ${project.repository} at ${project.commit.slice(0, 7)}...`);
  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });
  const steps = [
    ["init", "--quiet"],
    ["config", "core.autocrlf", "false"],
    ["remote", "add", "origin", `https://github.com/${project.repository}.git`],
    ["sparse-checkout", "set", "--cone", ...project.sources],
    ["fetch", "--quiet", "--depth", "1", "--filter=blob:none", "origin", project.commit],
    ["checkout", "--quiet", "FETCH_HEAD"],
  ];
  for (const step of steps) {
    if (git(step, root) === null) throw new Error(`Failed to download ${project.repository}`);
  }
  await rm(join(root, ".git"), { recursive: true, force: true });
  await writeFile(marker, wanted);
}

await loadFiles();
for (const dataset of DATASETS) if (dataset.project) await loadProject(dataset);
console.log("Benchmark files are ready");
