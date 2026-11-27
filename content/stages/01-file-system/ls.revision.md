---
id: ls
title: "ls"
type: command
stage: 1
category: file-system
mode: revision
difficulty: beginner
summary: "List directory entries and inspect names or metadata."
tags: [listing, directories, hidden-files]
related: [pwd, cd, find]
---

# `ls` — Revision

List files and directories.

**Syntax:** `ls [OPTION]... [PATH]...`

## Useful options

- `-l` long details; `-a` include `.` and `..`; `-A` include hidden entries but omit those two special names.
- `-h` human-readable sizes (usually with `-l`); `-d` show the directory entry; `-R` recurse.

## Examples

```bash
ls playground/projects/organization-lab
ls -A playground/projects/organization-lab/inbox
ls -lh playground/data
ls -ld playground/projects/atlas
```

## Recall

1. Which option shows dotfiles?
2. How do you list a directory itself rather than its contents?
3. Why should recursive listing use a specific path?

See [ls — Detailed](ls.detailed.md). Stage 01 reset: `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.
