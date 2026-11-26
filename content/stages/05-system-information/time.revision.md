---
id: time
title: "time"
type: command
stage: 5
category: system-information
mode: revision
difficulty: beginner
summary: "Measure elapsed real time and CPU time used by a command."
tags: [timing, performance, shell]
related: [top, awk]
---
# `time` — Revision

> Measure elapsed real time and CPU time used by a command.

**Syntax:** `time COMMAND [ARGUMENTS...]`

**Useful options:** Bash's `time` keyword reports `real`, `user`, and `sys`; use `TIMEFORMAT` to format Bash output. GNU `/usr/bin/time` has additional formatting options but is a separate program.

**Remember:** Real time is elapsed wall-clock time. User time is CPU time spent running the command's user-space code; system time is CPU time spent in kernel operations on its behalf. User plus system may be less than real while waiting for I/O or scheduling, or can exceed real when multiple CPU cores run concurrently. Measurements vary between runs.

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

## Quick recall

1. Time a wc and sort operation. Record real/user/sys without expecting a particular value. Explain how waiting and CPU work affect the values.
2. Which values here are fixed by a fixture, and which are live?
3. What does this command measure—and what does it not measure?

[Read the Detailed guide](./time.detailed.md).
