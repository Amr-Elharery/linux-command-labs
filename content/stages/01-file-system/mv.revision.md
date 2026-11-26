---
id: mv
title: "mv"
type: command
stage: 1
category: file-system
mode: revision
difficulty: beginner
summary: "Move a path or rename it."
tags: [move, rename, paths]
related: [ls, pwd, cp, rm]
---

# `mv` — Revision

Move a file/directory or rename it; the old path disappears after success.

**Syntax:** `mv [OPTION]... SOURCE... DESTINATION`

- `-i` prompt before overwrite; `-n` no-clobber (GNU); `-v` show the move; `-t DIR` select the destination directory.
- Quote paths with spaces; use `--` for names that begin with `-`.

## Examples

```bash
mkdir -p playground/projects/organization-lab/work
mv -v "playground/projects/organization-lab/inbox/quarterly report.txt" playground/projects/organization-lab/work/
```

```bash
mkdir -p playground/projects/organization-lab/work
cp "playground/projects/organization-lab/inbox/quarterly report.txt" playground/projects/organization-lab/work/
mv -v "playground/projects/organization-lab/work/quarterly report.txt" playground/projects/organization-lab/work/quarterly-report.txt
```

```bash
mkdir -p playground/projects/organization-lab/work
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/
mv -n playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/
ls playground/projects/organization-lab/inbox playground/projects/organization-lab/work
```

## Recall

1. How does `mv` differ from `cp`?
2. What should you inspect before moving onto an existing filename?
3. How do you quote a path containing spaces?

See [mv — Detailed](mv.detailed.md).
