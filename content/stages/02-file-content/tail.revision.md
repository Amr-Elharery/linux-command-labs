---
id: tail
title: "tail"
type: command
stage: 2
category: file-content
mode: revision
difficulty: beginner
summary: "Show final lines or follow a changing file."
tags: [logs, follow, stdout]
related: [head, less, nl, cat]
---

# `tail` — Revision

Show the end of input or follow new log records.

**Syntax:** `tail [OPTION]... [FILE]...`

- `-n N` last N lines; `-n +N` from line N onward; `-c N` last N bytes.
- `-f` follows the opened descriptor; `-F` follows by filename and retries after rotation/replacement (GNU).
- Stop interactive follow with Ctrl+C. Automated follow examples use `timeout` and normally end with status 124.

## Examples

```bash
tail -n 2 playground/logs/app.log
tail -n +3 playground/logs/auth.log
```

```bash
timeout --signal=INT 0.2s tail -n 2 -f playground/logs/app.log
```

```bash
timeout --signal=INT 0.2s tail -n 2 -F playground/logs/auth.log
```

```bash
tail -n 3 playground/logs/app.log | nl -ba
```

## Recall

1. Which option reads new data from the opened file?
2. What does GNU `-F` retry after?
3. Why should a static-fixture follow be bounded in a test?

See [tail — Detailed](tail.detailed.md).
