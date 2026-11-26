---
id: pwd
title: "pwd"
type: command
stage: 1
category: file-system
mode: detailed
difficulty: beginner
summary: "Print the shell's current working directory."
tags: [navigation, paths, directories]
related: [cd, ls]
---

# `pwd` — Detailed

## What it does

`pwd` prints the current working directory: the directory the shell uses to resolve relative paths.

## Why it matters

A command with a relative path can refer to different files depending on the current directory. Checking `pwd` before a filesystem change helps you confirm where you are.

## Syntax

```text
pwd [OPTION]...
```

- `-L` prints the logical path, preserving directory names reached through symbolic links (usually the default).
- `-P` prints the physical path with symbolic links resolved.

## Absolute and relative paths

An absolute path starts at `/`, for example `/home/learner/linux-command-labs/playground/data`. A relative path starts at the current directory, for example `playground/data` when you are at the repository root. `.` means the current directory and `..` means its parent. Repeated `..` components can take you outside the playground, so inspect the result with `pwd` before a mutating command.

## Examples

From the repository root:

```bash
pwd
```

Expected output is the absolute path to this checkout. Its exact prefix depends on where you cloned the repository.

Print the physical path after entering the sample project:

```bash
cd playground/projects/organization-lab
pwd -P
```

Expected output ends with `/playground/projects/organization-lab`.

Return to the repository root with a relative parent path:

```bash
cd ../../..
pwd
```

Starting inside `playground/projects/organization-lab`, three parent steps return to the repository root.

## Practical scenario

When a tutorial says “from the repository root,” run `pwd` first. If the path does not end in `linux-command-labs`, use an explicit `cd` to the checkout before continuing.

## Common mistakes

- `pwd` reports the shell's location, not the location of a file argument.
- A terminal tab and a separate terminal tab have separate working directories.
- In a script, `cd` in a child process does not change the parent terminal's location.
- A path that starts with `/` is absolute; a path without that leading slash is usually relative.

## Safety notes

`pwd` is read-only. It is especially useful before `rm`, `mv`, and relative redirections, but it does not by itself prove a target is safe—read the full path too.

## Exercises

### Guided practice

1. From the repository root, run `pwd`.
2. Enter `playground/projects/organization-lab/inbox` and run `pwd` again.
3. Run `cd ..` and `pwd`; identify the parent directory.

### Independent practice

From `playground/projects/organization-lab/inbox`, use a relative path to return to the repository root, then confirm with `pwd`.

### Combination challenge

Use `pwd`, then `ls -A playground/projects/organization-lab/inbox`. Explain how the current directory affects that relative path.

<details>
<summary>Show exercise answers</summary>

```bash
pwd
cd playground/projects/organization-lab/inbox
pwd
cd ..
pwd
cd ../../..
pwd
cd playground/projects/organization-lab/inbox
cd ../../../..
pwd
ls -A playground/projects/organization-lab/inbox
```

</details>

## Reset

These exercises only change shell location. If following other Stage 01 exercises changed files, reset the playground with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`cd` — Detailed](cd.detailed.md) changes the current working directory.
- [`ls` — Detailed](ls.detailed.md) lists files and directories.
- [`pwd` — Revision](pwd.revision.md)

