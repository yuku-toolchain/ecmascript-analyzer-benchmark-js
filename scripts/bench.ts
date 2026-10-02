import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Bench } from "tinybench";
import { ANALYZERS, findAnalyzer, type Analyzer } from "./analyzers.ts";
import { DATASETS, datasetPaths, findDataset, langOf, readDataset, type Dataset, type Lang } from "./datasets.ts";

const BENCH_TIME = Number(process.env.BENCH_TIME ?? 10000);
const BENCH_WARMUP = Number(process.env.BENCH_WARMUP ?? 2000);
const BENCH_RUNS = Number(process.env.BENCH_RUNS ?? 3);

interface RunResult {
  median: number;
  mean: number;
  min: number;
  max: number;
  rme: number;
  samples: number;
}

export interface AnalyzerResult extends RunResult {
  key: string;
  name: string;
  runs: number;
}

export interface DatasetResult {
  dataset: string;
  files: number;
  bytes: number;
  langs: Lang[];
  runtime: string;
  results: AnalyzerResult[];
}

// Child mode: one analyzer on one dataset in a fresh process, so JIT state and garbage from
// one analyzer never affect another. Prints one JSON object.
async function runChild(dataset: Dataset, analyzer: Analyzer): Promise<void> {
  const files = await readDataset(dataset);
  const session = await analyzer.open(dataset);
  const bench = new Bench({ time: BENCH_TIME, warmupTime: BENCH_WARMUP });
  bench.add(analyzer.name, () => {
    session.analyze(files);
  });
  await bench.run();
  session.close();

  const result = bench.tasks[0]?.result;
  if (result?.state !== "completed") throw new Error(`${analyzer.name} did not complete`);
  const { latency } = result;
  const run: RunResult = {
    median: latency.p50!,
    mean: latency.mean,
    min: latency.min,
    max: latency.max,
    rme: latency.rme,
    samples: latency.samplesCount,
  };
  process.stdout.write(JSON.stringify(run));
}

// Parent mode: runs every analyzer on every dataset in child processes and writes result/.

function spawnChild(dataset: Dataset, analyzer: Analyzer): RunResult {
  const child = spawnSync(
    process.execPath,
    ["scripts/bench.ts", "--child", dataset.key, analyzer.key],
    { encoding: "utf-8", stdio: ["ignore", "pipe", "inherit"] },
  );
  if (child.status !== 0) {
    throw new Error(`${analyzer.name} on ${dataset.title} exited with ${child.status}`);
  }
  return JSON.parse(child.stdout) as RunResult;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

function benchAnalyzer(dataset: Dataset, analyzer: Analyzer): AnalyzerResult {
  const runs = Array.from({ length: BENCH_RUNS }, (_, run) => {
    console.log(`  ${analyzer.name} (run ${run + 1}/${BENCH_RUNS})`);
    return spawnChild(dataset, analyzer);
  });
  return {
    key: analyzer.key,
    name: analyzer.name,
    median: median(runs.map((r) => r.median)),
    mean: median(runs.map((r) => r.mean)),
    min: Math.min(...runs.map((r) => r.min)),
    max: Math.max(...runs.map((r) => r.max)),
    rme: median(runs.map((r) => r.rme)),
    samples: runs.reduce((sum, r) => sum + r.samples, 0),
    runs: runs.length,
  };
}

function benchDataset(dataset: Dataset): DatasetResult {
  const paths = datasetPaths(dataset);
  const bytes = paths.reduce((sum, path) => sum + statSync(path).size, 0);
  console.log(`\nBenchmarking ${dataset.title} (${paths.length} files)...`);

  const results = ANALYZERS.map((analyzer) => benchAnalyzer(dataset, analyzer));
  results.sort((a, b) => a.median - b.median);
  console.table(results.map((r) => ({ Analyzer: r.name, "Median (ms)": r.median.toFixed(3) })));

  const langs = [...new Set(paths.map(langOf))].sort();
  const runtime = `Node.js ${process.version}`;
  return { dataset: dataset.key, files: paths.length, bytes, langs, runtime, results };
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "--child") {
    const [, datasetKey, analyzerKey] = args;
    if (!datasetKey || !analyzerKey) throw new Error("Usage: bench.ts --child <dataset> <analyzer>");
    await runChild(findDataset(datasetKey), findAnalyzer(analyzerKey));
    return;
  }

  const datasets = args.length > 0 ? args.map(findDataset) : DATASETS;
  await mkdir("result", { recursive: true });
  for (const dataset of datasets) {
    const result = benchDataset(dataset);
    await writeFile(join("result", `${dataset.key}.json`), `${JSON.stringify(result, null, 2)}\n`);
  }
  console.log("\nBenchmark complete!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
