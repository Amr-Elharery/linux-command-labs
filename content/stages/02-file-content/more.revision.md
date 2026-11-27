---
id: more
title: "more"
type: command
stage: 2
category: file-content
mode: revision
difficulty: beginner
summary: "Page through text a screen at a time."
tags: [pager, logs, read]
related: [less, cat, head, tail]
---

# `more` — Revision

Read text page by page in a simple forward pager.

**Syntax:** `more [OPTION]... [FILE]...`

- Space: next screen; Enter: one line; `q`: quit.
- `-d` helpful prompts; `-f` count logical lines; `-s` squeeze blank lines; `+N` start at line N (GNU).

## Examples

```bash
more -f playground/logs/auth.log
more +3 playground/logs/app.log
more -d playground/logs/app.log
head -n 2 playground/logs/app.log
```

With captured/non-terminal stdout, `more` prints and exits; this allows bounded automated checks. Use `less` for richer backward movement and search.

## Recall

1. Which key advances a screen?
2. Which key quits?
3. Why might a short file not pause?

See [more — Detailed](more.detailed.md).
