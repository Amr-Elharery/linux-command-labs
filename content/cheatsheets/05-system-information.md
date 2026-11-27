---
id: 05-system-information
title: "System Information Cheat Sheet"
type: cheatsheet
stage: 5
summary: "Inspect processes, memory, filesystem capacity, path usage, and command duration."
commands: [top, free, df, du, time]
---

# System Information Cheat Sheet

## Commands covered

| Command | Purpose |
| --- | --- |
| `top` | Monitor processes and system load interactively or in batch mode. |
| `free` | Report physical memory and swap totals and availability. |
| `df` | Report capacity and free space for filesystems. |
| `du` | Estimate space used by files and directories. |
| `time` | Measure elapsed time and CPU time for a command. |

## Purpose

These tools inspect host resources or estimate path usage. Process, memory, filesystem, and timing values depend on the machine and moment; use synthetic `playground/` data when a reproducible path is needed.

## Essential syntax

```text
top [OPTIONS]
free [OPTIONS]
df [OPTIONS] [PATH...]
du [OPTIONS] [PATH...]
time COMMAND [ARGUMENTS...]
```

`df` is filesystem-level capacity. `du` estimates the space used by directory entries. They answer different questions.

## High-value options

- `top -b -n 1` takes one non-interactive batch snapshot; `-p PID` filters by process ID.
- `free -h` shows memory and swap in readable units.
- `df -h` uses readable units; `df -hT` also shows filesystem type; `-i` reports inode usage.
- `du -sh PATH` gives a recursive total; `du -h --max-depth=1 PATH` summarizes one level.
- `sort -h` orders human-readable size output; `sort -n` orders numeric byte counts.
- Bash `time` reports `real` (elapsed wall time), `user` (user-space CPU time), and `sys` (kernel CPU time). Bash `TIMEFORMAT` can format those values.

## Short examples

Run from the repository root:

```bash
top -b -n 1 | head -n 8
free -h
df -hT playground
du -sh playground
du -h --max-depth=1 playground | sort -h
time wc -l playground/data/transactions.csv
```

The `du` paths are synthetic repository data. The counts from `wc` are reproducible; `time` and the live system metrics are not.

## Useful combinations

- `du -h --max-depth=1 playground | sort -h`: compare first-level playground usage in ascending size order.
- `du -ab playground/projects/atlas | sort -n | tail -n 8`: inspect the largest byte-count entries in one synthetic project tree.
- `df -hT playground` and `du -sh playground`: compare the containing filesystem's capacity with the playground's estimated use.
- `TIMEFORMAT='real=%R user=%U sys=%S'; time awk -F, 'NR > 1 { n++ } END { print n }' playground/data/employees.csv`: deterministic row count with variable timing.

## Common mistakes and safety

- `df` does not measure an individual directory; `du` does not report filesystem free capacity.
- `du` totals can vary with filesystem allocation, links, and generated data. Avoid expensive scans of `/` or home directories.
- `top` and `free` are live observations, not fixed expected output. Use `top -b -n 1` for bounded automation.
- Timing a tiny command is not a reliable benchmark. Real, user, and system time need not match or sum to the elapsed time.
- These commands inspect state; keep directory arguments scoped to the repository/playground and do not infer host health from a single sample.

## Learn more

| Command | Detailed | Revision |
| --- | --- | --- |
| `top` | [Guide](../stages/05-system-information/top.detailed.md) | [Review](../stages/05-system-information/top.revision.md) |
| `free` | [Guide](../stages/05-system-information/free.detailed.md) | [Review](../stages/05-system-information/free.revision.md) |
| `df` | [Guide](../stages/05-system-information/df.detailed.md) | [Review](../stages/05-system-information/df.revision.md) |
| `du` | [Guide](../stages/05-system-information/du.detailed.md) | [Review](../stages/05-system-information/du.revision.md) |
| `time` | [Guide](../stages/05-system-information/time.detailed.md) | [Review](../stages/05-system-information/time.revision.md) |
