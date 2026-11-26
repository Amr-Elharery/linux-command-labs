---
id: find
title: "find"
type: command
stage: 3
category: file-search
mode: detailed
difficulty: beginner
summary: "Search a chosen directory tree using file properties and names."
tags: [search, files, directories, predicates]
related: [which, whereis, xargs, grep]
---

# `find` — Detailed

## What it does

`find` walks a directory tree from a path you provide and tests each entry against predicates such as name, type, size, or modification time. It is the Stage 03 tool for locating files inside a known tree.

## Why it matters

Unlike `which` and `whereis`, `find` searches the exact directory tree you name. Scoping the start path to `playground/` keeps practice predictable and avoids searching private or system data.

## Syntax

```text
find START_PATH... [EXPRESSION]
```

If no action is specified, `find` uses `-print`. Paths may be relative to the current directory or absolute. `.` means the current directory; `..` is its parent. Repeated `..` can leave the playground, so choose the start path deliberately.

## Name and type predicates

Quote wildcard patterns to prevent the shell from expanding them before `find` receives them.

```bash
find playground/logs -type f -name '*.log' -print
```

This finds regular `.log` files under `playground/logs`. `-name` is case-sensitive; use `-iname` for case-insensitive names:

```bash
find playground/data -type f -iname '*.CSV' -print
```

Select regular files, directories, or symbolic links with `-type f`, `-type d`, or `-type l`:

```bash
find playground/projects -maxdepth 2 -type d -print
```

Find the path with a space in its name:

```bash
find playground/projects/organization-lab/inbox -type f -name 'quarterly report.txt' -print
```

## Size predicates

GNU `find` supports `-size N[cwbkMG]`. The `c` suffix counts bytes; `k`, `M`, and `G` use binary units. Without a suffix, the size is rounded up to 512-byte blocks. Prefix a value with `+` for larger than or `-` for smaller than.

```bash
find playground -type f -size +200c -print
find playground -type f -size -1k -print
```

These predicates inspect size only; they do not open or change file contents. The exact result set depends on the generated fixtures in the checkout.

## Modification-time predicates

- `-mtime N`: age in whole 24-hour periods; `-mtime 0` means less than one day old, `-mtime +1` matches files at least two full days old, and `-mtime -1` means under one day old (GNU find rounding rules apply).
- `-mmin N`: age in whole minutes, useful for recent activity checks.

A file's age changes over time, so create two controlled samples inside the disposable Stage 01 workspace before testing:

```bash
mkdir -p playground/projects/organization-lab/work/time-lab
 touch playground/projects/organization-lab/work/time-lab/fresh.txt
 touch -d '2 days ago' playground/projects/organization-lab/work/time-lab/older.txt
find playground/projects/organization-lab/work/time-lab -type f -mmin -5 -print
find playground/projects/organization-lab/work/time-lab -type f -mtime +1 -print
```

The first search finds `fresh.txt`; the second finds `older.txt`. This uses GNU `touch -d` and GNU `find`, both available on Kali and Ubuntu. Reset with `bash setup/reset-lab.sh --yes && bash setup/setup.sh` to remove the samples.

## Depth and logical combinations

`-maxdepth N` stops descending after N levels; `-mindepth N` skips shallower entries. GNU `find` expects these controls near the start path:

```bash
find playground -maxdepth 2 -type f -name '*.log' -print
find playground -mindepth 2 -maxdepth 3 -type f -print
```

Predicates next to each other are implicitly ANDed. Use `-a` for explicit AND, `-o` for OR, and parentheses to group conditions; escape parentheses so the shell passes them to `find`:

```bash
find playground -type f \( -iname '*.log' -o -iname '*.conf' \) -print
find playground -type f -name '*.log' -a -size +100c -print
```

## Safe actions: `-exec` and `-print0`

Use `-exec` for a read-only command such as `wc`. `{}` stands for each matched path; `\;` runs once per match and `+` batches several matches:

```bash
find playground/logs -type f -name '*.log' -exec wc -l -- {} +
```

To pass filenames safely through a pipeline, use NUL delimiters. Newlines and spaces inside names do not split an argument:

```bash
find playground/projects/organization-lab -type f -print0 | xargs -0 -r ls -ld --
```

This only lists paths. Do not adapt beginner examples into `-exec rm`, `-delete`, or `xargs rm` commands.

## Permissions and practical handling

Searching a directory requires permission to traverse it. If you see `Permission denied`, narrow the start path to a directory you own, inspect permissions with `ls -ld`, or use GNU `-readable` to select readable entries:

```bash
find playground -type f -readable -print
```

Do not use `sudo` to force a search. Redirecting diagnostics with `2>/dev/null` can hide errors; use it only when you understand which inaccessible directories are expected and still verify the results.

## `which`, `whereis`, or `find`?

- `which NAME`: locate an external executable through PATH.
- `whereis NAME`: report binary/source/manual files in standard locations.
- `find PATH ...`: walk the explicit tree and test matching predicates.

They are not interchangeable: only `find` searches arbitrary paths like the repository playground.

## Common mistakes and safety notes

- Unquoted `*.log` may expand in the current shell directory. Quote patterns such as `'*.log'`.
- An absolute start path begins `/`; a relative start path is resolved from `pwd`. Repeated `..` can search outside the intended tree.
- `-name` is case-sensitive; choose `-iname` if case should not matter.
- `find` prints paths in filesystem traversal order, which is not guaranteed. Sort results if stable ordering matters.
- `-exec` runs a command for each match; inspect the expression before using actions. Keep examples read-only.
- Avoid `/`, `/home`, `/etc`, `/var`, and real user data as search roots in beginner practice.

## Exercises

### Guided practice

1. Find `app.log` by exact name under `playground/`.
2. Find log files case-insensitively with `-iname '*.LOG'`.
3. Find regular files larger than 200 bytes.
4. Use `-maxdepth 2` to limit how deep the search descends.

### Independent practice

Create `fresh.txt` and `older.txt` in the documented `time-lab`, set the older file's time with `touch -d`, then distinguish them with `-mmin -5` and `-mtime +1`.

### Combination challenge

Find `.log` or `.conf` regular files under `playground`, then use `-exec wc -l -- {} +` to count lines. Keep it read-only.

<details>
<summary>Show exercise answers</summary>

```bash
find playground -type f -name 'app.log' -print
find playground -type f -iname '*.LOG' -print
find playground -type f -size +200c -print
find playground -maxdepth 2 -type f -print
mkdir -p playground/projects/organization-lab/work/time-lab
touch playground/projects/organization-lab/work/time-lab/fresh.txt
touch -d '2 days ago' playground/projects/organization-lab/work/time-lab/older.txt
find playground/projects/organization-lab/work/time-lab -type f -mmin -5 -print
find playground/projects/organization-lab/work/time-lab -type f -mtime +1 -print
find playground -type f \( -iname '*.log' -o -iname '*.conf' \) -exec wc -l -- {} +
```

Reset the workspace afterward to remove the controlled time samples.
</details>

## Reset

Read-only searches need no reset. If you created controlled timestamps under `playground/projects/organization-lab/work/time-lab`, reset from the repository root with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`which` — Detailed](which.detailed.md) resolves command names through PATH.
- [`whereis` — Detailed](whereis.detailed.md) checks standard command locations.
- `xargs` (Stage 04) builds commands from input paths.
- [`find` — Revision](find.revision.md)
