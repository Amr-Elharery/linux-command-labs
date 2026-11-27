---
id: 04-text-processing
title: "Text Processing Cheat Sheet"
type: cheatsheet
stage: 4
summary: "Build small pipelines to search, count, extract, order, compare, join, and summarize text."
commands: [grep, wc, cut, sort, uniq, tr, diff, join, xargs, awk]
---

# Text Processing Cheat Sheet

## Commands covered

| Command | Purpose |
| --- | --- |
| `grep` | Select lines matching a string or regular expression. |
| `wc` | Count lines, words, bytes, or characters. |
| `cut` | Extract character positions or delimiter-separated fields. |
| `sort` | Order lines or selected fields. |
| `uniq` | Collapse or count adjacent duplicate lines. |
| `tr` | Translate, delete, or squeeze characters from stdin. |
| `diff` | Compare text files and show changed lines. |
| `join` | Combine sorted text inputs on matching fields. |
| `xargs` | Turn stdin into command arguments. |
| `awk` | Filter records, process fields, calculate, and format output. |

## Purpose

A pipeline sends stdout from one command to the next command's stdin: `command | command`. These examples use synthetic logs and simple CSV fixtures under `playground/`. Quote shell patterns and `awk` programs so the shell passes them intact.

## Essential syntax

```text
grep [OPTIONS] PATTERN [FILE...]
wc [OPTIONS] [FILE...]
cut -d DELIMITER -f FIELDS FILE
sort [OPTIONS] [FILE...]
uniq [OPTIONS] [FILE...]
tr [OPTIONS] SET1 [SET2]
diff -u FILE1 FILE2
join [OPTIONS] FILE1 FILE2
xargs [OPTIONS] COMMAND
awk -F SEP 'PATTERN { ACTION }' FILE
```

`|` connects streams; `>` replaces an output file and `>>` appends. Exit status 0 usually means success; `grep` returns 1 when it finds no matching lines. In pipelines, Bash normally reports the last command's status; scripts can enable `set -o pipefail`.

## High-value options

- `grep -i` ignores case; `-n` shows line numbers; `-F` treats a pattern literally; `-E` enables extended regular expressions; `-r` searches directories recursively.
- `wc -l`, `-w`, `-c` count lines, words, and bytes.
- `cut -d, -f3` selects comma-delimited field 3. It does not parse quoted CSV fields.
- `sort -n` sorts numerically; `-r` reverses order; `-t, -k5,5n` sorts by numeric CSV field 5.
- `uniq -c` counts adjacent repeats; sort first for global duplicate counts.
- `tr -d SET` deletes characters; `-s SET` squeezes repeated characters.
- `diff -u` prints a unified comparison.
- `join -t, -1 N -2 N` selects a delimiter and the join field in each input; both inputs must be sorted by their join fields.
- `xargs -0` reads NUL-separated items; GNU `-r` skips running the command for empty input.
- `awk -F,` sets a simple field separator; `$1`, `$2`, `$NF` are fields; `BEGIN`/`END` run before/after records; `printf` formats results.

## Short examples

Run from the repository root:

```bash
grep -in -E 'WARN|ERROR' playground/logs/app.log
wc -l playground/logs/auth.log
tail -n +2 playground/data/employees.csv | cut -d, -f3 | sort | uniq -c
tail -n +2 playground/data/transactions.csv | sort -t, -k5,5n
printf '%s\n' 'Linux labs' | tr '[:lower:]' '[:upper:]'
```

```bash
diff -u playground/projects/atlas/README.md playground/projects/atlas/src/README.txt
join -t, -1 3 -2 2 <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
find playground/projects/organization-lab -type f -print0 | xargs -0 -r ls -ld --
awk -F, 'NR > 1 && $6 == "complete" { total += $5 } END { printf "completed total: %.2f\n", total }' playground/data/transactions.csv
```

The join example uses Bash process substitution. The transaction example reports the fixture's completed total as `54.75`.

## Useful combinations

- `grep -i 'failed' playground/logs/auth.log | wc -l`: count matching lines.
- `cut -d, -f3 employees.csv | sort | uniq -c`: count adjacent department names after sorting (skip the CSV header first).
- `find ... -print0 | xargs -0 ...`: preserve unusual filenames across a pipeline.
- `awk` can combine filtering, aggregation, and formatted output without writing intermediate files.

## Common mistakes and safety

- `uniq` compares adjacent lines only. Use `sort | uniq -c` to count duplicates across unsorted input.
- Numeric data needs `sort -n`; CSVs need the right delimiter and key field.
- `join` requires sorted inputs and matching fields. Headers must be removed or handled deliberately.
- Simple `cut -d,` and `awk -F,` are not full CSV parsers; quoted commas and embedded newlines require a CSV-aware tool.
- `xargs` splits whitespace by default. Prefer `find -print0 | xargs -0` for paths.
- Scope recursive `grep`, `find`, and `xargs` to `playground/`; avoid redirection that overwrites source fixtures.

## Learn more

| Command | Detailed | Revision |
| --- | --- | --- |
| `grep` | [Guide](../stages/04-text-processing/grep.detailed.md) | [Review](../stages/04-text-processing/grep.revision.md) |
| `wc` | [Guide](../stages/04-text-processing/wc.detailed.md) | [Review](../stages/04-text-processing/wc.revision.md) |
| `cut` | [Guide](../stages/04-text-processing/cut.detailed.md) | [Review](../stages/04-text-processing/cut.revision.md) |
| `sort` | [Guide](../stages/04-text-processing/sort.detailed.md) | [Review](../stages/04-text-processing/sort.revision.md) |
| `uniq` | [Guide](../stages/04-text-processing/uniq.detailed.md) | [Review](../stages/04-text-processing/uniq.revision.md) |
| `tr` | [Guide](../stages/04-text-processing/tr.detailed.md) | [Review](../stages/04-text-processing/tr.revision.md) |
| `diff` | [Guide](../stages/04-text-processing/diff.detailed.md) | [Review](../stages/04-text-processing/diff.revision.md) |
| `join` | [Guide](../stages/04-text-processing/join.detailed.md) | [Review](../stages/04-text-processing/join.revision.md) |
| `xargs` | [Guide](../stages/04-text-processing/xargs.detailed.md) | [Review](../stages/04-text-processing/xargs.revision.md) |
| `awk` | [Guide](../stages/04-text-processing/awk.detailed.md) | [Review](../stages/04-text-processing/awk.revision.md) |
