import { mkdir, readFile, writeFile } from "node:fs/promises";
import { arch, cpus, platform, release, totalmem } from "node:os";
import { join } from "node:path";
import { ANALYZERS } from "./analyzers.ts";
import type { AnalyzerResult, DatasetResult } from "./bench.ts";
import { DATASETS, type Dataset, type Lang } from "./datasets.ts";

const MB = 1024 * 1024;

const LANG_NAMES: Record<Lang, string> = {
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  dts: "declarations",
};

function formatMs(ms: number): string {
  const digits = ms < 1 ? 2 : ms < 100 ? 1 : 0;
  return `${ms.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })} ms`;
}

function formatRatio(ratio: number): string {
  return `${ratio.toFixed(ratio < 10 ? 2 : 1)}×`;
}

function colorOf(key: string): string {
  return ANALYZERS.find((a) => a.key === key)?.color ?? "#888888";
}

function textWidth(text: string): number {
  let em = 0;
  for (const c of text) em += /[fijlrt\-. ]/.test(c) ? 0.35 : /[A-Zmw]/.test(c) ? 0.75 : 0.58;
  return Math.ceil(em * 13);
}

async function renderChart(name: string, rows: AnalyzerResult[]): Promise<string> {
  const width = 640;
  const barX = Math.max(...rows.map((r) => textWidth(r.name))) + 10;
  const fastest = rows[0]!.median;
  const slowest = Math.max(...rows.map((r) => r.median));
  const bars = rows.map((r, i) => {
    const y = i * 30;
    const middle = y + 11;
    const barEnd = barX + Math.round((r.median / slowest) * (width - barX - 80));
    const bar = [
      `<text x="${barX - 10}" y="${middle}" text-anchor="end">${r.name}</text>`,
      `<rect x="${barX}" y="${y}" width="${barEnd - barX}" height="22" rx="4" fill="${colorOf(r.key)}"/>`,
      `<text x="${barEnd + 8}" y="${middle}">${formatMs(r.median)}</text>`,
    ];
    if (i !== 0) {
      const ratio = formatRatio(r.median / fastest);
      bar.push(`<text class="ratio" x="${barEnd - 8}" y="${middle}" text-anchor="end">${ratio}</text>`);
    }
    return bar.join("\n  ");
  });

  const height = rows.length * 30 - 8;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    text { font: 13px -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif; fill: #848d97; dominant-baseline: central; font-variant-numeric: tabular-nums }
    .ratio { font-size: 12px; fill: #fff }
  </style>
  ${bars.join("\n  ")}
</svg>
`;

  await mkdir("charts", { recursive: true });
  await writeFile(join("charts", `${name}.svg`), svg);
  return `charts/${name}.svg`;
}

async function readResult(dataset: Dataset): Promise<DatasetResult> {
  return JSON.parse(await readFile(join("result", `${dataset.key}.json`), "utf-8")) as DatasetResult;
}

function anchor(dataset: Dataset): string {
  return `#${dataset.title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replaceAll(" ", "-")}`;
}

function describe(result: DatasetResult): string {
  const files = result.files === 1 ? "1 file" : `${result.files.toLocaleString("en-US")} files`;
  const langs = result.langs.map((lang) => LANG_NAMES[lang]).join(", ");
  return `${files} · ${(result.bytes / MB).toFixed(1)} MB · ${langs}`;
}

async function datasetSection(dataset: Dataset, result: DatasetResult): Promise<string[]> {
  const rows = [...result.results].sort((a, b) => a.median - b.median);
  const fastest = rows[0]!.median;
  const chart = await renderChart(dataset.key, rows);

  return [
    `### [${dataset.title}](${dataset.url})`,
    "",
    describe(result),
    "",
    `![Bar chart of the time each analyzer takes on ${dataset.title}](${chart})`,
    "",
    "| Analyzer | Median | RME | Min | Max | Relative |",
    "|----------|--------|-----|-----|-----|----------|",
    ...rows.map((r, i) => {
      const relative = i === 0 ? "baseline" : `${formatRatio(r.median / fastest)} slower`;
      const cells = [r.name, formatMs(r.median), `±${r.rme.toFixed(2)}%`, formatMs(r.min), formatMs(r.max), relative];
      return `| ${(i === 0 ? cells.map((c) => `**${c}**`) : cells).join(" | ")} |`;
    }),
    "",
  ];
}

// A row per dataset. Each bolds its fastest time and shows every other as a multiple of it.
function summaryTable(datasets: Dataset[], results: Map<Dataset, DatasetResult>): string[] {
  return [
    `| | Files | ${ANALYZERS.map((a) => a.name).join(" | ")} |`,
    `|---|---:|${ANALYZERS.map(() => "---").join("|")}|`,
    ...datasets.map((dataset) => {
      const result = results.get(dataset)!;
      const fastest = Math.min(...result.results.map((r) => r.median));
      const cells = ANALYZERS.map((analyzer) => {
        const { median } = result.results.find((r) => r.key === analyzer.key)!;
        if (median === fastest) return `**${formatMs(median)}**`;
        return `${formatMs(median)} · ${formatRatio(median / fastest)}`;
      });
      const files = result.files.toLocaleString("en-US");
      return `| [${dataset.title}](${anchor(dataset)}) | ${files} | ${cells.join(" | ")} |`;
    }),
  ];
}

function systemSection(runtime: string): string[] {
  const os = platform();
  const osName = { darwin: "macOS", win32: "Windows", linux: "Linux" }[os as string] ?? os;
  return [
    "## System",
    "",
    "| Property | Value |",
    "|----------|-------|",
    `| OS | ${osName} ${release()} (${arch()}) |`,
    `| CPU | ${cpus()[0]?.model ?? "Unknown CPU"} |`,
    `| Cores | ${cpus().length} |`,
    `| Memory | ${(totalmem() / 1024 ** 3).toFixed(0)} GB |`,
    `| Runtime | ${runtime} |`,
    "",
  ];
}

const ANALYZERS_SECTION = [
  "## Analyzers",
  "",
  "| Analyzer | Packages | What it is |",
  "|----------|----------|------------|",
  ...ANALYZERS.map((a) => {
    const packages = a.packages.split(" + ").map((name) => `\`${name}\``).join(" + ");
    return `| [${a.name}](${a.url}) | ${packages} | ${a.description} |`;
  }),
  "",
];

const METHODOLOGY_SECTION = `## Methodology

### The work

Every analyzer does the same job on a whole codebase, the job an editor, linter, or bundler needs done:

1. Parse every file into an AST of JavaScript objects.
2. Bind its scopes and declarations, with TypeScript's declaration merging and its separate value, type, and namespace spaces.
3. Resolve every reference to its declaration.
4. Follow every import and re-export across files to the declaration it names.

### Codebases

Each project is its source directories at a pinned commit, the files its own \`tsconfig\` covers. The single files are the [parser benchmark files](https://github.com/yuku-toolchain/parser-benchmark-files).

### Measurement

Every analyzer × codebase runs in its own freshly spawned Node.js process, so JIT state and garbage from one never affect another. Timing uses [Tinybench](https://github.com/tinylibs/tinybench), with warmup iterations followed by timed iterations, in 3 independent runs per analyzer. The reported median is the median across those runs, which is robust to GC pauses and scheduling blips. RME is the relative margin of error (99% confidence) within a run.`;

const RUN_SECTION = `## Run the benchmarks

Requires [Node.js](https://nodejs.org/) 24 and [Bun](https://bun.sh/).

\`\`\`bash
git clone https://github.com/yuku-toolchain/ecmascript-analyzer-benchmark-js.git
cd ecmascript-analyzer-benchmark-js
bun install
bun load-files
bun bench
\`\`\`

\`bun load-files\` downloads the benchmark files and the pinned projects. \`bun bench\` measures every codebase on Node.js, saves the results to \`result/\`, and regenerates this README. Measure some codebases only by naming them, as in \`node scripts/bench.ts vue zod\`.

| Variable | Default | Meaning |
|----------|---------|---------|
| \`BENCH_TIME\` | 10000 | Timed duration per run, in ms |
| \`BENCH_WARMUP\` | 2000 | Warmup duration per run, in ms |
| \`BENCH_RUNS\` | 3 | Independent runs per analyzer |

For the most stable numbers, run on AC power with nothing else running.
`;

async function main() {
  const results = new Map<Dataset, DatasetResult>();
  for (const dataset of DATASETS) results.set(dataset, await readResult(dataset));
  const projects = DATASETS.filter((d) => d.project);
  const files = DATASETS.filter((d) => d.file);

  const projectSections: string[] = [];
  for (const dataset of projects) projectSections.push(...(await datasetSection(dataset, results.get(dataset)!)));
  const fileSections: string[] = [];
  for (const dataset of files) fileSections.push(...(await datasetSection(dataset, results.get(dataset)!)));

  const readme = [
    "# ECMAScript Analyzer Benchmark (npm)",
    "",
    "How fast the JavaScript and TypeScript analyzers on npm build the semantic model of real codebases: every scope and binding, every reference resolved to its declaration, and every import linked across files.",
    "",
    "## Summary",
    "",
    "Median time to analyze a whole codebase. The fastest in each row is bold, and every other time shows how many times it is of the fastest.",
    "",
    ...summaryTable(projects, results),
    "",
    "On single files:",
    "",
    ...summaryTable(files, results),
    "",
    "## Projects",
    "",
    ...projectSections,
    "## Single files",
    "",
    ...fileSections,
    ...ANALYZERS_SECTION,
    METHODOLOGY_SECTION,
    "",
    ...systemSection(results.values().next().value!.runtime),
    RUN_SECTION,
  ].join("\n");

  await writeFile("README.md", readme);
  console.log("README.md generated");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
