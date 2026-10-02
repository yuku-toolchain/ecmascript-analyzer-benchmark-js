# ECMAScript Analyzer Benchmark (npm)

How fast the JavaScript and TypeScript analyzers on npm build the semantic model of real codebases: every scope and binding, every reference resolved to its declaration, and every import linked across files.

## Summary

Median time to analyze a whole codebase. The fastest in each row is bold, and every other time shows how many times it is of the fastest.

| | Files | Yuku | TypeScript 7 | TypeScript 6 | typescript-eslint |
|---|---:|---|---|---|---|
| [TypeScript compiler](#typescript-compiler) | 77 | **150 ms** | 829 ms · 5.52× | 681 ms · 4.53× | 1,256 ms · 8.36× |
| [Excalidraw](#excalidraw) | 618 | **126 ms** | 682 ms · 5.40× | 597 ms · 4.73× | 1,068 ms · 8.46× |
| [three.js](#threejs) | 755 | **67.1 ms** | 475 ms · 7.08× | 377 ms · 5.62× | 548 ms · 8.17× |
| [Vue](#vue) | 473 | **95.6 ms** | 465 ms · 4.86× | 418 ms · 4.38× | 748 ms · 7.82× |
| [Zod](#zod) | 332 | **82.5 ms** | 321 ms · 3.89× | 298 ms · 3.61× | 617 ms · 7.48× |
| [date-fns](#date-fns) | 1,643 | **74.0 ms** | 431 ms · 5.82× | 253 ms · 3.42× | 410 ms · 5.55× |
| [Svelte](#svelte) | 416 | **48.7 ms** | 288 ms · 5.91× | 219 ms · 4.50× | 306 ms · 6.28× |
| [Preact](#preact) | 33 | **4.7 ms** | 28.6 ms · 6.11× | 20.8 ms · 4.45× | 53.0 ms · 11.3× |

On single files:

| | Files | Yuku | TypeScript 7 | TypeScript 6 | typescript-eslint |
|---|---:|---|---|---|---|
| [typescript.js](#typescriptjs) | 1 | **125 ms** | 774 ms · 6.17× | 788 ms · 6.28× | 1,289 ms · 10.3× |
| [checker.ts](#checkerts) | 1 | **50.3 ms** | 273 ms · 5.42× | 237 ms · 4.72× | 432 ms · 8.59× |
| [lib.dom.d.ts](#libdomdts) | 1 | **20.7 ms** | 82.6 ms · 4.00× | 66.4 ms · 3.22× | 183 ms · 8.84× |
| [react.js](#reactjs) | 1 | **0.75 ms** | 5.2 ms · 6.92× | 4.8 ms · 6.38× | 6.9 ms · 9.24× |

## Projects

### [TypeScript compiler](https://github.com/microsoft/TypeScript/tree/050880ce59e30b356b686bd3144efe24f875ebc8)

77 files · 9.0 MB · TypeScript

![Bar chart of the time each analyzer takes on TypeScript compiler](charts/typescript.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **150 ms** | **±0.81%** | **141 ms** | **198 ms** | **baseline** |
| TypeScript 6 | 681 ms | ±0.47% | 659 ms | 739 ms | 4.53× slower |
| TypeScript 7 | 829 ms | ±1.12% | 804 ms | 1,264 ms | 5.52× slower |
| typescript-eslint | 1,256 ms | ±0.68% | 1,230 ms | 1,729 ms | 8.36× slower |

### [Excalidraw](https://github.com/excalidraw/excalidraw/tree/1919728724a1b71af73cb7e6d2d1a418a1415b1c)

618 files · 7.6 MB · declarations, JavaScript, TypeScript, TSX

![Bar chart of the time each analyzer takes on Excalidraw](charts/excalidraw.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **126 ms** | **±1.55%** | **124 ms** | **210 ms** | **baseline** |
| TypeScript 6 | 597 ms | ±0.35% | 585 ms | 638 ms | 4.73× slower |
| TypeScript 7 | 682 ms | ±0.30% | 664 ms | 713 ms | 5.40× slower |
| typescript-eslint | 1,068 ms | ±0.57% | 1,042 ms | 1,365 ms | 8.46× slower |

### [three.js](https://github.com/mrdoob/three.js/tree/157f0885b8428b5ffe8f6f7309b2d6f59faa1497)

755 files · 4.4 MB · JavaScript

![Bar chart of the time each analyzer takes on three.js](charts/three.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **67.1 ms** | **±1.11%** | **64.1 ms** | **85.8 ms** | **baseline** |
| TypeScript 6 | 377 ms | ±0.54% | 367 ms | 412 ms | 5.62× slower |
| TypeScript 7 | 475 ms | ±0.37% | 457 ms | 530 ms | 7.08× slower |
| typescript-eslint | 548 ms | ±0.63% | 536 ms | 644 ms | 8.17× slower |

### [Vue](https://github.com/vuejs/core/tree/4ab865a848a1da3d10fb674f857e5fff13094644)

473 files · 4.1 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on Vue](charts/vue.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **95.6 ms** | **±3.08%** | **81.2 ms** | **153 ms** | **baseline** |
| TypeScript 6 | 418 ms | ±0.48% | 405 ms | 456 ms | 4.38× slower |
| TypeScript 7 | 465 ms | ±0.37% | 447 ms | 503 ms | 4.86× slower |
| typescript-eslint | 748 ms | ±0.72% | 721 ms | 923 ms | 7.82× slower |

### [Zod](https://github.com/colinhacks/zod/tree/004d800c9e3cd4c79930f55aa4ad080225b22efd)

332 files · 2.9 MB · TypeScript

![Bar chart of the time each analyzer takes on Zod](charts/zod.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **82.5 ms** | **±3.35%** | **66.1 ms** | **119 ms** | **baseline** |
| TypeScript 6 | 298 ms | ±0.64% | 287 ms | 325 ms | 3.61× slower |
| TypeScript 7 | 321 ms | ±0.64% | 308 ms | 352 ms | 3.89× slower |
| typescript-eslint | 617 ms | ±0.77% | 600 ms | 681 ms | 7.48× slower |

### [date-fns](https://github.com/date-fns/date-fns/tree/717ce0a807ea4c6b540d015b5c408723175b2838)

1,643 files · 2.8 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on date-fns](charts/date_fns.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **74.0 ms** | **±2.52%** | **63.7 ms** | **123 ms** | **baseline** |
| TypeScript 6 | 253 ms | ±0.41% | 247 ms | 271 ms | 3.42× slower |
| typescript-eslint | 410 ms | ±0.67% | 400 ms | 452 ms | 5.55× slower |
| TypeScript 7 | 431 ms | ±0.68% | 412 ms | 464 ms | 5.82× slower |

### [Svelte](https://github.com/sveltejs/svelte/tree/020242d6bef059df9ae8c13dc8dbff4c9b31e0ff)

416 files · 1.9 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on Svelte](charts/svelte.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **48.7 ms** | **±2.63%** | **37.9 ms** | **78.8 ms** | **baseline** |
| TypeScript 6 | 219 ms | ±0.77% | 206 ms | 234 ms | 4.50× slower |
| TypeScript 7 | 288 ms | ±0.48% | 276 ms | 319 ms | 5.91× slower |
| typescript-eslint | 306 ms | ±0.65% | 296 ms | 340 ms | 6.28× slower |

### [Preact](https://github.com/preactjs/preact/tree/3fcc391adc243d479ab10b4cf70fa609708c9348)

33 files · 0.3 MB · declarations, JavaScript

![Bar chart of the time each analyzer takes on Preact](charts/preact.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **4.7 ms** | **±2.56%** | **4.3 ms** | **23.1 ms** | **baseline** |
| TypeScript 6 | 20.8 ms | ±1.37% | 19.7 ms | 35.6 ms | 4.45× slower |
| TypeScript 7 | 28.6 ms | ±0.65% | 27.6 ms | 38.3 ms | 6.11× slower |
| typescript-eslint | 53.0 ms | ±0.74% | 47.3 ms | 61.6 ms | 11.3× slower |

## Single files

### [typescript.js](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/typescript.js)

1 file · 7.8 MB · JavaScript

![Bar chart of the time each analyzer takes on typescript.js](charts/typescript_js.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **125 ms** | **±1.87%** | **105 ms** | **147 ms** | **baseline** |
| TypeScript 7 | 774 ms | ±0.44% | 754 ms | 841 ms | 6.17× slower |
| TypeScript 6 | 788 ms | ±0.24% | 768 ms | 815 ms | 6.28× slower |
| typescript-eslint | 1,289 ms | ±0.85% | 1,215 ms | 1,566 ms | 10.3× slower |

### [checker.ts](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/checker.ts)

1 file · 3.0 MB · TypeScript

![Bar chart of the time each analyzer takes on checker.ts](charts/checker.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **50.3 ms** | **±2.57%** | **44.3 ms** | **81.5 ms** | **baseline** |
| TypeScript 6 | 237 ms | ±0.50% | 228 ms | 258 ms | 4.72× slower |
| TypeScript 7 | 273 ms | ±0.61% | 262 ms | 286 ms | 5.42× slower |
| typescript-eslint | 432 ms | ±0.92% | 402 ms | 496 ms | 8.59× slower |

### [lib.dom.d.ts](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/lib.dom.d.ts)

1 file · 2.2 MB · declarations

![Bar chart of the time each analyzer takes on lib.dom.d.ts](charts/lib_dom.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **20.7 ms** | **±0.39%** | **19.0 ms** | **24.0 ms** | **baseline** |
| TypeScript 6 | 66.4 ms | ±1.00% | 60.5 ms | 81.5 ms | 3.22× slower |
| TypeScript 7 | 82.6 ms | ±0.61% | 78.7 ms | 92.9 ms | 4.00× slower |
| typescript-eslint | 183 ms | ±1.04% | 170 ms | 219 ms | 8.84× slower |

### [react.js](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/react.js)

1 file · 0.1 MB · JavaScript

![Bar chart of the time each analyzer takes on react.js](charts/react.png)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **0.75 ms** | **±2.15%** | **0.69 ms** | **13.2 ms** | **baseline** |
| TypeScript 6 | 4.8 ms | ±1.30% | 4.6 ms | 13.6 ms | 6.38× slower |
| TypeScript 7 | 5.2 ms | ±0.86% | 5.0 ms | 27.8 ms | 6.92× slower |
| typescript-eslint | 6.9 ms | ±0.22% | 6.6 ms | 12.7 ms | 9.24× slower |

## Analyzers

| Analyzer | Packages | What it is |
|----------|----------|------------|
| [Yuku](https://github.com/yuku-toolchain/yuku) | `yuku-analyzer` | Computed natively in Zig, in the same pass as the parse. |
| [TypeScript 7](https://github.com/microsoft/typescript-go) | `typescript@7` | The TypeScript compiler in Go, through its API. |
| [TypeScript 6](https://github.com/microsoft/TypeScript) | `typescript@6` | The TypeScript compiler in JavaScript, through its compiler API. |
| [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/scope-manager) | `@typescript-eslint/typescript-estree` + `@typescript-eslint/scope-manager` | The parser and scope analysis behind typescript-eslint, one file at a time. |

## Methodology

### The work

Every analyzer builds the semantic model of a whole codebase, the work an editor, linter, or bundler needs from it:

1. Parse every file.
2. Bind its scopes and declarations, with TypeScript's declaration merging and its separate value, type, and namespace spaces.
3. Resolve every reference to its declaration.
4. Follow every import and export across files to the declaration it names.

Every analyzer also hands back the whole AST as JavaScript objects, which Yuku otherwise builds only when it is read. Every analyzer gets the same files and options, with no default library, so a global stays unresolved in all of them. Vue and Preact map their package names to source directories, which every analyzer that links imports follows. Yuku reports its references directly. TypeScript has no list of references, so every identifier its own AST places in a reference position is resolved through the checker, which gives the same references as Yuku within 1%.

typescript-eslint analyzes one file at a time and never links imports, so it does less of the work than the others.

### Codebases

Each project is its source directories at a pinned commit, the files its own `tsconfig` covers. The single files are the [parser benchmark files](https://github.com/yuku-toolchain/parser-benchmark-files).

### Measurement

Every analyzer × codebase runs in its own freshly spawned Node.js process, so JIT state and garbage from one never affect another. Timing uses [Tinybench](https://github.com/tinylibs/tinybench), with warmup iterations followed by timed iterations, in 3 independent runs per analyzer. The reported median is the median across those runs, which is robust to GC pauses and scheduling blips. RME is the relative margin of error (99% confidence) within a run.

### TypeScript 7

TypeScript 7 runs in Go, in a server process. It parses and binds a project on several threads in a small part of its total. Most of its time goes to returning the resolved symbols to JavaScript through `typescript/unstable/sync`, the API any JavaScript tool reaches it through. Each run opens the project at fresh paths, so the server reuses nothing from an earlier run.

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
