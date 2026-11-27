---
id: 03-file-search
title: "File Search Cheat Sheet"
type: cheatsheet
stage: 3
summary: "Resolve executables and search known trees by name and file properties."
commands: [which, whereis, find]
---

# File Search Cheat Sheet

## Commands covered

| Command | Purpose |
| --- | --- |
| `which` | Show an external command resolved through `PATH`. |
| `whereis` | Find standard binary, source, and manual locations. |
| `find` | Walk an explicit directory tree and test file predicates. |

## Purpose

Use `which` and `whereis` for command lookup; use `find` for files under a selected directory. Limit practice searches to `playground/` to avoid private or system data.

## Essential syntax

```text
which [OPTIONS] COMMAND...
whereis [OPTIONS] NAME...
find START_PATH... [EXPRESSION]
```

`which` searches `PATH`; `whereis` checks known standard locations; `find` searches the exact tree you name. These tools answer different questions.

## High-value options

- GNU/Linux `which -a NAME` lists all matching executable paths in `PATH`.
- `whereis -b NAME` limits output to binaries; `-m` limits it to manual pages; `-s` searches source locations.
- `find -name` matches case-sensitively; `-iname` ignores case. Quote wildcard patterns.
- `find -type f` selects regular files; `-type d` directories; `-type l` symbolic links.
- `find -size +Nc` matches files larger than N bytes; `-mmin -N` selects files modified within N minutes; `-mtime N` checks age in whole-day buckets.
- GNU `find -maxdepth N` limits descent; `-mindepth N` skips shallow levels. Adjacent predicates are ANDed; group `-o` alternatives with escaped parentheses.
- Use read-only `-exec ... {} +` for batched inspection. Use `-print0 | xargs -0` for filenames containing spaces/newlines.

## Short examples

Run from the repository root:

```bash
which -a grep
whereis -b grep
find playground/logs -type f -name '*.log' -print
find playground/data -type f -iname '*.CSV' -print
find playground -type f -size +200c -print
find playground -type f -mmin -60 -print
```

## Useful combinations

- `find playground/logs -type f -name '*.log' -exec wc -l -- {} +`: count lines in matching logs.
- `find playground/projects/organization-lab -type f -print0 | xargs -0 -r ls -ld --`: safely inspect paths, including names with spaces.
- `find playground -type f \( -iname '*.log' -o -iname '*.conf' \) -print`: group alternatives with OR.

## Common mistakes and safety

- `which` may not resolve shell builtins or aliases; it does not search arbitrary files. `whereis` does not recursively scan your repository.
- `find` output order is unspecified. Its start path matters; `..` can escape the playground.
- Permission errors mean a directory could not be traversed. Narrow the path or inspect permissions; do not use `sudo` to force a search.
- Keep `find` examples read-only. Do not turn discovery into `-delete`, `-exec rm`, or `xargs rm`.
- `-mtime` uses whole-day age buckets, while `-mmin` uses minutes; results change with time.

## Learn more

| Command | Detailed | Revision |
| --- | --- | --- |
| `which` | [Guide](../stages/03-file-search/which.detailed.md) | [Review](../stages/03-file-search/which.revision.md) |
| `whereis` | [Guide](../stages/03-file-search/whereis.detailed.md) | [Review](../stages/03-file-search/whereis.revision.md) |
| `find` | [Guide](../stages/03-file-search/find.detailed.md) | [Review](../stages/03-file-search/find.revision.md) |
