---
id: sort
title: "sort"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Order lines lexically, numerically, or by selected fields."
tags: [ordering, numeric, fields]
related: [uniq, cut, join, awk]
---
# `sort` — Revision

> Order lines lexically, numerically, or by selected fields.

**Syntax:** `sort [OPTIONS] [FILE...]`

**Useful options:** -n numeric; -r reverse; -u unique output; -t sets field delimiter; -k selects a key field/range; -f ignores case; -V natural version order.

**Remember:** By default, sort compares lines lexically according to locale. Numeric values should use `-n`; lexical order can put `100` before `20`. For CSVs, `-t, -k3,3` sorts using field 3. If deterministic byte ordering matters, set `LC_ALL=C` for that command.

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

## Quick recall

1. Sort transaction data by amount ascending and descending; sort extracted department names before counting them.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./sort.detailed.md).
