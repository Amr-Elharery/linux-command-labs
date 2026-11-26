---
id: mv
title: "mv"
type: command
stage: 1
category: file-system
mode: detailed
difficulty: beginner
summary: "Move a file or directory, or rename it within the same filesystem."
tags: [move, rename, paths]
related: [ls, pwd, cp, rm]
---

# `mv` — Detailed

## What it does

`mv` changes a file or directory's path. Within the same directory it commonly acts as a rename. Unlike `cp`, it removes the original path after a successful move.

## Why it matters

Moving drafts into organized folders is common. Checking the destination first prevents accidentally replacing another file.

## Syntax

```text
mv [OPTION]... SOURCE... DESTINATION
```

For multiple sources, `DESTINATION` must be a directory. Paths without a leading `/` are relative to the current directory; paths beginning with `/` are absolute.

## Useful options

- `-i`: ask before overwriting an existing destination.
- `-n`: do not overwrite an existing destination (GNU behavior).
- `-v`: show each move or rename.
- `-t DIRECTORY`: specify the destination directory before the source list.
- `--`: stop option parsing for names beginning with `-`.

## Examples

Move the sample report into the review folder:

```bash
mkdir -p playground/projects/organization-lab/work/review
mv -v "playground/projects/organization-lab/inbox/quarterly report.txt" playground/projects/organization-lab/work/review/
```

Expected output reports the old and new paths. The original path in `inbox/` is gone after a successful move.

Rename the moved file:

```bash
mkdir -p playground/projects/organization-lab/work/review
cp "playground/projects/organization-lab/inbox/quarterly report.txt" playground/projects/organization-lab/work/review/
mv -v "playground/projects/organization-lab/work/review/quarterly report.txt" playground/projects/organization-lab/work/review/quarterly-report-reviewed.txt
```

Protect an existing destination from replacement:

```bash
mkdir -p playground/projects/organization-lab/work/review
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/review/
mv -n playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/review/
```

`-n` may produce no message. Check both locations with `ls` afterward.

## Practical scenario

Copy the checklist into `work/review/` first, then rename the copy to `review-checklist.txt`. This keeps the original checklist in `inbox/` available.

## Common mistakes

- If the destination is an existing directory, the source is moved inside it. If it is an existing file, it may be replaced.
- Moving across filesystems may be implemented as copy-then-remove and can fail partway if interrupted.
- Quote names containing spaces; otherwise the shell splits one path into several arguments.
- A trailing slash can make your intent clearer when the destination is a directory.
- `mv -n` no-overwrite behavior is GNU-specific; the course targets GNU/Linux.

## Safety notes

`mv` can replace an existing file. Inspect both paths first; use `-i` for a prompt or `-n` to avoid overwriting. Keep moves inside the disposable workspace while learning.

## Exercises

### Guided practice

1. Copy `launch-checklist.txt` into `work/review/`.
2. Rename the copy to `review-checklist.txt` with `mv -v`.
3. Use `ls` to verify the original remains in `inbox/` and the renamed copy exists.

### Independent practice

Move `quarterly report.txt` from `inbox/` into `work/archive/`. Quote the source and verify both locations.

### Combination challenge

Create `work/approved`, copy the checklist there, rename the copy `approved-checklist.txt`, and leave the source unchanged.

<details>
<summary>Show exercise answers</summary>

```bash
mkdir -p playground/projects/organization-lab/work/review
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/review/
mv -v playground/projects/organization-lab/work/review/launch-checklist.txt playground/projects/organization-lab/work/review/review-checklist.txt
ls playground/projects/organization-lab/inbox playground/projects/organization-lab/work/review
mkdir -p playground/projects/organization-lab/work/archive
mv "playground/projects/organization-lab/inbox/quarterly report.txt" playground/projects/organization-lab/work/archive/
ls playground/projects/organization-lab/inbox playground/projects/organization-lab/work/archive
mkdir -p playground/projects/organization-lab/work/approved
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/approved/
mv playground/projects/organization-lab/work/approved/launch-checklist.txt playground/projects/organization-lab/work/approved/approved-checklist.txt
```

</details>

## Reset

Run `bash setup/reset-lab.sh --yes && bash setup/setup.sh` from the repository root. Reset discards the marked disposable workspace and setup restores its starter files.

## Related commands

- [`cp` — Detailed](cp.detailed.md) preserves a source while making a copy.
- [`ls` — Detailed](ls.detailed.md) verifies the new paths.
- [`rm` — Detailed](rm.detailed.md) removes a selected disposable file.
- [`mv` — Revision](mv.revision.md)
