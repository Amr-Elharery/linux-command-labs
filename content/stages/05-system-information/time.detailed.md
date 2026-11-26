---
id: time
title: "time"
type: command
stage: 5
category: system-information
mode: detailed
difficulty: beginner
summary: "Measure elapsed real time and CPU time used by a command."
tags: [timing, performance, shell]
related: [top, awk]
---
# `time` — Detailed

## What it does

Measure elapsed real time and CPU time used by a command.

## Why it matters

System tools answer different questions: a process snapshot, host memory summary, filesystem capacity, path usage estimate, or command duration. These observations help diagnose resource pressure, but live numbers depend on the host and moment you sample them.

## Syntax

```text
time COMMAND [ARGUMENTS...]
```

## Arguments and options

Bash's `time` keyword reports `real`, `user`, and `sys`; use `TIMEFORMAT` to format Bash output. GNU `/usr/bin/time` has additional formatting options but is a separate program.

## Core concept

Real time is elapsed wall-clock time. User time is CPU time spent running the command's user-space code; system time is CPU time spent in kernel operations on its behalf. User plus system may be less than real while waiting for I/O or scheduling, or can exceed real when multiple CPU cores run concurrently. Measurements vary between runs.

## Examples

```bash
time wc -l playground/data/transactions.csv
```

wc prints a deterministic count; timing is printed separately and varies.

```bash
TIMEFORMAT='real=%R user=%U sys=%S'; time awk -F, 'NR > 1 { n++ } END { print n }' playground/data/employees.csv
```

Prints the data-row count, then Bash reports real, user, and system seconds with variable values.

```bash
TIMEFORMAT='elapsed: %R seconds'; time sort playground/data/transactions.csv
```

Shows one elapsed-time value; it is not a stable benchmark.

## Practical scenario

Measure a small, repeatable command to learn the output format. Use larger controlled workloads for performance comparisons, repeat runs, and avoid drawing conclusions from a single tiny-file timing.

## Common mistakes

Treating a tiny command's reported time as a reliable benchmark. Confusing `real` with CPU time. Expecting user+system to equal wall time. Bash's `time` keyword and `/usr/bin/time` have different options and output formats.

## Safety notes

These examples inspect system state or read synthetic files. They do not change system configuration or delete data. Keep recursive `du` and other path inspections scoped to `playground/`; avoid expensive scans of the entire filesystem. Do not treat memory, process, filesystem-capacity, or timing values as fixture facts.

## Exercises

### Guided practice

1. Run the first example and identify which information is live and which comes from a fixed playground fixture.
2. Run a second example with a different display mode or scope.
3. Explain why its output can change across hosts or runs.

### Independent practice

Time a wc and sort operation. Record real/user/sys without expecting a particular value. Explain how waiting and CPU work affect the values.

### Combination challenge

Combine `time` with one related command to inspect a resource question. State what the command measures and what it does not measure.

<details>
<summary>Show exercise answers</summary>

```bash
time wc -l playground/data/transactions.csv
TIMEFORMAT='real=%R user=%U sys=%S'; time awk -F, 'NR > 1 { n++ } END { print n }' playground/data/employees.csv
TIMEFORMAT='elapsed: %R seconds'; time sort playground/data/transactions.csv
```

</details>

## Reset

These examples are read-only. No reset is required.

## Related commands

- [`top` — Detailed](./top.detailed.md)
- [`awk` — Detailed](../04-text-processing/awk.detailed.md)
- [`time` — Revision](./time.revision.md)
