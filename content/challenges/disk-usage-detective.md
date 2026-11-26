---
id: disk-usage-detective
title: "Disk Usage Detective"
type: challenge
stage: 5
difficulty: beginner
summary: "Compare filesystem capacity with synthetic playground path usage and inspect the largest fixture files."
objectives: ["Distinguish filesystem capacity from path usage", "Summarize and sort directory usage", "Use deterministic apparent byte sizes", "Explain live metric and timing variability"]
prerequisites: [df, du, sort, time]
starting_files: [playground/logs/app.log, playground/logs/auth.log, playground/data/employees.csv, playground/data/transactions.csv, playground/projects/atlas/README.md]
---

# Disk Usage Detective

## Scenario

You are preparing a small synthetic project tree for handoff. Determine how much space is available on the filesystem that contains the playground, compare the playground's directory totals, and identify the largest files in the Atlas sample project.

## Task requirements

1. Use `df -hT playground` to report the filesystem containing the playground, its type, and rounded capacity.
2. Use `du -sh playground` and `du -h --max-depth=1 playground | sort -h` to summarize path usage. Note that allocated sizes depend on filesystem block size.
3. Use `du -ab playground/projects/atlas | sort -n | tail -n 8` to inspect exact apparent byte counts for the synthetic project files.
4. Compare the roles of `df` and `du`: filesystem capacity versus usage attributed to paths.
5. Optionally time the byte-size pipeline. Record the output format only; do not treat a short measurement as a benchmark.

## Constraints

- Read only within `playground/`; do not scan system-wide paths.
- Do not remove, rewrite, or redirect over fixtures.
- Do not use `sudo`.
- Treat filesystem, memory, process, and timing numbers as machine-dependent.

## Progressive hints

<details>
<summary>Hint 1 — capacity or path size</summary>

`df` takes a path and reports the filesystem that contains it. `du` walks the path and estimates the usage of its entries.
</details>

<details>
<summary>Hint 2 — summarize and order</summary>

Use `du -h --max-depth=1` for directory summaries with `sort -h`. Use `du -ab` and `sort -n` when exact apparent byte counts make numeric ordering easier.
</details>

<details>
<summary>Hint 3 — live values</summary>

A filesystem's free capacity and allocated directory sizes vary by machine. The byte size of an unchanged synthetic file is stable. Timing values are observations, not expected constants.
</details>

## Expected result and validation

The capacity report identifies the mounted filesystem containing `playground`; its name, type, size, and available space vary. The directory report includes the playground and its immediate subdirectories. The byte-sorted Atlas output is in ascending numeric order and includes file paths; exact values should agree with each fixture's byte length. No fixture changes are made.

## Solution

<details>
<summary>Show solution</summary>

```bash
df -hT playground
du -sh playground
du -h --max-depth=1 playground | sort -h
du -ab playground/projects/atlas | sort -n | tail -n 8
TIMEFORMAT='real=%R user=%U sys=%S'; time du -ab playground/projects/atlas | sort -n | tail -n 8
```

`df` reports capacity for the filesystem containing the path. `du` totals usage attributed to paths. Human-readable allocated size is rounded and block-dependent; apparent byte counts reflect logical file sizes. The final timing varies between runs.
</details>

## Reset

This challenge is read-only; no reset is required.
