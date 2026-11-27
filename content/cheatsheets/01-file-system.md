---
id: 01-file-system
title: "File System Operations Cheat Sheet"
type: cheatsheet
stage: 1
summary: "Navigate, inspect, create, copy, move, and safely remove paths."
commands: [ls, pwd, cd, mkdir, cp, mv, rm]
---

# File System Operations Cheat Sheet

## Commands covered

| Command | Purpose |
| --- | --- |
| `ls` | List names and inspect directory entries. |
| `pwd` | Print the shell's current directory. |
| `cd` | Change the shell's current directory. |
| `mkdir` | Create directories. |
| `cp` | Copy files or directory trees. |
| `mv` | Move paths or rename them. |
| `rm` | Remove directory entries; recovery is not guaranteed. |

## Purpose

Use these commands to understand where you are and organize files. Practice from the repository root and keep changes inside the disposable `playground/projects/organization-lab/` tree.

## Essential syntax

```text
pwd
cd PATH
ls [OPTIONS] [PATH...]
mkdir [-p] DIRECTORY...
cp [OPTIONS] SOURCE... DESTINATION
mv [OPTIONS] SOURCE... DESTINATION
rm [OPTIONS] FILE...
```

Relative paths start at the current directory; absolute paths begin at `/`. `.` is the current directory and `..` its parent. Quote paths with spaces. Hidden names begin with `.`.

## High-value options

- `ls -l`, `-A`, `-h`, `-d`: long details, hidden entries (without `.`/`..`), readable sizes, or the directory entry itself.
- `pwd -P`: print the physical path with symbolic links resolved.
- `cd ..` / `cd -`: move to the parent / return to the previous directory.
- `mkdir -p`: create missing parent directories and accept an existing target.
- `cp -r`: copy directories recursively; `-i` asks before overwrite; GNU `-n` avoids overwrite.
- `mv -i` asks before overwrite; GNU `-n` avoids overwrite; `-v` reports paths.
- `rm -i` prompts for each removal; GNU `-I` gives a broader confirmation before a large or recursive removal; `-r` recursively removes a tree.
- Use `--` before a path that begins with `-` where supported.

## Short examples

Run these from the repository root:

```bash
pwd
ls -Al playground/projects/organization-lab
cd playground/projects/organization-lab && pwd
```

This bounded sequence creates and organizes a copy in the disposable `work/` area. The last command asks before deleting that one named practice file; answer `y` only after confirming the path.

```bash
cd playground/projects/organization-lab
mkdir -p work/cheatsheet
cp -n inbox/launch-checklist.txt work/cheatsheet/
mv -n work/cheatsheet/launch-checklist.txt work/cheatsheet/review-checklist.txt
ls -l work/cheatsheet
rm -i -- work/cheatsheet/review-checklist.txt
cd ../../..
```

## Useful combinations

- `pwd && ls -la`: confirm location, then inspect visible and hidden entries.
- `mkdir -p work/review && cp -n "inbox/quarterly report.txt" work/review/`: create a destination and copy a filename containing spaces.
- Use `cp` to preserve a source, `mv` to reorganize a copy, and `ls` to check the result before considering cleanup.

## Common mistakes and safety

- `cd` affects the current shell; `pwd` verifies where later relative paths will resolve.
- `ls` hides dotfiles unless `-a` or `-A` is used. `ls DIR` lists contents; `ls -d DIR` shows the directory entry.
- Unquoted spaces split a path into multiple arguments. Repeated `..` can leave the playground.
- `cp` or `mv` can overwrite a destination. Inspect first and use `-i` or GNU `-n` when appropriate.
- `rm -r` recursively removes a tree and has no reliable undo. Never use broad wildcards or guessed paths; inspect the exact target, stay under the disposable playground, and avoid `rm -rf` while learning.
- Playground reset recreates fixtures and removes generated contents from its documented workspace. Do not store personal files there.

## Learn more

| Command | Detailed | Revision |
| --- | --- | --- |
| `ls` | [Guide](../stages/01-file-system/ls.detailed.md) | [Review](../stages/01-file-system/ls.revision.md) |
| `pwd` | [Guide](../stages/01-file-system/pwd.detailed.md) | [Review](../stages/01-file-system/pwd.revision.md) |
| `cd` | [Guide](../stages/01-file-system/cd.detailed.md) | [Review](../stages/01-file-system/cd.revision.md) |
| `mkdir` | [Guide](../stages/01-file-system/mkdir.detailed.md) | [Review](../stages/01-file-system/mkdir.revision.md) |
| `cp` | [Guide](../stages/01-file-system/cp.detailed.md) | [Review](../stages/01-file-system/cp.revision.md) |
| `mv` | [Guide](../stages/01-file-system/mv.detailed.md) | [Review](../stages/01-file-system/mv.revision.md) |
| `rm` | [Guide](../stages/01-file-system/rm.detailed.md) | [Review](../stages/01-file-system/rm.revision.md) |
