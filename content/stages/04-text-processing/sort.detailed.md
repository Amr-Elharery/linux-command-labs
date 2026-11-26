---
id: sort
title: "sort"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Order lines lexically, numerically, or by selected fields."
tags: [ordering, numeric, fields]
related: [uniq, cut, join, awk]
---
# `sort` — Detailed

## What it does

Order lines lexically, numerically, or by selected fields.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
sort [OPTIONS] [FILE...]
```

## Arguments and options

-n numeric; -r reverse; -u unique output; -t sets field delimiter; -k selects a key field/range; -f ignores case; -V natural version order.

## Core concept

By default, sort compares lines lexically according to locale. Numeric values should use `-n`; lexical order can put `100` before `20`. For CSVs, `-t, -k3,3` sorts using field 3. If deterministic byte ordering matters, set `LC_ALL=C` for that command.

## Examples

```bash
tail -n +2 playground/data/employees.csv | cut -d, -f3 | sort | uniq -c
```

2 Engineering; 2 Support; 1 Finance (display order may depend on locale).

```bash
tail -n +2 playground/data/transactions.csv | sort -t, -k5,5n
```

Rows ordered by amount numerically, header excluded.

```bash
printf '%s\n' 100 20 3 | sort -n
```

3, 20, 100

## Practical scenario

Sort transaction rows by numeric amount and employee records by department. Remove headers before sorting so the header does not become an apparent data row.

## Common mistakes

Sorting the whole CSV line is not equivalent to sorting one column. Omit `-n` for numeric values and lexical order may surprise. `-k5` can include later key fields; use `-k5,5` for precisely one field. Locale affects text ordering.

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

Sort transaction data by amount ascending and descending; sort extracted department names before counting them.

### Combination challenge

Use `sort` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
tail -n +2 playground/data/transactions.csv | sort -t, -k5,5n
tail -n +2 playground/data/transactions.csv | sort -t, -k5,5nr
printf '%s\n' 100 20 3 | sort -n
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`uniq` — Detailed](../04-text-processing/uniq.detailed.md)
- [`cut` — Detailed](../04-text-processing/cut.detailed.md)
- [`join` — Detailed](../04-text-processing/join.detailed.md)
- [`awk` — Detailed](../04-text-processing/awk.detailed.md)
- [`sort` — Revision](./sort.revision.md)
