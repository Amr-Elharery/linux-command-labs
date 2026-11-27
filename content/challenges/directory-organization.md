---
id: directory-organization
title: "Directory Organization"
type: challenge
stage: 1
difficulty: beginner
summary: "Organize synthetic project files using all seven Stage 01 commands."
objectives: ["Inspect files and hidden entries", "Navigate using relative paths", "Create a directory layout", "Copy, move, rename, and safely remove selected files"]
prerequisites: [ls, pwd, cd, mkdir, cp, mv, rm]
starting_files: ["playground/projects/organization-lab/inbox/quarterly report.txt", playground/projects/organization-lab/inbox/launch-checklist.txt, playground/projects/organization-lab/inbox/.draft-note, playground/projects/organization-lab/reference/README.txt]
---

# Directory Organization

## Scenario

You are preparing a clean handoff from a small fictional project. The `organization-lab` folder is a marked disposable workspace containing a draft report, a checklist, a hidden note, and a reference file. Organize working copies without changing the originals.

## Task requirements

1. From the repository root, confirm your location with `pwd`, enter `playground/projects/organization-lab` with `cd`, and inspect `inbox/` including hidden files with `ls -A`.
2. Create `work/drafts`, `work/approved`, and `work/archive` with `mkdir -p`.
3. Copy `inbox/quarterly report.txt` to `work/drafts/quarterly report-copy.txt`. Quote the paths containing spaces.
4. Move that copy into `work/approved/` and rename it `quarterly-report-approved.txt`.
5. Copy `inbox/launch-checklist.txt` into `work/approved/`.
6. Copy `reference/README.txt` into `work/archive/`; leave the reference original in place.
7. Make a temporary copy of the checklist in `work/drafts/`, inspect it with `ls -l`, then remove only that exact temporary file with `rm -v --`.
8. Use `ls` to confirm the final layout and confirm that both original files remain in `inbox/`.

## Constraints

- Work only below `playground/projects/organization-lab/`.
- Do not edit, move, or delete anything under `inbox/` or `reference/`.
- Do not use `rm -r` or `rm -f` in this challenge.
- Keep the space-containing report path quoted.

## Progressive hints

<details>
<summary>Hint 1 — inspect and navigate</summary>

`pwd` confirms the repository root. From there, `cd playground/projects/organization-lab` reaches the workspace. `ls -A inbox` includes `.draft-note`.
</details>

<details>
<summary>Hint 2 — make the destination tree</summary>

One `mkdir -p work/drafts work/approved work/archive` creates all three subdirectories.
</details>

<details>
<summary>Hint 3 — preserve originals</summary>

Use `cp` for both source files. Then use `mv` only on the report copy. Give the temporary checklist copy its own clear name before removing it.
</details>

## Expected result

The original report and checklist remain in `inbox/`. Under `work/approved/` there is `quarterly-report-approved.txt` and `launch-checklist.txt`; under `work/archive/` there is `README.txt`. `work/drafts/` exists and the temporary checklist copy is absent. The `reference/README.txt` source and hidden `.draft-note` remain untouched.

## Solution

<details>
<summary>Show solution</summary>

Run from the repository root:

```bash
pwd
cd playground/projects/organization-lab
ls -A inbox
mkdir -p work/drafts work/approved work/archive
cp "inbox/quarterly report.txt" "work/drafts/quarterly report-copy.txt"
mv "work/drafts/quarterly report-copy.txt" work/approved/quarterly-report-approved.txt
cp inbox/launch-checklist.txt work/approved/
cp reference/README.txt work/archive/
cp inbox/launch-checklist.txt work/drafts/checklist.tmp
ls -l work/drafts/checklist.tmp
rm -v -- work/drafts/checklist.tmp
ls -R work
ls inbox
```

`ls -R` here is restricted to the small disposable `work/` tree. The final `ls inbox` confirms the originals remain.
</details>

## Reset

From the repository root, run:

```bash
bash setup/reset-lab.sh --yes
bash setup/setup.sh
```

The reset script validates the workspace marker and removes only the dedicated disposable `playground/projects/organization-lab/` directory plus its known generated fixtures. Setup recreates the starter files. Do not keep personal files in this marked workspace.
