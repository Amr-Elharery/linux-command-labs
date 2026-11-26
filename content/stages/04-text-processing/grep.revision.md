---
id: grep
title: "grep"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Search lines of text for fixed strings or regular-expression patterns."
tags: [search, logs, regular-expressions]
related: [wc, awk, find]
---
# `grep` — Revision

> Search lines of text for fixed strings or regular-expression patterns.

**Syntax:** `grep [OPTIONS] PATTERN [FILE...]`

**Useful options:** `-i` ignores case; `-n` numbers matches; `-v` inverts selection; `-c` counts; `-F` treats the pattern literally; `-r` searches a scoped tree; `-E` enables extended regular expressions.

**Remember:** A pattern is interpreted as a basic regular expression (BRE) by default. `.` matches one character, `^` anchors a line start, `$` anchors its end, and `*` repeats the preceding expression. Quote patterns so the shell passes them intact. `-E` enables the more readable extended syntax such as `WARN|ERROR`. Recursive searches should name a bounded playground directory and can use `--include` to restrict file types.

## Examples

```bash
grep -n 'ERROR' playground/logs/app.log
```

2025-03-08T09:15:15Z ERROR request timed out

```bash
grep -i -E 'warn|error' playground/logs/app.log
```

```text
2025-03-08T09:14:00Z WARN cache refresh delayed
2025-03-08T09:15:15Z ERROR request timed out
2025-03-08T09:16:30Z WARN retry limit approaching
```

```bash
grep -Rni --include='*.log' 'failed password' playground/logs
```

Finds synthetic failed-login records in auth.log.

```bash
grep -c 'ERROR' playground/logs/app.log
```

Prints `1`.

## Quick recall

1. What does grep status 1 mean?
2. How do `-F` and `-E` change pattern interpretation?
3. Why quote a pattern containing shell metacharacters?

## Pipeline reminder

Quote patterns and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit status 1 for the normal no-match case. Grep filters lines; it does not parse CSV columns.

[Read the Detailed guide](./grep.detailed.md).
