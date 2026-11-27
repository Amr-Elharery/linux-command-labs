---
id: critical-resource-discovery
title: "Critical Resource Discovery"
type: challenge
stage: 3
difficulty: beginner
summary: "Locate important synthetic project resources and compare command lookup with tree search."
objectives: ["Resolve external commands through PATH", "Compare standard command locations", "Find synthetic logs, configuration, and datasets", "Combine name, type, depth, and size predicates safely"]
prerequisites: [which, whereis, find]
starting_files: [playground/logs/app.log, playground/logs/auth.log, playground/projects/atlas/config/app.conf, playground/data/employees.csv, "playground/projects/organization-lab/inbox/quarterly report.txt"]
---

# Critical Resource Discovery

## Scenario

You are preparing a small local project handoff. Identify the command-line tools available on PATH, then locate the synthetic log, configuration, dataset, and space-containing report within the repository's playground.

## Task requirements

1. Run `which grep` and `whereis -b grep`. Record how their results differ.
2. Use `find` under `playground/` to locate `app.log`, `auth.log`, `app.conf`, `employees.csv`, and `quarterly report.txt`.
3. Use `-type f` for regular files and quote the report's name pattern.
4. Use `-iname '*.CSV'` to find CSV files regardless of filename case, and use `-maxdepth` to limit one search.
5. Find files larger than 200 bytes with `-size +200c`; do not assume traversal order.
6. Use one safe read-only `-exec` or NUL-delimited `xargs -0` action to inspect matches.

## Constraints

- Search only within the repository's `playground/` tree.
- Do not use `sudo`, `-delete`, `-exec rm`, or `xargs rm`.
- Do not alter source files or redirect output into the fixtures.
- Treat command lookup (`which`/`whereis`) as system inspection only; do not run commands from untrusted directories.

## Progressive hints

<details>
<summary>Hint 1 — command lookup</summary>

`which grep` answers which executable PATH selects. `whereis -b grep` checks standard binary locations; exact paths vary across distributions.
</details>

<details>
<summary>Hint 2 — tree search</summary>

Start with `find playground -type f -name 'app.log' -print`. Add another `-name` predicate or search the specific subdirectory for other known files.
</details>

<details>
<summary>Hint 3 — safe filename handling</summary>

Quote wildcard patterns so the shell does not expand them. For command actions, prefer `-exec wc -l -- {} +`; for a pipeline, use `-print0 | xargs -0`.
</details>

## Expected result

The PATH lookup prints an executable path for `grep`; `whereis -b` reports its binary in a standard system directory. The `find` searches locate both logs, the config fixture, the CSV, and the report with a space. `-size +200c` returns a subset of larger generated fixtures; order is not guaranteed. No playground file changes.

## Solution

<details>
<summary>Show solution</summary>

Run from the repository root:

```bash
which grep
whereis -b grep
find playground -type f \( -name 'app.log' -o -name 'auth.log' \) -print
find playground -type f -name 'app.conf' -print
find playground -type f -iname '*.CSV' -print
find playground/projects/organization-lab/inbox -type f -name 'quarterly report.txt' -print
find playground -maxdepth 3 -type f -size +200c -print
find playground/logs -type f -name '*.log' -exec wc -l -- {} +
find playground/projects/organization-lab -type f -print0 | xargs -0 -r ls -ld --
```

`which` resolves via PATH; `whereis` checks standard installation locations. The remaining commands search only the repository fixtures. `-exec wc` and `xargs ls` read/list paths without modifying them.
</details>

## Reset

The challenge is read-only; no reset is needed. If earlier practice created controlled time samples in the organization workspace, restore the starter state with `bash setup/reset-lab.sh --yes && bash setup/setup.sh` from the repository root.
