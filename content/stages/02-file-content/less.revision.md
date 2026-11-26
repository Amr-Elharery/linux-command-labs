---
id: less
title: "less"
type: command
stage: 2
category: file-content
mode: revision
difficulty: beginner
summary: "Page, search, and navigate text without dumping it all to the terminal."
tags: [pager, search, logs]
related: [more, cat, head, tail, nl]
---

# `less` — Revision

Navigate through a file forward, backward, and by search.

**Syntax:** `less [OPTION]... [FILE]...`

- `-N` line numbers; `-S` no wrapping; `-i` conditional case-insensitive search.
- Space/`f` forward; `b` backward; `/pattern` search; `n` next match; `g` start; `G` end; `q` quit.
- `-F` quits for one-screen files; `-X` leaves displayed text on screen.

## Examples

```bash
less -N -F -X playground/logs/app.log
less -F -X +G playground/logs/auth.log
less playground/projects/atlas/config/app.conf
more -f playground/logs/auth.log
```

The `-F -X` forms are bounded for short fixtures and automated tests. For an interactive live log, `less +F FILE` follows updates; Ctrl+C stops follow mode and `q` quits.

## Recall

1. How do you search forward?
2. What key quits?
3. When is `cat` more convenient?

See [less — Detailed](less.detailed.md).
