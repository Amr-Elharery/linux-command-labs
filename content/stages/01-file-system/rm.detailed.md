---
id: rm
title: "rm"
type: command
stage: 1
category: file-system
mode: detailed
difficulty: beginner
summary: "Remove directory entries; recovery is not guaranteed."
tags: [delete, safety, files, directories]
related: [ls, pwd, cd, mkdir]
---

# `rm` — Detailed

## What it does

`rm` removes directory entries for files. With `-r`, it also removes a directory tree and its contents. It normally does not move items to a recycle bin.

## Why it matters

Temporary copies accumulate, but a mistaken deletion can be difficult or impossible to recover. Learn to inspect a target and remove one exact path before using recursive options.

## Syntax

```text
rm [OPTION]... FILE...
```

A directory requires `-r`/`-R` (recursive) unless it is empty and you use `rmdir`. Paths are relative to the current directory unless they begin with `/`.

## Useful options

- `-i`: prompt before each removal.
- `-I`: prompt once before removing more than three files or recursively removing a tree (GNU behavior).
- `-v`: print each removed path.
- `-r` / `-R`: recursively remove directory contents and the directory.
- `-f`: ignore missing files and suppress prompts. Avoid it while learning.
- `--`: end options so a name beginning with `-` is not interpreted as a flag.

## Safe workflow: inspect, then remove one known file

These commands operate only in the disposable organization workspace. Create a known scratch copy, inspect the exact target, then remove it:

```bash
mkdir -p playground/projects/organization-lab/work
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/discard-me.tmp
ls -l playground/projects/organization-lab/work/discard-me.tmp
rm -v -- playground/projects/organization-lab/work/discard-me.tmp
```

Expected `rm -v` output names only `playground/projects/organization-lab/work/discard-me.tmp`.

Remove a scratch copy with a space in its name:

```bash
mkdir -p playground/projects/organization-lab/work
cp "playground/projects/organization-lab/inbox/quarterly report.txt" "playground/projects/organization-lab/work/quarterly report.tmp"
ls -l "playground/projects/organization-lab/work/quarterly report.tmp"
rm -v -- "playground/projects/organization-lab/work/quarterly report.tmp"
```

## Recursive deletion

`rm -r` can remove many files at once. This demonstration creates a disposable nested tree, lists its contents, then removes that exact tree:

```bash
mkdir -p playground/projects/organization-lab/work/discard-demo/nested
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/discard-demo/nested/sample.txt
find playground/projects/organization-lab/work/discard-demo -print
rm -r -- playground/projects/organization-lab/work/discard-demo
```

`rm -r` prints nothing unless you add `-v`. Do not copy this pattern with a broad path, an unchecked variable, or a path outside `playground/`.

## Practical scenario

Remove only a temporary copy from `work/` after inspecting it. To discard the entire practice state, prefer the repository reset workflow; it validates and restores the known workspace.

## Common mistakes

- **Wrong current directory:** a relative target may refer somewhere else. Run `pwd` and inspect the full path with `ls` first.
- **Unquoted spaces:** quote the complete path; otherwise `rm quarterly report.txt` targets two names.
- **Option-like filenames:** use `rm -- "$path"` if a name begins with `-`.
- **Directory not empty:** plain `rm directory` fails; do not reflexively add `-r` until you confirm the directory is disposable.
- **No undo:** shell deletion usually bypasses a desktop trash folder.
- **Globs expand before `rm`:** `rm *` can select more than expected. Inspect matches first; beginners should name one exact file.

## Safety and security notes

- Never practice deletion on `/`, `/home`, `/etc`, `/var`, or a real project directory.
- Avoid `rm -rf` while learning. `-f` suppresses questions and errors; combined with `-r`, a typo or empty variable can remove a large tree.
- Do not use `sudo` to make a failed deletion succeed.
- Check `pwd`, inspect with `ls -ld -- TARGET`, and use a fully spelled, quoted path under `playground/`.
- Reset removes the marker-protected `organization-lab` tree and known generated fixtures only; unknown files elsewhere in `playground/` remain.

## Exercises

### Guided practice

1. Copy the checklist to `work/scratch.tmp`.
2. Inspect that exact file with `ls -l`.
3. Remove only the scratch copy with `rm -i -- ...` and confirm the prompt.

### Independent practice

Create a nested disposable directory under `organization-lab/work`, place a checklist copy inside it, list the tree, and remove that exact directory with `rm -r --`.

### Combination challenge

Use `pwd` to verify the repository root. Create `work/to-review`, copy the report into it, rename the copy, inspect the final path, then remove the copy. Confirm the original report remains in `inbox/`.

<details>
<summary>Show exercise answers</summary>

```bash
mkdir -p playground/projects/organization-lab/work
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/scratch.tmp
ls -l playground/projects/organization-lab/work/scratch.tmp
rm -i -- playground/projects/organization-lab/work/scratch.tmp
mkdir -p playground/projects/organization-lab/work/safe-demo/nested
cp playground/projects/organization-lab/inbox/launch-checklist.txt playground/projects/organization-lab/work/safe-demo/nested/
find playground/projects/organization-lab/work/safe-demo -print
rm -r -- playground/projects/organization-lab/work/safe-demo
pwd
mkdir -p playground/projects/organization-lab/work/to-review
cp "playground/projects/organization-lab/inbox/quarterly report.txt" playground/projects/organization-lab/work/to-review/
mv "playground/projects/organization-lab/work/to-review/quarterly report.txt" playground/projects/organization-lab/work/to-review/quarterly-report-reviewed.txt
ls -l playground/projects/organization-lab/work/to-review
rm -- playground/projects/organization-lab/work/to-review/quarterly-report-reviewed.txt
ls playground/projects/organization-lab/inbox
```

For the `rm -i` prompt, type `y` only after checking the exact path.

</details>

## Reset

Use `bash setup/reset-lab.sh --yes && bash setup/setup.sh` from the repository root. It removes the marked disposable workspace and rebuilds its starter files.

## Related commands

- [`pwd` — Detailed](pwd.detailed.md) checks where a relative deletion will act.
- [`ls` — Detailed](ls.detailed.md) inspects a target before removal.
- [`mkdir` — Detailed](mkdir.detailed.md) creates disposable exercise directories.
- [`rm` — Revision](rm.revision.md)
