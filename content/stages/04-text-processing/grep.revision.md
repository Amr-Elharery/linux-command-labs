---
id: grep
title: "grep"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Search lines of text for a matching pattern."
tags: [search, logs, patterns]
related: [find, awk, wc]
---

# grep — Revision

**Purpose:** print lines that match a pattern; source files remain unchanged.

**Syntax:** `grep [OPTION]... PATTERN [FILE]...`

## Useful options

- `-i` ignore case; `-n` number matching lines; `-v` invert selection.
- `-c` count matching lines; `-F` treat pattern literally.
- `-E` use extended regular expressions; `-r` search a scoped directory tree.

## Examples

```bash
grep 'ERROR' playground/logs/app.log
grep -in 'warn' playground/logs/app.log
grep -En 'WARN|ERROR' playground/logs/app.log
grep -c 'INFO' playground/logs/app.log
grep -F 'user.name' playground/logs/app.log
```

## Common combinations

```bash
grep -n 'ERROR' playground/logs/app.log | wc -l
grep -v 'DEBUG' playground/logs/app.log
```

`grep` returns 0 for a match, 1 for no match, and a larger status for an error. It matches text lines; it is not a CSV parser.

## Quick recall

1. Which flag ignores case?
2. How do you search for literal `.` punctuation?
3. What does exit status 1 mean for `grep`?

See [grep — Detailed](grep.detailed.md) for explanations and exercises.
