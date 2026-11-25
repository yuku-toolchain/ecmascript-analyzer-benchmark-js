# ECMAScript Analyzer Benchmark (npm)

How fast the JavaScript and TypeScript analyzers on npm build the semantic model of real codebases: every scope and binding, every reference resolved to its declaration, and every import linked across files.

## Summary

Median time to analyze a whole codebase. The fastest in each row is bold, and every other time shows how many times it is of the fastest.

| | Files | Yuku | TypeScript | typescript-eslint |
|---|---:|---|---|---|
| [TypeScript compiler](#typescript-compiler) | 77 | **119 ms** | 827 ms · 6.94× | 1,417 ms · 11.9× |
| [Excalidraw](#excalidraw) | 618 | **94.9 ms** | 735 ms · 7.74× | 1,139 ms · 12.0× |
| [three.js](#threejs) | 755 | **53.1 ms** | 492 ms · 9.27× | 579 ms · 10.9× |
| [Vue](#vue) | 473 | **62.2 ms** | 483 ms · 7.77× | 765 ms · 12.3× |
| [Zod](#zod) | 332 | **42.7 ms** | 332 ms · 7.77× | 641 ms · 15.0× |
| [date-fns](#date-fns) | 1,643 | **49.7 ms** | 438 ms · 8.81× | 428 ms · 8.61× |
| [Svelte](#svelte) | 416 | **28.2 ms** | 298 ms · 10.6× | 317 ms · 11.2× |
| [Preact](#preact) | 33 | **2.3 ms** | 29.7 ms · 13.0× | 54.8 ms · 23.9× |

On single files:

| | Files | Yuku | TypeScript | typescript-eslint |
|---|---:|---|---|---|
| [typescript.js](#typescriptjs) | 1 | **90.4 ms** | 793 ms · 8.76× | 1,297 ms · 14.3× |
| [checker.ts](#checkerts) | 1 | **30.3 ms** | 280 ms · 9.23× | 433 ms · 14.3× |
| [lib.dom.d.ts](#libdomdts) | 1 | **7.4 ms** | 82.9 ms · 11.2× | 193 ms · 26.1× |
| [react.js](#reactjs) | 1 | **0.34 ms** | 5.3 ms · 15.6× | 7.3 ms · 21.3× |

## Projects

### [TypeScript compiler](https://github.com/microsoft/TypeScript/tree/050880ce59e30b356b686bd3144efe24f875ebc8)

77 files · 9.0 MB · TypeScript

![Bar chart of the time each analyzer takes on TypeScript compiler](charts/typescript.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **119 ms** | **±2.01%** | **115 ms** | **203 ms** | **baseline** |
| TypeScript | 827 ms | ±0.53% | 804 ms | 1,052 ms | 6.94× slower |
| typescript-eslint | 1,417 ms | ±4.07% | 1,277 ms | 4,500 ms | 11.9× slower |

### [Excalidraw](https://github.com/excalidraw/excalidraw/tree/1919728724a1b71af73cb7e6d2d1a418a1415b1c)

618 files · 7.6 MB · declarations, JavaScript, TypeScript, TSX

![Bar chart of the time each analyzer takes on Excalidraw](charts/excalidraw.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **94.9 ms** | **±3.55%** | **82.9 ms** | **357 ms** | **baseline** |
| TypeScript | 735 ms | ±2.28% | 659 ms | 3,270 ms | 7.74× slower |
| typescript-eslint | 1,139 ms | ±1.53% | 1,066 ms | 1,471 ms | 12.0× slower |

### [three.js](https://github.com/mrdoob/three.js/tree/157f0885b8428b5ffe8f6f7309b2d6f59faa1497)

755 files · 4.4 MB · JavaScript

![Bar chart of the time each analyzer takes on three.js](charts/three.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **53.1 ms** | **±2.03%** | **38.2 ms** | **120 ms** | **baseline** |
| TypeScript | 492 ms | ±2.04% | 464 ms | 965 ms | 9.27× slower |
| typescript-eslint | 579 ms | ±1.47% | 543 ms | 867 ms | 10.9× slower |

### [Vue](https://github.com/vuejs/core/tree/4ab865a848a1da3d10fb674f857e5fff13094644)

473 files · 4.1 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on Vue](charts/vue.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **62.2 ms** | **±1.12%** | **59.2 ms** | **135 ms** | **baseline** |
| TypeScript | 483 ms | ±1.49% | 459 ms | 687 ms | 7.77× slower |
| typescript-eslint | 765 ms | ±1.20% | 737 ms | 986 ms | 12.3× slower |

### [Zod](https://github.com/colinhacks/zod/tree/004d800c9e3cd4c79930f55aa4ad080225b22efd)

332 files · 2.9 MB · TypeScript

![Bar chart of the time each analyzer takes on Zod](charts/zod.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **42.7 ms** | **±1.83%** | **33.2 ms** | **70.6 ms** | **baseline** |
| TypeScript | 332 ms | ±0.97% | 310 ms | 420 ms | 7.77× slower |
| typescript-eslint | 641 ms | ±1.36% | 607 ms | 1,200 ms | 15.0× slower |

### [date-fns](https://github.com/date-fns/date-fns/tree/717ce0a807ea4c6b540d015b5c408723175b2838)

1,643 files · 2.8 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on date-fns](charts/date_fns.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **49.7 ms** | **±3.46%** | **43.0 ms** | **205 ms** | **baseline** |
| typescript-eslint | 428 ms | ±1.04% | 412 ms | 670 ms | 8.61× slower |
| TypeScript | 438 ms | ±1.15% | 408 ms | 3,463 ms | 8.81× slower |

### [Svelte](https://github.com/sveltejs/svelte/tree/020242d6bef059df9ae8c13dc8dbff4c9b31e0ff)

416 files · 1.9 MB · declarations, JavaScript, TypeScript

![Bar chart of the time each analyzer takes on Svelte](charts/svelte.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **28.2 ms** | **±1.81%** | **21.4 ms** | **88.8 ms** | **baseline** |
| TypeScript | 298 ms | ±1.46% | 279 ms | 412 ms | 10.6× slower |
| typescript-eslint | 317 ms | ±1.46% | 303 ms | 453 ms | 11.2× slower |

### [Preact](https://github.com/preactjs/preact/tree/3fcc391adc243d479ab10b4cf70fa609708c9348)

33 files · 0.3 MB · declarations, JavaScript

![Bar chart of the time each analyzer takes on Preact](charts/preact.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **2.3 ms** | **±0.82%** | **2.2 ms** | **47.3 ms** | **baseline** |
| TypeScript | 29.7 ms | ±1.16% | 27.3 ms | 74.3 ms | 13.0× slower |
| typescript-eslint | 54.8 ms | ±2.72% | 48.2 ms | 326 ms | 23.9× slower |

## Single files

### [typescript.js](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/typescript.js)

1 file · 7.8 MB · JavaScript

![Bar chart of the time each analyzer takes on typescript.js](charts/typescript_js.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **90.4 ms** | **±3.80%** | **70.0 ms** | **197 ms** | **baseline** |
| TypeScript | 793 ms | ±1.55% | 756 ms | 1,577 ms | 8.76× slower |
| typescript-eslint | 1,297 ms | ±0.88% | 1,233 ms | 1,524 ms | 14.3× slower |

### [checker.ts](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/checker.ts)

1 file · 3.0 MB · TypeScript

![Bar chart of the time each analyzer takes on checker.ts](charts/checker.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **30.3 ms** | **±2.39%** | **25.8 ms** | **90.9 ms** | **baseline** |
| TypeScript | 280 ms | ±0.84% | 264 ms | 357 ms | 9.23× slower |
| typescript-eslint | 433 ms | ±1.15% | 409 ms | 572 ms | 14.3× slower |

### [lib.dom.d.ts](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/lib.dom.d.ts)

1 file · 2.2 MB · declarations

![Bar chart of the time each analyzer takes on lib.dom.d.ts](charts/lib_dom.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **7.4 ms** | **±1.90%** | **6.6 ms** | **56.4 ms** | **baseline** |
| TypeScript | 82.9 ms | ±0.74% | 78.3 ms | 229 ms | 11.2× slower |
| typescript-eslint | 193 ms | ±2.59% | 174 ms | 361 ms | 26.1× slower |

### [react.js](https://raw.githubusercontent.com/yuku-toolchain/parser-benchmark-files/refs/heads/main/react.js)

1 file · 0.1 MB · JavaScript

![Bar chart of the time each analyzer takes on react.js](charts/react.svg)

| Analyzer | Median | RME | Min | Max | Relative |
|----------|--------|-----|-----|-----|----------|
| **Yuku** | **0.34 ms** | **±0.65%** | **0.33 ms** | **23.0 ms** | **baseline** |
| TypeScript | 5.3 ms | ±2.13% | 5.0 ms | 81.2 ms | 15.6× slower |
| typescript-eslint | 7.3 ms | ±1.59% | 6.8 ms | 74.4 ms | 21.3× slower |

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
