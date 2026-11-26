---
id: top
title: "top"
type: command
stage: 5
category: system-information
mode: revision
difficulty: beginner
summary: "Display and monitor running processes and system load interactively or in batch mode."
tags: [processes, monitoring, cpu, memory]
related: [free, time]
---
# `top` — Revision

> Display and monitor running processes and system load interactively or in batch mode.

**Syntax:** `top [OPTIONS]`

**Useful options:** `-b` batch (non-interactive); `-n N` number of updates; `-d SECONDS` update delay; `-p PID` restrict to a PID; `-w COLUMNS` set output width (procps-ng).

**Remember:** Interactive top refreshes a live process table; its values change continuously and depend on the host. Common keys include `q` to quit, `P` to sort by CPU, and `M` to sort by memory. For scripts, use `top -b -n 1` with a bounded output reader, or use `ps` for a one-shot process listing. Never assert exact CPU percentages or process order in automated tests.

## Examples

```bash
top -b -n 1 | sed -n '1,8p'
```

One batch snapshot; process, load, and CPU values are live and vary by host and time.

```bash
top -b -n 1 -p "$$" | sed -n '1,12p'
```

A one-time snapshot filtered to the current shell process; PID and metrics vary.

```bash
ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head -n 6
```

A non-interactive process list ordered by CPU use; rows vary.

## Quick recall

1. Run `top`, quit with q, sort by CPU and memory in the interactive display, then capture one batch update with `top -b -n 1`. Compare with `ps`.
2. Which values here are fixed by a fixture, and which are live?
3. What does this command measure—and what does it not measure?

[Read the Detailed guide](./top.detailed.md).
