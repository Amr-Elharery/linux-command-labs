---
id: du
title: "du"
type: command
stage: 5
category: system-information
mode: revision
difficulty: beginner
summary: "Estimate storage used by files and directories."
tags: [disk usage, directories, sorting]
related: [df, sort, find]
---
# `du` — Revision

> Estimate storage used by files and directories.

**Syntax:** `du [OPTIONS] [FILE...]`

**Useful options:** `-h` human-readable units; `-s` one summary per operand; `-a` include files as well as directories; `--max-depth=N` limit displayed directory depth (GNU); `-b` apparent size in bytes; `--apparent-size` ignore allocated block rounding.

**Remember:** `du` walks the requested paths and estimates their usage. Its default reports allocated space, so small files may each appear as one filesystem block and totals vary by filesystem. `du -b` or `du --apparent-size` reports logical file sizes, which is useful for deterministic synthetic-file checks. Sort human-readable values with `sort -h` or byte values numerically with `sort -n`.

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

## Quick recall

1. Summarize playground usage, compare its immediate subdirectories, then inspect `playground/projects/atlas` with byte counts and numeric sorting.
2. Which values here are fixed by a fixture, and which are live?
3. What does this command measure—and what does it not measure?

[Read the Detailed guide](./du.detailed.md).
