---
id: wc
title: "wc"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Count lines, words, bytes, or characters in text."
tags: [count, lines, bytes]
related: [grep, awk, cut]
---
# `wc` — Revision

> Count lines, words, bytes, or characters in text.

**Syntax:** `wc [OPTION]... [FILE...]`

**Useful options:** -l lines; -w words; -c bytes; -m characters. With no file argument, wc reads standard input.

**Remember:** A pipeline connects one program's standard output to the next program's standard input. This lets you count selected data without creating intermediate files. `wc -l` counts newline characters, so a final unterminated line is not counted as a line.

## Examples

```bash
wc -l playground/logs/app.log
```

5 playground/logs/app.log

```bash
grep -i 'warn' playground/logs/app.log | wc -l
```

2

```bash
wc -w < playground/projects/atlas/src/tasks.txt
```

15 (whitespace-delimited words in the fixture)

## Quick recall

1. Count employees and data rows separately; remember the CSV header. Count ERROR lines by piping grep into wc.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./wc.detailed.md).
