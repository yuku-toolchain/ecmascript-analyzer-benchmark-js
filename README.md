# ECMAScript Analyzer Benchmark (npm)

How fast the JavaScript and TypeScript analyzers on npm build the semantic model of real codebases: every scope and binding, every reference resolved to its declaration, and every import linked across files.

## Summary

Median time to analyze a whole codebase. The fastest in each row is bold, and every other time shows how many times it is of the fastest.

| | Files | Yuku | TypeScript | typescript-eslint |
|---|---:|---|---|---|
| [TypeScript compiler](#typescript-compiler) | 77 | **162 ms** | 824 ms · 5.10× | 1,293 ms · 8.00× |
| [Excalidraw](#excalidraw) | 618 | **128 ms** | 684 ms · 5.35× | 1,089 ms · 8.52× |
| [three.js](#threejs) | 755 | **68.8 ms** | 474 ms · 6.88× | 569 ms · 8.27× |
| [Vue](#vue) | 473 | **96.7 ms** | 467 ms · 4.83× | 754 ms · 7.80× |
| [Zod](#zod) | 332 | **83.2 ms** | 328 ms · 3.94× | 621 ms · 7.47× |
| [date-fns](#date-fns) | 1,643 | **76.7 ms** | 430 ms · 5.61× | 426 ms · 5.55× |
| [Svelte](#svelte) | 416 | **45.3 ms** | 288 ms · 6.35× | 308 ms · 6.79× |
| [Preact](#preact) | 33 | **4.7 ms** | 28.5 ms · 6.11× | 53.4 ms · 11.5× |

On single files:

| | Files | Yuku | TypeScript | typescript-eslint |
|---|---:|---|---|---|
| [typescript.js](#typescriptjs) | 1 | **122 ms** | 776 ms · 6.36× | 1,299 ms · 10.6× |
| [checker.ts](#checkerts) | 1 | **50.1 ms** | 273 ms · 5.46× | 425 ms · 8.49× |
| [lib.dom.d.ts](#libdomdts) | 1 | **20.6 ms** | 83.0 ms · 4.02× | 193 ms · 9.37× |
| [react.js](#reactjs) | 1 | **0.76 ms** | 5.3 ms · 6.95× | 7.1 ms · 9.30× |

## Projects

### [TypeScript compiler](https://github.com/microsoft/TypeScript/tree/050880ce59e30b356b686bd3144efe24f875ebc8)

77 files · 9.0 MB · TypeScript

![Bar chart of the time each analyzer takes on TypeScript compiler](charts/typescript.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **162 ms** | **±0.16%** | **145 ms** | **165 ms** | **baseline** |
| TypeScript | 824 ms | ±0.19% | 810 ms | 1,819 ms | 5.10× slower |
| typescript-eslint | 1,293 ms | ±0.70% | 1,240 ms | 1,447 ms | 8.00× slower |

### [Excalidraw](https://github.com/excalidraw/excalidraw/tree/1919728724a1b71af73cb7e6d2d1a418a1415b1c)

618 files · 7.6 MB · declarations, JavaScript, TypeScript, TSX

![Bar chart of the time each analyzer takes on Excalidraw](charts/excalidraw.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **128 ms** | **±1.53%** | **126 ms** | **184 ms** | **baseline** |
| TypeScript | 684 ms | ±0.33% | 664 ms | 725 ms | 5.35× slower |
| typescript-eslint | 1,089 ms | ±0.68% | 1,050 ms | 1,228 ms | 8.52× slower |

### [three.js](https://github.com/mrdoob/three.js/tree/157f0885b8428b5ffe8f6f7309b2d6f59faa1497)

755 files · 4.4 MB · JavaScript

![Bar chart of the time each analyzer takes on three.js](charts/three.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **68.8 ms** | **±0.77%** | **65.5 ms** | **91.8 ms** | **baseline** |
| TypeScript | 474 ms | ±0.39% | 456 ms | 501 ms | 6.88× slower |
| typescript-eslint | 569 ms | ±1.06% | 544 ms | 1,072 ms | 8.27× slower |

### [Vue](https://github.com/vuejs/core/tree/4ab865a848a1da3d10fb674f857e5fff13094644)

473 files · 4.1 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on Vue](charts/vue.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **96.7 ms** | **±1.93%** | **82.4 ms** | **171 ms** | **baseline** |
| TypeScript | 467 ms | ±0.37% | 447 ms | 488 ms | 4.83× slower |
| typescript-eslint | 754 ms | ±0.74% | 729 ms | 918 ms | 7.80× slower |

### [Zod](https://github.com/colinhacks/zod/tree/004d800c9e3cd4c79930f55aa4ad080225b22efd)

332 files · 2.9 MB · TypeScript

![Bar chart of the time each analyzer takes on Zod](charts/zod.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **83.2 ms** | **±3.28%** | **67.1 ms** | **120 ms** | **baseline** |
| TypeScript | 328 ms | ±0.77% | 312 ms | 363 ms | 3.94× slower |
| typescript-eslint | 621 ms | ±0.67% | 598 ms | 672 ms | 7.47× slower |

### [date-fns](https://github.com/date-fns/date-fns/tree/717ce0a807ea4c6b540d015b5c408723175b2838)

1,643 files · 2.8 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on date-fns](charts/date_fns.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **76.7 ms** | **±2.99%** | **64.3 ms** | **123 ms** | **baseline** |
| typescript-eslint | 426 ms | ±0.70% | 410 ms | 459 ms | 5.55× slower |
| TypeScript | 430 ms | ±0.66% | 410 ms | 462 ms | 5.61× slower |

### [Svelte](https://github.com/sveltejs/svelte/tree/020242d6bef059df9ae8c13dc8dbff4c9b31e0ff)

416 files · 1.9 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on Svelte](charts/svelte.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **45.3 ms** | **±2.38%** | **37.9 ms** | **76.5 ms** | **baseline** |
| TypeScript | 288 ms | ±0.52% | 275 ms | 313 ms | 6.35× slower |
| typescript-eslint | 308 ms | ±0.79% | 300 ms | 360 ms | 6.79× slower |

### [Preact](https://github.com/preactjs/preact/tree/3fcc391adc243d479ab10b4cf70fa609708c9348)

33 files · 0.3 MB · declarations, JavaScript

![Bar chart of the time each analyzer takes on Preact](charts/preact.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **4.7 ms** | **±2.49%** | **4.3 ms** | **23.5 ms** | **baseline** |
| TypeScript | 28.5 ms | ±0.68% | 27.6 ms | 40.3 ms | 6.11× slower |
| typescript-eslint | 53.4 ms | ±0.86% | 47.6 ms | 66.2 ms | 11.5× slower |

## Single files

### [typescript.js](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/typescript.js)

1 file · 7.8 MB · JavaScript

![Bar chart of the time each analyzer takes on typescript.js](charts/typescript_js.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **122 ms** | **±1.94%** | **105 ms** | **147 ms** | **baseline** |
| TypeScript | 776 ms | ±0.39% | 753 ms | 889 ms | 6.36× slower |
| typescript-eslint | 1,299 ms | ±0.72% | 1,223 ms | 1,375 ms | 10.6× slower |

### [checker.ts](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/checker.ts)

1 file · 3.0 MB · TypeScript

![Bar chart of the time each analyzer takes on checker.ts](charts/checker.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **50.1 ms** | **±2.64%** | **44.1 ms** | **79.3 ms** | **baseline** |
| TypeScript | 273 ms | ±0.60% | 263 ms | 286 ms | 5.46× slower |
| typescript-eslint | 425 ms | ±0.76% | 404 ms | 471 ms | 8.49× slower |

### [lib.dom.d.ts](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/lib.dom.d.ts)

1 file · 2.2 MB · declarations

![Bar chart of the time each analyzer takes on lib.dom.d.ts](charts/lib_dom.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **20.6 ms** | **±0.40%** | **18.9 ms** | **22.5 ms** | **baseline** |
| TypeScript | 83.0 ms | ±0.62% | 78.8 ms | 93.3 ms | 4.02× slower |
| typescript-eslint | 193 ms | ±2.30% | 174 ms | 355 ms | 9.37× slower |

### [react.js](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/react.js)

1 file · 0.1 MB · JavaScript

![Bar chart of the time each analyzer takes on react.js](charts/react.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **0.76 ms** | **±2.31%** | **0.70 ms** | **23.9 ms** | **baseline** |
| TypeScript | 5.3 ms | ±1.36% | 5.0 ms | 47.4 ms | 6.95× slower |
| typescript-eslint | 7.1 ms | ±1.24% | 6.7 ms | 35.6 ms | 9.30× slower |

## Analyzers

| Analyzer | Packages | What it is |
|----------|----------|------------|
| [Yuku](https://github.com/yuku-toolchain/yuku) | `yuku-analyzer` | Computed natively in Zig, in the same pass as the parse. |
| [TypeScript](https://github.com/microsoft/typescript-go) | `typescript@7` | The TypeScript compiler, written in Go, through its API. |
| [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/scope-manager) | `@typescript-eslint/typescript-estree` + `@typescript-eslint/scope-manager` | The parser and scope analysis behind typescript-eslint, linked across files by the benchmark. |

## Methodology

### The work

Every analyzer does the same job on a whole codebase, the job an editor, linter, or bundler needs done:

1. Parse every file into an AST of JavaScript objects.
2. Bind its scopes and declarations, with TypeScript's declaration merging and its separate value, type, and namespace spaces.
3. Resolve every reference to its declaration.
4. Follow every import and re-export across files to the declaration it names.

### Codebases

Each project is its source directories at a pinned commit, the files its own `tsconfig` covers. The single files are the [parser benchmark files](https://github.com/yuku-toolchain/parser-benchmark-files).

### Measurement

Every analyzer × codebase runs in its own freshly spawned Node.js process, so JIT state and garbage from one never affect another. Timing uses [Tinybench](https://github.com/tinylibs/tinybench), with warmup iterations followed by timed iterations, in 3 independent runs per analyzer. The reported median is the median across those runs, which is robust to GC pauses and scheduling blips. RME is the relative margin of error (99% confidence) within a run.

## System

| Property | Value |
|----------|-------|
| OS | macOS 25.6.0 (arm64) |
| CPU | Apple M3 |
| Cores | 8 |
| Memory | 16 GB |
| Runtime | Node.js v24.14.1 |

## Run the benchmarks

Requires [Node.js](https://nodejs.org/) 24 and [Bun](https://bun.sh/).

```bash
git clone https://github.com/yuku-toolchain/ecmascript-analyzer-benchmark-js.git
cd ecmascript-analyzer-benchmark-js
bun install
bun load-files
bun bench
```

`bun load-files` downloads the benchmark files and the pinned projects. `bun bench` measures every codebase on Node.js, saves the results to `result/`, and regenerates this README. Measure some codebases only by naming them, as in `node scripts/bench.ts vue zod`.

| Variable | Default | Meaning |
|----------|---------|---------|
| `BENCH_TIME` | 10000 | Timed duration per run, in ms |
| `BENCH_WARMUP` | 2000 | Warmup duration per run, in ms |
| `BENCH_RUNS` | 3 | Independent runs per analyzer |

For the most stable numbers, run on AC power with nothing else running.
