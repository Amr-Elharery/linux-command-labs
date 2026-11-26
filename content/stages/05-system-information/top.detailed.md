---
id: top
title: "top"
type: command
stage: 5
category: system-information
mode: detailed
difficulty: beginner
summary: "Display and monitor running processes and system load interactively or in batch mode."
tags: [processes, monitoring, cpu, memory]
related: [free, time]
---
# `top` — Detailed

## What it does

Display and monitor running processes and system load interactively or in batch mode.

## Why it matters

System tools answer different questions: a process snapshot, host memory summary, filesystem capacity, path usage estimate, or command duration. These observations help diagnose resource pressure, but live numbers depend on the host and moment you sample them.

## Syntax

```text
top [OPTIONS]
```

## Arguments and options

`-b` batch (non-interactive); `-n N` number of updates; `-d SECONDS` update delay; `-p PID` restrict to a PID; `-w COLUMNS` set output width (procps-ng).

## Core concept

Interactive top refreshes a live process table; its values change continuously and depend on the host. Common keys include `q` to quit, `P` to sort by CPU, and `M` to sort by memory. For scripts, use `top -b -n 1` with a bounded output reader, or use `ps` for a one-shot process listing. Never assert exact CPU percentages or process order in automated tests.

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

## Practical scenario

Inspect a live system with top, then switch to batch mode for a single bounded snapshot. Use `ps` when a simpler one-shot listing is enough.

## Common mistakes

Forgetting `-b` can make automation wait for keyboard input. A batch run without a count may continue indefinitely. Process IDs and metrics change; output varies across machines. Pipe through a reader such as sed that consumes the full stream to avoid early-pipe termination.

## Safety notes

These examples inspect system state or read synthetic files. They do not change system configuration or delete data. Keep recursive `du` and other path inspections scoped to `playground/`; avoid expensive scans of the entire filesystem. Do not treat memory, process, filesystem-capacity, or timing values as fixture facts.

## Exercises

### Guided practice

1. Run the first example and identify which information is live and which comes from a fixed playground fixture.
2. Run a second example with a different display mode or scope.
3. Explain why its output can change across hosts or runs.

### Independent practice

Run `top`, quit with q, sort by CPU and memory in the interactive display, then capture one batch update with `top -b -n 1`. Compare with `ps`.

### Combination challenge

Combine `top` with one related command to inspect a resource question. State what the command measures and what it does not measure.

<details>
<summary>Show exercise answers</summary>

```bash
top -b -n 1 | sed -n '1,8p'
top -b -n 1 -p "$$" | sed -n '1,12p'
ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head -n 6
```

</details>

## Reset

These examples are read-only. No reset is required.

## Related commands

- [`free` — Detailed](./free.detailed.md)
- [`time` — Detailed](./time.detailed.md)
- [`top` — Revision](./top.revision.md)
