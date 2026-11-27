---
id: head
title: "head"
type: command
stage: 2
category: file-content
mode: detailed
difficulty: beginner
summary: "Print the beginning of a file or stream."
tags: [logs, preview, stdout]
related: [tail, cat, less, nl]
---

# `head` — Detailed

## What it does

`head` prints the first part of one or more files. By default, it prints ten lines; options let you choose a line or byte count.

## Why it matters

A quick preview helps identify a file's format or inspect the earliest log events without printing everything. It also reads standard input from a pipeline.

## Syntax

```text
head [OPTION]... [FILE]...
```

## Useful options

- `-n N` / `--lines=N`: print the first N lines.
- `-c N` / `--bytes=N`: print the first N bytes.
- `-q`: suppress filename headings for multiple files (GNU).
- `-v`: always show filename headings (GNU).
- `-n -N`: print all but the last N lines (GNU extension).

## Examples

Read the first two application events:

```bash
head -n 2 playground/logs/app.log
```

Expected output:

```text
2025-03-08T09:12:00Z INFO service started
2025-03-08T09:13:10Z DEBUG cache lookup complete
```

Inspect the first authentication record:

```bash
head -n 1 playground/logs/auth.log
```

Read one first line from each log without filename headings:

```bash
head -q -n 1 playground/logs/app.log playground/logs/auth.log
```

Use `head` on a pipeline's standard input:

```bash
cat playground/logs/app.log | head -n 2
```

For a single file, `head -n 2 FILE` avoids the extra `cat` process.

## stdout and pipelines

`head` writes selected lines to stdout. `tail -n 3 FILE | head -n 1` sends the last three lines into `head`, which keeps the first of those three. No file is changed. `>` and `>>` redirect output to files; they can overwrite or append and are not needed here.

## Practical scenario

Use `head -n 2 playground/logs/app.log` to see startup context before reading the rest of the synthetic service log with `less`.

## Common mistakes

- `head file` prints up to ten lines, not just one.
- `head -n 0 file` prints no lines; `-n 1` prints one.
- A byte count can split a multi-byte character; use line counts for ordinary text logs.
- GNU `head` prints filename headings when given multiple files unless `-q` is used.

## Safety notes

`head` only reads its input. Keep examples scoped to `playground/logs/`; do not read private or live host logs.

## Exercises

### Guided practice

1. Print the first two lines of `app.log`.
2. Print the first line of `auth.log`.
3. Use `head -q` on both files and compare their first records.

### Independent practice

Show the first three application records, then explain how a pipe can pass them to another command.

### Combination challenge

Use `head -n 2 playground/logs/auth.log | nl -ba` to number the first two authentication records.

<details>
<summary>Show exercise answers</summary>

```bash
head -n 2 playground/logs/app.log
head -n 1 playground/logs/auth.log
head -q -n 1 playground/logs/app.log playground/logs/auth.log
head -n 3 playground/logs/app.log
head -n 2 playground/logs/auth.log | nl -ba
```

</details>

## Reset

These examples are read-only and need no reset.

## Related commands

- [`tail` — Detailed](tail.detailed.md) reads the end or follows updates.
- [`less` — Detailed](less.detailed.md) pages through the full file.
- [`cat` — Detailed](cat.detailed.md) prints a short file.
- [`nl` — Detailed](nl.detailed.md) numbers lines.
- [`head` — Revision](head.revision.md)
