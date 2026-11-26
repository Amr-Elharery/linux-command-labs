---
id: free
title: "free"
type: command
stage: 5
category: system-information
mode: detailed
difficulty: beginner
summary: "Report physical memory and swap totals, use, and availability."
tags: [memory, swap, monitoring]
related: [top, df]
---
# `free` — Detailed

## What it does

Report physical memory and swap totals, use, and availability.

## Why it matters

System tools answer different questions: a process snapshot, host memory summary, filesystem capacity, path usage estimate, or command duration. These observations help diagnose resource pressure, but live numbers depend on the host and moment you sample them.

## Syntax

```text
free [OPTIONS]
```

## Arguments and options

`-h` human-readable units; `-b`, `-k`, `-m`, `-g` choose units; `-w` separates cache and buffers; `-s N` repeats at an interval.

## Core concept

`free` summarizes host memory, not the playground. On Linux, the `available` column estimates memory usable by applications without swapping; it is usually more informative than the `free` column alone because the kernel uses spare memory for caches. Values vary continuously and can differ between a VM, container, and host.

## Examples

```bash
free -h
```

Human-readable memory and swap totals; numeric values vary.

```bash
free -h -w
```

Human-readable output with buffers and cache shown separately.

```bash
free -m
```

Memory values in MiB; exact values are host-dependent.

## Practical scenario

Check memory pressure during a task. Use `free -h` for a readable summary and compare `available` rather than assuming all cached memory is unavailable.

## Common mistakes

Treating all used memory as permanently unavailable. Assuming `free` reports memory reserved for the playground. Comparing two readings taken at different times as though they were fixed fixture data.

## Safety notes

These examples inspect system state or read synthetic files. They do not change system configuration or delete data. Keep recursive `du` and other path inspections scoped to `playground/`; avoid expensive scans of the entire filesystem. Do not treat memory, process, filesystem-capacity, or timing values as fixture facts.

## Exercises

### Guided practice

1. Run the first example and identify which information is live and which comes from a fixed playground fixture.
2. Run a second example with a different display mode or scope.
3. Explain why its output can change across hosts or runs.

### Independent practice

Run `free -h` twice. Identify total, used, free, shared, buff/cache, available, and swap. Explain why the two readings may differ.

### Combination challenge

Combine `free` with one related command to inspect a resource question. State what the command measures and what it does not measure.

<details>
<summary>Show exercise answers</summary>

```bash
free -h
free -h -w
free -m
```

</details>

## Reset

These examples are read-only. No reset is required.

## Related commands

- [`top` — Detailed](./top.detailed.md)
- [`df` — Detailed](./df.detailed.md)
- [`free` — Revision](./free.revision.md)
