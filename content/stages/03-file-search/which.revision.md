---
id: which
title: "which"
type: command
stage: 3
category: file-search
mode: revision
difficulty: beginner
summary: "Resolve an external command name through PATH."
tags: [path, executable, command-lookup]
related: [whereis, find]
---

# `which` — Revision

Show the executable path selected by PATH lookup.

**Syntax:** `which [OPTION]... COMMAND...`

- `-a` print all PATH matches; PATH order determines which match appears first.
- For Bash aliases, functions, and builtins, use `type -a` or `command -v`; `which` implementations vary.

## Examples

```bash
which grep
which -a grep
which bash head tail
printf '%s\n' "$PATH"
```

## Recall

1. Does `which` search arbitrary repository filenames?
2. Why does PATH order matter?
3. Which Bash builtins show shell-aware lookup?

See [which — Detailed](which.detailed.md).
