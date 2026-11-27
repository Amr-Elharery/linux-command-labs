---
id: head
title: "head"
type: command
stage: 2
category: file-content
mode: revision
difficulty: beginner
summary: "Print the start of a file or stream."
tags: [logs, preview, stdout]
related: [tail, cat, less, nl]
---

# `head` — Revision

Show the first lines or bytes of input; default is ten lines.

**Syntax:** `head [OPTION]... [FILE]...`

- `-n N` lines; `-c N` bytes; `-q` suppress multi-file headings; `-v` force headings (GNU).
- GNU `-n -N` prints all but the last N lines.

## Examples

```bash
head -n 2 playground/logs/app.log
head -n 1 playground/logs/auth.log
head -q -n 1 playground/logs/app.log playground/logs/auth.log
cat playground/logs/app.log | head -n 2
```

## Recall

1. What is the default line count?
2. Why prefer line count over bytes for UTF-8 text?
3. What does `-q` change?

See [head — Detailed](head.detailed.md).
