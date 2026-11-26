---
id: cat
title: "cat"
type: command
stage: 2
category: file-content
mode: revision
difficulty: beginner
summary: "Print or concatenate file contents to stdout."
tags: [read, stdout, pipeline]
related: [less, head, tail, nl]
---

# `cat` — Revision

Read short files or concatenate them to standard output.

**Syntax:** `cat [OPTION]... [FILE]...`

- `-n` number all lines; `-b` number nonblank lines; `-s` squeeze repeated blank lines.
- stdout can feed a pipeline; `>` replaces and `>>` appends a destination.

## Examples

```bash
cat playground/logs/app.log
cat -n playground/logs/auth.log
cat playground/projects/atlas/config/app.conf
cat playground/logs/auth.log | tail -n 2
```

Prefer `less` for large files; `cat file > file` truncates the source before reading it.

## Recall

1. Where does `cat` send normal output?
2. What happens when no file is supplied?
3. When is `less` a better choice?

See [cat — Detailed](cat.detailed.md).
