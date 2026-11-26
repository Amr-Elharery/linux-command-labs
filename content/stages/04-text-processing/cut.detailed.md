---
id: cut
title: "cut"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Extract delimited fields or character positions from each line."
tags: [fields, delimiters, csv]
related: [awk, sort, join]
---
# `cut` — Detailed

## What it does

Extract delimited fields or character positions from each line.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
cut -d DELIMITER -f LIST [FILE...]
```

## Arguments and options

-d sets a one-character delimiter; -f selects fields (1-based; ranges such as 2-4); -c selects character positions; --complement selects everything except chosen fields.

## Core concept

The default delimiter for `-f` is TAB. For the synthetic comma-separated files, use `-d,`. `cut` treats each line as simple delimiter-separated text; it does not understand quoted CSV fields containing commas, escaped quotes, or embedded newlines. Use a CSV-aware parser for general CSV.

## Examples

```bash
cut -d, -f2,3 playground/data/employees.csv
```

name,department (header) followed by synthetic records

```bash
cut -d, -f1,5 playground/data/transactions.csv
```

transaction_id,status and rows

```bash
cut -d, -f3 playground/data/employees.csv | sort | uniq -c
```

Counts department values (header is included unless removed).

## Practical scenario

Extract department and status fields from synthetic CSVs. Account for the header explicitly using `head -n 1` or `tail -n +2` when analyzing data rows.

## Common mistakes

Forgetting `-d,` makes the comma file behave like one field. Field numbers start at 1. A delimiter containing multiple characters is not supported. Simple cut/sort/awk CSV pipelines break when fields contain quoted commas.

- Quote paths containing spaces, for example `"playground/projects/organization-lab/inbox/quarterly report.txt"`.
- A pipeline connects stdout to stdin. Use `>` to replace a file and `>>` to append; both can overwrite or alter files, so these guides avoid redirecting into source fixtures. `<` supplies stdin from a file.
- Bash normally returns the status of the final pipeline command. In scripts, `set -o pipefail` also exposes earlier pipeline failures.

## Safety notes

All file examples read synthetic files beneath `playground/`. The only pipelines that create derived paths are omitted; process substitutions and standard input keep examples read-only. Keep recursive grep, xargs, and data-processing commands scoped to the playground. Never use a shell pipeline to process untrusted filenames as code.

## Exercises

### Guided practice

1. Run the first example and explain what each side of any pipe receives.
2. Repeat with the relevant option changed (case, delimiter, key, or field).
3. Check the result against the fixture and account for its header when present.

### Independent practice

Print employee names and departments without the header; extract transaction amount and status; describe the CSV quoting limitation.

### Combination challenge

Use `cut` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
tail -n +2 playground/data/employees.csv | cut -d, -f2,3
tail -n +2 playground/data/transactions.csv | cut -d, -f1,5
cut -d, -f3 playground/data/employees.csv | tail -n +2
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`awk` — Detailed](../04-text-processing/awk.detailed.md)
- [`sort` — Detailed](../04-text-processing/sort.detailed.md)
- [`join` — Detailed](../04-text-processing/join.detailed.md)
- [`cut` — Revision](./cut.revision.md)
