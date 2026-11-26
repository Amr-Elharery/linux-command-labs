---
id: whereis
title: "whereis"
type: command
stage: 3
category: file-search
mode: revision
difficulty: beginner
summary: "Find standard binary, source, and manual locations for a command."
tags: [command-lookup, binaries, manuals]
related: [which, find]
---

# `whereis` — Revision

Show standard locations associated with a command name.

**Syntax:** `whereis [OPTION]... NAME...`

- `-b` binary; `-m` manual; `-s` source.
- `-B DIR... -f` and `-M DIR... -f` restrict binary or manual lookup roots.
- It does not inspect shell aliases/functions or recursively search a chosen tree.

## Examples

```bash
whereis grep
whereis -b grep
whereis -m grep
which grep && whereis -b grep
```

## Recall

1. What kinds of locations can `whereis` report?
2. How does it differ from PATH-based `which`?
3. Which tool searches an arbitrary repository directory?

See [whereis — Detailed](whereis.detailed.md).
