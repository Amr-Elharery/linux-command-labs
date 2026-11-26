---
id: free
title: "free"
type: command
stage: 5
category: system-information
mode: revision
difficulty: beginner
summary: "Report physical memory and swap totals, use, and availability."
tags: [memory, swap, monitoring]
related: [top, df]
---
# `free` — Revision

> Report physical memory and swap totals, use, and availability.

**Syntax:** `free [OPTIONS]`

**Useful options:** `-h` human-readable units; `-b`, `-k`, `-m`, `-g` choose units; `-w` separates cache and buffers; `-s N` repeats at an interval.

**Remember:** `free` summarizes host memory, not the playground. On Linux, the `available` column estimates memory usable by applications without swapping; it is usually more informative than the `free` column alone because the kernel uses spare memory for caches. Values vary continuously and can differ between a VM, container, and host.

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

## Quick recall

1. Run `free -h` twice. Identify total, used, free, shared, buff/cache, available, and swap. Explain why the two readings may differ.
2. Which values here are fixed by a fixture, and which are live?
3. What does this command measure—and what does it not measure?

[Read the Detailed guide](./free.detailed.md).
