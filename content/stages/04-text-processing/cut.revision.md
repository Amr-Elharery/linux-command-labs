---
id: cut
title: "cut"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Extract delimited fields or character positions from each line."
tags: [fields, delimiters, csv]
related: [awk, sort, join]
---
# `cut` — Revision

> Extract delimited fields or character positions from each line.

**Syntax:** `cut -d DELIMITER -f LIST [FILE...]`

**Useful options:** -d sets a one-character delimiter; -f selects fields (1-based; ranges such as 2-4); -c selects character positions; --complement selects everything except chosen fields.

**Remember:** The default delimiter for `-f` is TAB. For the synthetic comma-separated files, use `-d,`. `cut` treats each line as simple delimiter-separated text; it does not understand quoted CSV fields containing commas, escaped quotes, or embedded newlines. Use a CSV-aware parser for general CSV.

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

## Quick recall

1. Print employee names and departments without the header; extract transaction amount and status; describe the CSV quoting limitation.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./cut.detailed.md).
