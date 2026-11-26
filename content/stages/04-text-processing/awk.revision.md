---
id: awk
title: "awk"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Select, transform, and calculate over records using fields and patterns."
tags: [fields, records, calculations, reports]
related: [cut, grep, sort, join]
---
# `awk` — Revision

> Select, transform, and calculate over records using fields and patterns.

**Syntax:** `awk [OPTIONS] 'BEGIN { ... } PATTERN { ACTION } END { ... }' [FILE...]`

**Useful options:** -F sets the input field separator; `$0` is the whole record, `$1` first field, `NF` field count, `NR` record number. `-v name=value` passes a variable safely.

**Remember:** Awk reads records (normally lines), splits each into fields, runs actions for matching conditions, and can print formatted summaries. `BEGIN` runs before input; `END` runs afterward. Set `-F,` for these simple synthetic CSVs, but awk is not a complete CSV parser: quoted commas, escaped quotes, or newlines inside a quoted field break simple field splitting.

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

## Quick recall

1. Calculate active employee counts and completed transaction totals. Format currency with two decimal places and verify total 54.75.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./awk.detailed.md).
