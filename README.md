# ECMAScript Analyzer Benchmark (npm)

How fast the JavaScript and TypeScript analyzers on npm build the semantic model of real codebases: every scope and binding, every reference resolved to its declaration, and every import linked across files.

## Summary

Median time to analyze a whole codebase. The fastest in each row is bold, and every other time shows how many times it is of the fastest.

| | Files | Yuku | TypeScript | typescript-eslint |
|---|---:|---|---|---|
| [TypeScript compiler](#typescript-compiler) | 77 | **132 ms** | 837 ms · 6.35× | 1,290 ms · 9.79× |
| [Excalidraw](#excalidraw) | 618 | **101 ms** | 684 ms · 6.76× | 1,088 ms · 10.7× |
| [three.js](#threejs) | 755 | **53.6 ms** | 473 ms · 8.82× | 571 ms · 10.7× |
| [Vue](#vue) | 473 | **72.7 ms** | 469 ms · 6.46× | 758 ms · 10.4× |
| [Zod](#zod) | 332 | **48.4 ms** | 324 ms · 6.69× | 635 ms · 13.1× |
| [date-fns](#date-fns) | 1,643 | **53.7 ms** | 432 ms · 8.04× | 417 ms · 7.77× |
| [Svelte](#svelte) | 416 | **31.4 ms** | 289 ms · 9.23× | 318 ms · 10.1× |
| [Preact](#preact) | 33 | **2.9 ms** | 28.8 ms · 10.1× | 53.5 ms · 18.7× |

On single files:

| | Files | Yuku | TypeScript | typescript-eslint |
|---|---:|---|---|---|
| [typescript.js](#typescriptjs) | 1 | **85.9 ms** | 773 ms · 9.00× | 1,288 ms · 15.0× |
| [checker.ts](#checkerts) | 1 | **32.7 ms** | 272 ms · 8.33× | 430 ms · 13.2× |
| [lib.dom.d.ts](#libdomdts) | 1 | **8.5 ms** | 82.0 ms · 9.59× | 185 ms · 21.6× |
| [react.js](#reactjs) | 1 | **0.48 ms** | 5.2 ms · 10.8× | 6.9 ms · 14.4× |

## Projects

### [TypeScript compiler](https://github.com/microsoft/TypeScript/tree/050880ce59e30b356b686bd3144efe24f875ebc8)

77 files · 9.0 MB · TypeScript

![Bar chart of the time each analyzer takes on TypeScript compiler](charts/typescript.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **132 ms** | **±0.45%** | **122 ms** | **153 ms** | **baseline** |
| TypeScript | 837 ms | ±1.16% | 816 ms | 1,107 ms | 6.35× slower |
| typescript-eslint | 1,290 ms | ±0.80% | 1,249 ms | 1,494 ms | 9.79× slower |

### [Excalidraw](https://github.com/excalidraw/excalidraw/tree/1919728724a1b71af73cb7e6d2d1a418a1415b1c)

618 files · 7.6 MB · declarations, JavaScript, TypeScript, TSX

![Bar chart of the time each analyzer takes on Excalidraw](charts/excalidraw.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **101 ms** | **±1.74%** | **92.7 ms** | **173 ms** | **baseline** |
| TypeScript | 684 ms | ±0.38% | 662 ms | 726 ms | 6.76× slower |
| typescript-eslint | 1,088 ms | ±0.69% | 1,054 ms | 1,235 ms | 10.7× slower |

### [three.js](https://github.com/mrdoob/three.js/tree/157f0885b8428b5ffe8f6f7309b2d6f59faa1497)

755 files · 4.4 MB · JavaScript

![Bar chart of the time each analyzer takes on three.js](charts/three.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **53.6 ms** | **±1.39%** | **44.3 ms** | **64.5 ms** | **baseline** |
| TypeScript | 473 ms | ±0.49% | 455 ms | 526 ms | 8.82× slower |
| typescript-eslint | 571 ms | ±0.99% | 539 ms | 684 ms | 10.7× slower |

### [Vue](https://github.com/vuejs/core/tree/4ab865a848a1da3d10fb674f857e5fff13094644)

473 files · 4.1 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on Vue](charts/vue.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **72.7 ms** | **±1.49%** | **67.0 ms** | **127 ms** | **baseline** |
| TypeScript | 469 ms | ±0.44% | 450 ms | 587 ms | 6.46× slower |
| typescript-eslint | 758 ms | ±0.86% | 731 ms | 920 ms | 10.4× slower |

### [Zod](https://github.com/colinhacks/zod/tree/004d800c9e3cd4c79930f55aa4ad080225b22efd)

332 files · 2.9 MB · TypeScript

![Bar chart of the time each analyzer takes on Zod](charts/zod.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **48.4 ms** | **±1.54%** | **39.3 ms** | **69.9 ms** | **baseline** |
| TypeScript | 324 ms | ±0.63% | 310 ms | 377 ms | 6.69× slower |
| typescript-eslint | 635 ms | ±0.89% | 605 ms | 818 ms | 13.1× slower |

### [date-fns](https://github.com/date-fns/date-fns/tree/717ce0a807ea4c6b540d015b5c408723175b2838)

1,643 files · 2.8 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on date-fns](charts/date_fns.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **53.7 ms** | **±1.88%** | **41.0 ms** | **71.7 ms** | **baseline** |
| typescript-eslint | 417 ms | ±0.82% | 407 ms | 464 ms | 7.77× slower |
| TypeScript | 432 ms | ±0.96% | 410 ms | 561 ms | 8.04× slower |

### [Svelte](https://github.com/sveltejs/svelte/tree/020242d6bef059df9ae8c13dc8dbff4c9b31e0ff)

416 files · 1.9 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on Svelte](charts/svelte.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **31.4 ms** | **±1.91%** | **24.9 ms** | **47.4 ms** | **baseline** |
| TypeScript | 289 ms | ±0.69% | 277 ms | 321 ms | 9.23× slower |
| typescript-eslint | 318 ms | ±1.45% | 300 ms | 492 ms | 10.1× slower |

### [Preact](https://github.com/preactjs/preact/tree/3fcc391adc243d479ab10b4cf70fa609708c9348)

33 files · 0.3 MB · declarations, JavaScript

![Bar chart of the time each analyzer takes on Preact](charts/preact.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **2.9 ms** | **±0.62%** | **2.8 ms** | **27.6 ms** | **baseline** |
| TypeScript | 28.8 ms | ±0.96% | 27.6 ms | 75.7 ms | 10.1× slower |
| typescript-eslint | 53.5 ms | ±0.82% | 47.9 ms | 65.2 ms | 18.7× slower |

## Single files

### [typescript.js](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/typescript.js)

1 file · 7.8 MB · JavaScript

![Bar chart of the time each analyzer takes on typescript.js](charts/typescript_js.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **85.9 ms** | **±2.89%** | **77.9 ms** | **134 ms** | **baseline** |
| TypeScript | 773 ms | ±0.28% | 756 ms | 797 ms | 9.00× slower |
| typescript-eslint | 1,288 ms | ±0.69% | 1,223 ms | 1,417 ms | 15.0× slower |

### [checker.ts](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/checker.ts)

1 file · 3.0 MB · TypeScript

![Bar chart of the time each analyzer takes on checker.ts](charts/checker.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **32.7 ms** | **±2.18%** | **29.0 ms** | **50.9 ms** | **baseline** |
| TypeScript | 272 ms | ±0.63% | 260 ms | 289 ms | 8.33× slower |
| typescript-eslint | 430 ms | ±0.81% | 405 ms | 522 ms | 13.2× slower |

### [lib.dom.d.ts](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/lib.dom.d.ts)

1 file · 2.2 MB · declarations

![Bar chart of the time each analyzer takes on lib.dom.d.ts](charts/lib_dom.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **8.5 ms** | **±1.36%** | **8.0 ms** | **21.6 ms** | **baseline** |
| TypeScript | 82.0 ms | ±0.57% | 78.3 ms | 90.6 ms | 9.59× slower |
| typescript-eslint | 185 ms | ±0.96% | 174 ms | 206 ms | 21.6× slower |

### [react.js](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/react.js)

1 file · 0.1 MB · JavaScript

![Bar chart of the time each analyzer takes on react.js](charts/react.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **0.48 ms** | **±0.04%** | **0.47 ms** | **1.3 ms** | **baseline** |
| TypeScript | 5.2 ms | ±1.04% | 5.0 ms | 35.8 ms | 10.8× slower |
| typescript-eslint | 6.9 ms | ±1.20% | 6.6 ms | 15.1 ms | 14.4× slower |

## Analyzers

| Analyzer | Packages | What it is |
|----------|----------|------------|
| [Yuku](https://github.com/yuku-toolchain/yuku) | `Yuku Analyzer` | Computed natively in Zig, in the same pass as the parse. |
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
