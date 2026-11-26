---
id: mkdir
title: "mkdir"
type: command
stage: 1
category: file-system
mode: detailed
difficulty: beginner
summary: "Create directories at a chosen path."
tags: [directories, paths, organization]
related: [pwd, ls, cp, mv]
---

# `mkdir` — Detailed

## What it does

`mkdir` creates one or more directories. It does not create files.

## Why it matters

A clear directory structure helps keep source files, drafts, and completed work separate. Creating a destination deliberately also reduces the chance of copying files into the wrong place.

## Syntax

```text
mkdir [OPTION]... DIRECTORY...
```

- `-p`: create missing parent directories and do not fail if the requested directory already exists.
- `-v`: print each created directory.
- `-m MODE`: set permissions when creating a directory, for example `700` for owner-only access. The process umask may affect permissions unless a mode is specified.

## Examples

Create a nested review folder under the disposable workspace:

```bash
mkdir -pv playground/projects/organization-lab/work/review
```

Expected output names the created `work` and `review` directories. If they already exist, `-p` leaves them in place and prints no creation message.

Create a directory for private practice files:

```bash
mkdir -p playground/projects/organization-lab/work
mkdir -m 700 playground/projects/organization-lab/work/private
stat -c '%a %n' playground/projects/organization-lab/work/private
```

Expected output from `stat` begins `700` followed by the path.

Create multiple sibling directories:

```bash
mkdir -p playground/projects/organization-lab/work
mkdir -p playground/projects/organization-lab/work
mkdir playground/projects/organization-lab/work/drafts playground/projects/organization-lab/work/approved
```

The parent `work` must already exist for this form.

Quote a directory path containing a space:

```bash
mkdir -p "playground/projects/organization-lab/work/final reports"
```

## Practical scenario

Create `work/review` and `work/archive` inside `playground/projects/organization-lab` before sorting the sample report. Use `-p` when a sequence may be repeated.

## Common mistakes

- Without `-p`, `mkdir work/review` fails if `work` does not exist.
- Without `-p`, trying to create an already existing directory returns an error; that may indicate a typo or simply a repeated command.
- Quote a path if any directory name contains spaces.
- `-m` accepts an octal permission mode; `700` means only the owner has access.

## Safety notes

`mkdir` adds directory entries but does not overwrite existing files. Still, check the parent path with `pwd` or `ls` before creating directories. Keep exercises under the disposable workspace; the reset workflow removes and rebuilds it.

## Exercises

### Guided practice

1. Run `mkdir -pv playground/projects/organization-lab/work/review`.
2. Run the same command again and observe that it is safe to repeat.
3. Create `work/private` with mode `700`, then inspect the mode with `stat`.

### Independent practice

Create `work/drafts` and `work/approved` in one command. Verify them with `ls`.

### Combination challenge

Create `work/organized/reports`, then copy the sample report there using `cp`.

<details>
<summary>Show exercise answers</summary>

```bash
mkdir -pv playground/projects/organization-lab/work/review
mkdir -pv playground/projects/organization-lab/work/review
mkdir -p playground/projects/organization-lab/work
mkdir -m 700 playground/projects/organization-lab/work/private
stat -c '%a %n' playground/projects/organization-lab/work/private
mkdir -p playground/projects/organization-lab/work
mkdir -p playground/projects/organization-lab/work
mkdir playground/projects/organization-lab/work/drafts playground/projects/organization-lab/work/approved
ls playground/projects/organization-lab/work
mkdir -p playground/projects/organization-lab/work/organized/reports
cp "playground/projects/organization-lab/inbox/quarterly report.txt" playground/projects/organization-lab/work/organized/reports/
```

</details>

## Reset

Run `bash setup/reset-lab.sh --yes && bash setup/setup.sh` from the repository root. Reset removes the marked `organization-lab` workspace and setup restores its starter files.

## Related commands

- [`pwd` — Detailed](pwd.detailed.md) confirms the parent location.
- [`ls` — Detailed](ls.detailed.md) checks the resulting directories.
- [`cp` — Detailed](cp.detailed.md) copies files into them.
- [`mv` — Detailed](mv.detailed.md) moves or renames files.
- [`mkdir` — Revision](mkdir.revision.md)
