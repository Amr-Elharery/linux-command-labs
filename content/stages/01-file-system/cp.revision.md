---
id: cp
title: "cp"
type: command
stage: 1
category: file-system
mode: revision
difficulty: beginner
summary: "Copy files or directories while preserving the source."
tags: [copy, files, directories, quoting]
related: [ls, mkdir, mv, rm]
---

# `cp` — Revision

Copy a source path to a destination; the original remains.

**Syntax:** `cp [OPTION]... SOURCE... DESTINATION`

- `-i` prompt before overwrite; `-n` no-clobber (GNU); `-v` show paths; `-r` copy directories recursively; `-p` preserve metadata where possible.
- Quote names with spaces. Use `--` before option-like filenames.

## Examples

```bash
mkdir -p playground/projects/organization-lab/work
mkdir -p playground/projects/organization-lab/work
cp "playground/projects/organization-lab/inbox/quarterly report.txt" "playground/projects/organization-lab/work/report copy.txt"
cp -n playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/
mkdir -p playground/projects/organization-lab/work
cp -rv playground/projects/organization-lab/reference playground/projects/organization-lab/work/reference-copy
ls -l playground/projects/organization-lab/work
```

## Recall

1. Which option copies a directory tree?
2. Does `cp` remove the source?
3. How can you prevent replacing an existing destination?

See [cp — Detailed](cp.detailed.md).
