import { mkdir, readFile, writeFile } from "node:fs/promises";
import { arch, cpus, platform, release, totalmem } from "node:os";
import { join } from "node:path";
import type { ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ANALYZERS } from "./analyzers.ts";
import type { DatasetResult } from "./bench.ts";
import { DATASETS, type Dataset, type Lang } from "./datasets.ts";

const MB = 1024 * 1024;
const TEXT_COLOR = "#CAC1B0";
const INSIDE_COLOR = "rgba(255, 255, 255, 0.75)";

const LANG_NAMES: Record<Lang, string> = {
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  dts: "declarations",
};

interface Bar {
  label: string;
  value: number;
  color: string;
  outside: string;
  inside: string | null;
}

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

async function renderChart(name: string, bars: Bar[]): Promise<string> {
  const dpr = 3;
  const width = 500;
  const height = bars.length * 24 + 28;

  const maxValue = Math.max(...bars.map((b) => b.value));
  const rawStep = maxValue / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 2.5, 5, 10].map((s) => s * magnitude).find((s) => s >= rawStep)!;

  const configuration: ChartConfiguration = {
    type: "bar",
    data: {
      labels: bars.map((b) => b.label),
      datasets: [
        {
          data: bars.map((b) => b.value),
          backgroundColor: bars.map((b) => b.color),
          borderWidth: 0,
          barPercentage: 0.75,
          categoryPercentage: 0.92,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: false,
      devicePixelRatio: 1,
      layout: { padding: { right: 75 * dpr, top: 2 * dpr, bottom: 0 } },
      plugins: { legend: { display: false }, title: { display: false } },
      scales: {
        x: { display: false, beginAtZero: true, max: Math.ceil(maxValue / step) * step },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: TEXT_COLOR, font: { size: 9 * dpr }, padding: 3 * dpr },
        },
      },
    },
    plugins: [
      {
        id: "value-labels",
        afterDatasetsDraw(chart) {
          const ctx = chart.ctx;
          const meta = chart.getDatasetMeta(0);
          bars.forEach((bar, i) => {
            const element = meta.data[i] as unknown as { x: number; y: number; base: number };
            ctx.save();
            ctx.textBaseline = "middle";
            ctx.font = `${9 * dpr}px sans-serif`;
            ctx.fillStyle = TEXT_COLOR;
            ctx.textAlign = "left";
            ctx.fillText(bar.outside, element.x + 8 * dpr, element.y);
            if (bar.inside !== null) {
              const outsideWidth = ctx.measureText(bar.outside).width;
              ctx.font = `${8 * dpr}px sans-serif`;
              const barWidth = element.x - element.base;
              const inset = Math.min(8 * dpr, (barWidth - ctx.measureText(bar.inside).width) / 2);
              if (inset >= 2 * dpr) {
                ctx.fillStyle = INSIDE_COLOR;
                ctx.textAlign = "right";
                ctx.fillText(bar.inside, element.x - inset, element.y);
              } else {
                ctx.font = `${9 * dpr}px sans-serif`;
                ctx.fillText(`· ${bar.inside}`, element.x + 12 * dpr + outsideWidth, element.y);
              }
            }
            ctx.restore();
          });
        },
      },
    ],
  };

  const canvas = new ChartJSNodeCanvas({ width: width * dpr, height: height * dpr });
  await mkdir("charts", { recursive: true });
  await writeFile(join("charts", `${name}.png`), await canvas.renderToBuffer(configuration));
  return `charts/${name}.png`;
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
  const chart = await renderChart(
    dataset.key,
    rows.map((r, i) => ({
      label: r.name,
      value: r.median,
      color: colorOf(r.key),
      outside: formatMs(r.median),
      inside: i === 0 ? null : formatRatio(r.median / fastest),
    })),
  );

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

Every analyzer builds the semantic model of a whole codebase, the work an editor, linter, or bundler needs from it:

1. Parse every file.
2. Bind its scopes and declarations, with TypeScript's declaration merging and its separate value, type, and namespace spaces.
3. Resolve every reference to its declaration.
4. Follow every import and export across files to the declaration it names.

Every analyzer also hands back the whole AST as JavaScript objects, which Yuku otherwise builds only when it is read. Every analyzer gets the same files and options, with no default library, so a global stays unresolved in all of them. Vue and Preact map their package names to source directories, which every analyzer that links imports follows. Yuku reports its references directly. TypeScript has no list of references, so every identifier its own AST places in a reference position is resolved through the checker, which gives the same references as Yuku within 1%.

typescript-eslint analyzes one file at a time and never links imports, so it does less of the work than the others.

### Codebases

Each project is its source directories at a pinned commit, the files its own \`tsconfig\` covers. The single files are the [parser benchmark files](https://github.com/yuku-toolchain/parser-benchmark-files).

### Measurement

Every analyzer × codebase runs in its own freshly spawned Node.js process, so JIT state and garbage from one never affect another. Timing uses [Tinybench](https://github.com/tinylibs/tinybench), with warmup iterations followed by timed iterations, in 3 independent runs per analyzer. The reported median is the median across those runs, which is robust to GC pauses and scheduling blips. RME is the relative margin of error (99% confidence) within a run.

### TypeScript 7

TypeScript 7 runs in Go, in a server process. It parses and binds a project on several threads in a small part of its total. Most of its time goes to returning the resolved symbols to JavaScript through \`typescript/unstable/sync\`, the API any JavaScript tool reaches it through. Each run opens the project at fresh paths, so the server reuses nothing from an earlier run.`;

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
