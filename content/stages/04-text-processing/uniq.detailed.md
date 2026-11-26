---
id: uniq
title: "uniq"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Collapse or count adjacent duplicate lines."
tags: [duplicates, counting, pipelines]
related: [sort, cut, wc]
---
# `uniq` — Detailed

## What it does

Collapse or count adjacent duplicate lines.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
uniq [OPTION]... [INPUT [OUTPUT]]
```

## Arguments and options

-c prefixes counts; -d shows only repeated lines; -u shows lines that occur once; -i compares without case sensitivity.

## Core concept

`uniq` compares each line only with its immediate neighbor. For a global count of repeated values, sort the values first so identical lines become adjacent: `... | sort | uniq -c`. If input is already grouped, sorting may be unnecessary and can destroy meaningful order.

## Examples

```bash
printf '%s\n' Support Engineering Support | sort | uniq -c
```

1 Engineering; 2 Support

```bash
cut -d, -f3 playground/data/employees.csv | tail -n +2 | sort | uniq -c
```

2 Engineering; 1 Finance; 2 Support

```bash
printf '%s\n' error warning error | uniq
```

error, warning, error (nonadjacent duplicate remains).

## Practical scenario

Count departments from employee records. This is a classic sort/uniq pipeline: extract field 3, skip the header, sort, then count adjacent duplicates.

## Common mistakes

Expecting `uniq -c` alone to count separated duplicates. Sorting before `uniq` changes order; preserve input grouping when order matters. Header rows need handling before aggregation.

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

Count departments and transaction statuses. Compare `uniq -c` with and without sorting on `error warning error`.

### Combination challenge

Use `uniq` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
tail -n +2 playground/data/employees.csv | cut -d, -f3 | sort | uniq -c
tail -n +2 playground/data/transactions.csv | cut -d, -f6 | sort | uniq -c
printf '%s\n' error warning error | uniq -c
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`sort` — Detailed](../04-text-processing/sort.detailed.md)
- [`cut` — Detailed](../04-text-processing/cut.detailed.md)
- [`wc` — Detailed](../04-text-processing/wc.detailed.md)
- [`uniq` — Revision](./uniq.revision.md)
