---
id: join
title: "join"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Combine two text files on matching fields."
tags: [relational data, fields, sorted input]
related: [sort, cut, awk]
---
# `join` — Detailed

## What it does

Combine two text files on matching fields.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
join [OPTIONS] FILE1 FILE2
```

## Arguments and options

-t sets a one-character field separator; -1 and -2 choose join fields (default field 1); -a 1 or -a 2 includes unpaired rows; -e supplies a replacement for empty fields.

## Core concept

By default, `join` matches the first whitespace-delimited field. Both inputs must be sorted on their respective join fields using the same ordering and compatible locales. For comma-separated synthetic data, set `-t,`; remove headers first, then sort the employee data on department field 3 and department data on field 2.

## Examples

```bash
join -t, -1 3 -2 2 <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
```

Engineering employees match the Engineering department record; likewise Support and Finance.

```bash
join <(printf 'A 1\nB 2\n' | sort) <(printf 'A x\nB y\n' | sort)
```

The inputs are sorted on their default first fields, so the output pairs each matching key and its remaining fields.

```bash
join -t, -1 3 -2 2 -a 1 -e '(unmatched)' <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
```

Joins department names while retaining any unmatched employee-side rows.

## Practical scenario

Join the employee and department datasets by department name. The examples use process substitution, supported by Bash, to avoid writing derived files.

## Common mistakes

Unsorted inputs can produce missing or incorrect matches. Leaving the header in means it is treated as data. Selecting the wrong fields or delimiter prevents matches. `join` is line-oriented and does not parse quoted CSV.

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

Join employee records to department manager IDs. Try `-a 1` and explain how it preserves employee rows whose department does not match.

### Combination challenge

Use `join` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
join -t, -1 3 -2 2 <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
join -t, -1 3 -2 2 -a 1 -e '(unmatched)' <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
tail -n +2 playground/data/employees.csv | sort -t, -k3,3 | cut -d, -f3 | uniq -c
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`sort` — Detailed](../04-text-processing/sort.detailed.md)
- [`cut` — Detailed](../04-text-processing/cut.detailed.md)
- [`awk` — Detailed](../04-text-processing/awk.detailed.md)
- [`join` — Revision](./join.revision.md)
