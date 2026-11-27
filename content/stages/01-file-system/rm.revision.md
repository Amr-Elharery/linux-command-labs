---
id: rm
title: "rm"
type: command
stage: 1
category: file-system
mode: revision
difficulty: beginner
summary: "Remove directory entries; deletion may not be recoverable."
tags: [delete, safety, files, directories]
related: [ls, pwd, cd, mkdir]
---

# `rm` — Revision

Remove named files; use recursive deletion only for a confirmed disposable directory.

**Syntax:** `rm [OPTION]... FILE...`

- `-i` prompt each time; `-I` one GNU confirmation for larger or recursive removal; `-v` show removed paths.
- `-r` recursive; `-f` suppress prompts and missing-file errors—avoid while learning.
- Inspect with `pwd` and `ls`; quote paths and use `--` for names beginning with `-`.

## Examples

```bash
mkdir -p playground/projects/organization-lab/work
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/scratch.tmp
ls -l playground/projects/organization-lab/work/scratch.tmp
```

```bash
mkdir -p playground/projects/organization-lab/work
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/scratch.tmp
rm -i -- playground/projects/organization-lab/work/scratch.tmp
```

```bash
mkdir -p playground/projects/organization-lab/work
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/scratch.tmp
rm -v -- playground/projects/organization-lab/work/scratch.tmp
```

The `rm -i` command asks for confirmation. For directory removal, prefer the reset workflow or inspect a precisely named disposable path before `rm -r`.

## Recall

1. Does `rm` usually send files to a trash folder?
2. Why is `rm -rf` risky?
3. What does `--` do?

See [rm — Detailed](rm.detailed.md). Never practice deletion outside `playground/`.
