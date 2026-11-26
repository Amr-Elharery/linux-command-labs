---
id: nl
title: "nl"
type: command
stage: 2
category: file-content
mode: revision
difficulty: beginner
summary: "Add line numbers while writing text to stdout."
tags: [line-numbers, logs, pipeline]
related: [cat, head, tail, less]
---

# `nl` — Revision

Number text lines for easier reference; it does not edit the source file.

**Syntax:** `nl [OPTION]... [FILE]...`

- `-ba` number all lines; default GNU behavior numbers nonblank body lines.
- `-v N` starting number; `-i N` increment; `-w N` width; `-s TEXT` separator.

## Examples

```bash
nl -ba playground/logs/app.log
nl -ba -w 2 -s ': ' playground/logs/auth.log
nl -v 10 playground/logs/app.log
tail -n 3 playground/logs/app.log | nl -ba
```

A pipeline restarts numbering from 1 for the selected lines.

## Recall

1. How do you number blank lines too?
2. Does `nl` change the input file?
3. Why might pipeline numbers differ from original line positions?

See [nl — Detailed](nl.detailed.md).
