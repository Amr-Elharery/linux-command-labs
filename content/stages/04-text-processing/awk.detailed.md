---
id: awk
title: "awk"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Select, transform, and calculate over records using fields and patterns."
tags: [fields, records, calculations, reports]
related: [cut, grep, sort, join]
---
# `awk` — Detailed

## What it does

Select, transform, and calculate over records using fields and patterns.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
awk [OPTIONS] 'BEGIN { ... } PATTERN { ACTION } END { ... }' [FILE...]
```

## Arguments and options

-F sets the input field separator; `$0` is the whole record, `$1` first field, `NF` field count, `NR` record number. `-v name=value` passes a variable safely.

## Core concept

Awk reads records (normally lines), splits each into fields, runs actions for matching conditions, and can print formatted summaries. `BEGIN` runs before input; `END` runs afterward. Set `-F,` for these simple synthetic CSVs, but awk is not a complete CSV parser: quoted commas, escaped quotes, or newlines inside a quoted field break simple field splitting.

## Examples

```bash
awk -F, 'NR > 1 { print $2, $3 }' playground/data/employees.csv
```

Prints each employee name and department.

```bash
awk -F, 'NR > 1 && $6 == "complete" { total += $5; count++ } END { printf "completed total: %.2f (%d rows)\n", total, count }' playground/data/transactions.csv
```

completed total: 54.75 (3 rows)

```bash
awk -F, 'BEGIN { FS=","; OFS=" | "; print "DEPARTMENT", "COUNT" } NR > 1 { count[$3]++ } END { for (d in count) printf "%s%s%d\n", d, OFS, count[d] }' playground/data/employees.csv
```

Department counts in unspecified map iteration order; values are Engineering 2, Support 2, Finance 1.

## Practical scenario

Calculate the total of completed transaction amounts and count employees by department. Use a deterministic sort after awk if display order matters.

## Common mistakes

Forgetting to skip the CSV header. Numeric fields containing commas or quoted commas require a CSV parser. Awk programs are quoted as a whole so `$1` reaches awk instead of shell expansion. Associative array iteration order is unspecified. `printf` format specifiers must match values.

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

Calculate active employee counts and completed transaction totals. Format currency with two decimal places and verify total 54.75.

### Combination challenge

Use `awk` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
awk -F, 'NR > 1 { print $2, $3 }' playground/data/employees.csv
awk -F, 'NR > 1 && $6 == "complete" { total += $5; count++ } END { printf "completed total: %.2f (%d rows)\n", total, count }' playground/data/transactions.csv
awk -F, 'NR > 1 && $5 == "active" { active++ } END { printf "active employees: %d\n", active }' playground/data/employees.csv
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`cut` — Detailed](../04-text-processing/cut.detailed.md)
- [`grep` — Detailed](../04-text-processing/grep.detailed.md)
- [`sort` — Detailed](../04-text-processing/sort.detailed.md)
- [`join` — Detailed](../04-text-processing/join.detailed.md)
- [`awk` — Revision](./awk.revision.md)
