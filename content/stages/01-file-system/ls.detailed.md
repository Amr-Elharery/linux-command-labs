---
id: ls
title: "ls"
type: command
stage: 1
category: file-system
mode: detailed
difficulty: beginner
summary: "List directory contents and inspect file names and metadata."
tags: [listing, directories, hidden-files]
related: [pwd, cd, find]
---

# `ls` — Detailed

## What it does

`ls` lists the names of files and directories. Options can show hidden entries, details such as permissions, or a directory itself rather than its contents.

## Why it matters

Listing before you copy, move, or delete helps confirm the target and notice unexpected files. A long listing also introduces permissions, ownership, size, and modification time.

## Syntax

```text
ls [OPTION]... [FILE_OR_DIRECTORY]...
```

With no path, `ls` lists the current directory. A relative path starts from the current directory; an absolute path begins at `/` and does not depend on where you are.

## Useful options

- `-l`: long format (permissions, links, owner, size, date, name).
- `-a`: include `.`-prefixed hidden entries, including `.` and `..`.
- `-A`: include hidden entries but omit `.` and `..`.
- `-h`: human-readable sizes; combine with `-l`.
- `-d`: list a directory entry itself, not its contents.
- `-R`: recurse into subdirectories. Use only when you intend to inspect the whole tree.

## Examples

From the repository root, list the sample project directories:

```bash
ls -1 playground/projects/organization-lab
```

Expected output:

```text
inbox
reference
```

Show hidden files too:

```bash
ls -1A playground/projects/organization-lab
```

Expected names include `.linux-labs-reset-marker` and `.draft-note`; `-A` omits the special `.` and `..` entries.

Inspect the CSV fixture sizes and metadata:

```bash
ls -lh playground/data
```

Exact byte sizes and timestamps can change when fixtures are regenerated, so use the output to inspect rather than compare it literally.

List the report file whose name contains a space:

```bash
ls -l "playground/projects/organization-lab/inbox/quarterly report.txt"
```

List the `atlas` directory entry itself:

```bash
ls -ld playground/projects/atlas
```

## Practical scenario

Before reorganizing the disposable workspace, use `ls -la playground/projects/organization-lab/inbox` to check the visible and hidden source files. The directory is resettable with the playground workflow described below.

## Common mistakes

- `ls -a` includes `.` and `..`; `ls -A` is often easier to scan.
- `ls name` lists the contents of `name` when it is a directory. Add `-d` to inspect the directory entry itself.
- Output order is usually sorted by name but can vary with locale and options. Do not rely on it as a stable data format.
- A hidden name begins with `.`; hidden does not mean secure or encrypted.

## Safety notes

`ls` does not change files. Recursive listing (`-R`) can produce a lot of output and may traverse directories you did not intend to inspect; provide a specific playground path.

## Exercises

### Guided practice

1. Run `ls playground/projects/organization-lab`.
2. Run `ls -A playground/projects/organization-lab/inbox` and identify the hidden filename.
3. Run `ls -ld playground/projects/atlas` and explain how it differs from listing its contents.

### Independent practice

Use one `ls` command to show a long listing, including hidden entries, of `playground/projects/organization-lab`.

### Combination challenge

Use `pwd` to confirm the repository root, then list the hidden and visible entries under `playground/projects/organization-lab/inbox`.

<details>
<summary>Show exercise answers</summary>

```bash
ls playground/projects/organization-lab
ls -A playground/projects/organization-lab/inbox
ls -ld playground/projects/atlas
ls -la playground/projects/organization-lab
pwd
ls -A playground/projects/organization-lab/inbox
```

</details>

## Reset

These exercises are read-only. For a clean starting point after later filesystem practice, run `bash setup/reset-lab.sh --yes && bash setup/setup.sh` from the repository root.

## Related commands

- [`pwd` — Detailed](pwd.detailed.md) shows the current directory.
- [`cd` — Detailed](cd.detailed.md) changes the current directory.
- `find` (Stage 03) searches directory trees.
- [`ls` — Revision](ls.revision.md)
