---
id: du
title: "du"
type: command
stage: 5
category: system-information
mode: detailed
difficulty: beginner
summary: "Estimate storage used by files and directories."
tags: [disk usage, directories, sorting]
related: [df, sort, find]
---
# `du` — Detailed

## What it does

Estimate storage used by files and directories.

## Why it matters

System tools answer different questions: a process snapshot, host memory summary, filesystem capacity, path usage estimate, or command duration. These observations help diagnose resource pressure, but live numbers depend on the host and moment you sample them.

## Syntax

```text
du [OPTIONS] [FILE...]
```

## Arguments and options

`-h` human-readable units; `-s` one summary per operand; `-a` include files as well as directories; `--max-depth=N` limit displayed directory depth (GNU); `-b` apparent size in bytes; `--apparent-size` ignore allocated block rounding.

## Core concept

`du` walks the requested paths and estimates their usage. Its default reports allocated space, so small files may each appear as one filesystem block and totals vary by filesystem. `du -b` or `du --apparent-size` reports logical file sizes, which is useful for deterministic synthetic-file checks. Sort human-readable values with `sort -h` or byte values numerically with `sort -n`.

## Examples

```bash
du -sh playground
```

One readable aggregate for the playground; allocated usage varies by filesystem.

```bash
du -h --max-depth=1 playground | sort -h
```

One-level directory summaries ordered from smaller to larger; rounded sizes may tie.

```bash
du -ab playground/projects/atlas | sort -n | tail -n 8
```

Largest apparent byte totals among this small project subtree; fixture byte counts are stable.

## Practical scenario

Compare the playground subdirectories. Use `du -h --max-depth=1` for a quick overview and sort by size; use apparent bytes when you need exact fixture sizes.

## Common mistakes

Confusing allocated blocks with apparent bytes. Expecting sorted input order from du. Scanning `/` may be slow and produce permission errors; stay within the repository playground. Hidden files are included by du because it traverses directory entries rather than shell globs.

## Safety notes

These examples inspect system state or read synthetic files. They do not change system configuration or delete data. Keep recursive `du` and other path inspections scoped to `playground/`; avoid expensive scans of the entire filesystem. Do not treat memory, process, filesystem-capacity, or timing values as fixture facts.

## Exercises

### Guided practice

1. Run the first example and identify which information is live and which comes from a fixed playground fixture.
2. Run a second example with a different display mode or scope.
3. Explain why its output can change across hosts or runs.

### Independent practice

Summarize playground usage, compare its immediate subdirectories, then inspect `playground/projects/atlas` with byte counts and numeric sorting.

### Combination challenge

Combine `du` with one related command to inspect a resource question. State what the command measures and what it does not measure.

<details>
<summary>Show exercise answers</summary>

```bash
du -sh playground
du -h --max-depth=1 playground | sort -h
du -ab playground/projects/atlas | sort -n | tail -n 8
```

</details>

## Reset

These examples are read-only. No reset is required.

## Related commands

- [`df` — Detailed](./df.detailed.md)
- [`sort` — Detailed](../04-text-processing/sort.detailed.md)
- [`find` — Detailed](../03-file-search/find.detailed.md)
- [`du` — Revision](./du.revision.md)
