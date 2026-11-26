---
id: cd
title: "cd"
type: command
stage: 1
category: file-system
mode: detailed
difficulty: beginner
summary: "Change the current shell's working directory."
tags: [navigation, paths, shell-builtin]
related: [pwd, ls]
---

# `cd` — Detailed

## What it does

`cd` changes the working directory of the current shell. It is a shell builtin so that the directory change remains in your terminal after the command finishes.

## Why it matters

Relative paths are interpreted from the current directory. Moving to a known project location makes commands shorter, but checking with `pwd` prevents mistakes.

## Syntax

```text
cd [OPTION] [DIRECTORY]
```

- `cd path`: enter a directory.
- `cd ..`: move to its parent.
- `cd -`: return to the previous directory and print it.
- `cd` with no argument: go to your home directory.
- `cd -P path`: resolve symbolic links while changing directories; `cd -L path` uses logical path handling (the usual default).

## Relative, absolute, and traversing paths

`cd playground/projects/organization-lab` is relative to the current location. `cd /absolute/path/to/linux-command-labs/playground/projects/organization-lab` starts at `/`. The component `..` means “parent”; enough `..` components can leave the repository or playground. Use `pwd` after navigation when the location matters. Quote a path containing spaces, such as `cd "playground/projects/organization-lab/inbox"`.

## Examples

From the repository root, enter the workspace and inspect your location:

```bash
cd playground/projects/organization-lab
pwd
```

Expected output is the checkout's absolute path ending in `/playground/projects/organization-lab`.

Move into `inbox`, then return to the previous location:

```bash
cd playground/projects/organization-lab
cd inbox
cd -
pwd
```

`cd -` prints the path it changed to.

Return to the repository root from the workspace with a relative path:

```bash
cd playground/projects/organization-lab
cd ../../..
pwd
```

Enter a directory whose name contains a space (the path is quoted so the shell treats it as one argument):

```bash
cd "playground/projects/organization-lab/inbox"
```

## Practical scenario

Use `cd playground/projects/organization-lab`, then `cd inbox`. Run `pwd` before opening `quarterly report.txt`; the space in the filename needs quoting when used with another command.

## Common mistakes

- Running `cd` as an external program in a script or subshell cannot change the parent terminal's directory.
- `cd project files` is parsed as two arguments; use `cd "project files"` or escape the space.
- `cd ..` moves one level only. Use `pwd` to verify rather than guessing several parent steps.
- A successful `cd` usually prints nothing; silence is normal.

## Safety notes

`cd` does not modify files, but navigation changes the meaning of later relative paths. Do not assume you are still in the repository after `cd -`, opening another terminal, or running a script.

## Exercises

### Guided practice

1. Enter `playground/projects/organization-lab` and confirm with `pwd`.
2. Enter `inbox`, then use `cd -` to return.
3. From the workspace root, use `cd ../../..` to return to the repository root.

### Independent practice

Starting from the repository root, navigate into the `reference` directory using an absolute path. Confirm your result with `pwd`.

### Combination challenge

Navigate to the `inbox` directory using a relative path, then use `ls -A` to identify the hidden file there.

<details>
<summary>Show exercise answers</summary>

```bash
cd playground/projects/organization-lab
pwd
cd inbox
cd -
cd ../../..
pwd
cd "$(pwd)/playground/projects/organization-lab/reference"
pwd
cd -
cd playground/projects/organization-lab/inbox
ls -A
```

</details>

## Reset

These exercises only change shell location. If following other Stage 01 exercises changed files, run `bash setup/reset-lab.sh --yes && bash setup/setup.sh` from the repository root.

## Related commands

- [`pwd` — Detailed](pwd.detailed.md) verifies the current location.
- [`ls` — Detailed](ls.detailed.md) inspects directory contents.
- [`cd` — Revision](cd.revision.md)

