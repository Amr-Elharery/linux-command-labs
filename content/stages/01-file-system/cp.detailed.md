---
id: cp
title: "cp"
type: command
stage: 1
category: file-system
mode: detailed
difficulty: beginner
summary: "Copy files and directories to another path."
tags: [copy, files, directories, quoting]
related: [ls, mkdir, mv, rm]
---

# `cp` — Detailed

## What it does

`cp` creates a copy of a file or directory. The source remains unless a later command changes or removes it.

## Why it matters

Copies let you work on a draft while preserving a source fixture. A deliberate destination makes it easier to recover from editing mistakes.

## Syntax

```text
cp [OPTION]... SOURCE... DESTINATION
```

For multiple sources, the destination must be a directory. To copy a directory and its contents, use `-r` (recursive).

Source and destination paths may be absolute or relative. A relative path is resolved from the current directory printed by `pwd`.

## Useful options

- `-i`: ask before overwriting a destination.
- `-n`: do not overwrite an existing destination (GNU behavior).
- `-v`: show each copied path.
- `-r`: copy directories recursively.
- `-p`: preserve mode, ownership where permitted, and timestamps.
- `--`: end options, so a filename beginning with `-` is treated as a path.

## Examples

Copy the report whose name contains a space into a work directory. Create that destination first:

```bash
mkdir -p playground/projects/organization-lab/work
cp -v "playground/projects/organization-lab/inbox/quarterly report.txt" "playground/projects/organization-lab/work/quarterly report-copy.txt"
```

Expected output reports the source and destination paths. The quoted paths each arrive as one argument.

Copy the reference directory and its contents:

```bash
mkdir -p playground/projects/organization-lab/work
cp -rv playground/projects/organization-lab/reference playground/projects/organization-lab/work/reference-copy
```

Copy only when the destination does not already exist:

```bash
mkdir -p playground/projects/organization-lab/work
cp -n "playground/projects/organization-lab/inbox/launch-checklist.txt" playground/projects/organization-lab/work/
```

Ask before replacing an existing copy:

```bash
mkdir -p playground/projects/organization-lab/work
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/
cp -i playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/launch-checklist.txt
```

The last example may prompt; inspect the destination and answer deliberately.

## Practical scenario

Copy `quarterly report.txt` into `work/review/` and edit or annotate only the copy. The original under `inbox/` stays available for comparison.

## Common mistakes

- The destination directory must exist unless the destination itself is the new file name.
- `cp source existing-directory/` puts a copy inside that directory; `cp source existing-file` replaces the file unless prevented or confirmed.
- Omitting `-r` when copying a directory produces an error.
- Unquoted spaces split a path into multiple arguments. Quote the entire path, not each word separately.
- Repeating `cp` to a destination file may overwrite your work; use `-i` or `-n` when appropriate.

## Safety notes

`cp` can overwrite a file. Confirm both paths with `ls` before copying, keep sources under `playground/`, and use `-i` when you are unsure about an existing destination. Recursive copying can duplicate a large tree; specify the exact source directory.

## Exercises

### Guided practice

1. Create `work/review` with `mkdir -p`.
2. Copy the quarterly report into it with a new name containing a space.
3. Compare the source and copy with `diff -u` (the contents should match).

### Independent practice

Copy `reference/README.txt` into `work/` without overwriting an existing file. Inspect the destination with `ls -l`.

### Combination challenge

Make `work/organized`, copy the checklist there, then use `mv` to give the copy a clearer name. Do not change files under `inbox/`.

<details>
<summary>Show exercise answers</summary>

```bash
mkdir -p playground/projects/organization-lab/work/review
cp "playground/projects/organization-lab/inbox/quarterly report.txt" "playground/projects/organization-lab/work/review/quarterly report-copy.txt"
diff -u "playground/projects/organization-lab/inbox/quarterly report.txt" "playground/projects/organization-lab/work/review/quarterly report-copy.txt"
cp -n playground/projects/organization-lab/reference/README.txt playground/projects/organization-lab/work/
ls -l playground/projects/organization-lab/work
mkdir -p playground/projects/organization-lab/work/organized
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/organized/
mv playground/projects/organization-lab/work/organized/launch-checklist.txt playground/projects/organization-lab/work/organized/review-checklist.txt
```

</details>

## Reset

Run `bash setup/reset-lab.sh --yes && bash setup/setup.sh` from the repository root. The marker-protected disposable workspace returns to its starter files.

## Related commands

- [`mkdir` — Detailed](mkdir.detailed.md) prepares destination directories.
- [`mv` — Detailed](mv.detailed.md) moves or renames the copy.
- [`rm` — Detailed](rm.detailed.md) removes a precisely scoped scratch file.
- [`cp` — Revision](cp.revision.md)

