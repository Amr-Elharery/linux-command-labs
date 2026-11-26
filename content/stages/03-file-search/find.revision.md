---
id: find
title: "find"
type: command
stage: 3
category: file-search
mode: revision
difficulty: beginner
summary: "Search an explicit directory tree by name and file properties."
tags: [search, files, directories, predicates]
related: [which, whereis, xargs, grep]
---

# `find` — Revision

Walk a named path and test entries against predicates.

**Syntax:** `find START_PATH... [EXPRESSION]`

- `-name` case-sensitive; `-iname` case-insensitive; quote wildcard patterns.
- `-type f|d|l`; `-size [+|-]N[c|k|M|G]`; `-mtime` days; `-mmin` minutes.
- `-maxdepth N`/`-mindepth N` constrain traversal. Adjacent predicates mean AND; group OR with `\( ... -o ... \)`.
- `-exec COMMAND {} +` batches safely; NUL-safe pipelines use `-print0 | xargs -0`.

## Examples

```bash
find playground -type f -name 'app.log' -print
find playground -type f -iname '*.CSV' -print
find playground -type f -size +200c -print
find playground -maxdepth 2 -type f -iname '*.log' -print
find playground/logs -type f -name '*.log' -exec wc -l -- {} +
```

For mtime, create controlled files inside the resettable workspace; see [find — Detailed](find.detailed.md). Never use destructive actions on system paths.

## Recall

1. Where does a relative start path resolve from?
2. How do you safely pass filenames containing spaces to `xargs`?
3. Why can `-mtime` results vary over time?

See [find — Detailed](find.detailed.md).
