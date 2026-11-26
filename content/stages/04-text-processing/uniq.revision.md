---
id: uniq
title: "uniq"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Collapse or count adjacent duplicate lines."
tags: [duplicates, counting, pipelines]
related: [sort, cut, wc]
---
# `uniq` — Revision

> Collapse or count adjacent duplicate lines.

**Syntax:** `uniq [OPTION]... [INPUT [OUTPUT]]`

**Useful options:** -c prefixes counts; -d shows only repeated lines; -u shows lines that occur once; -i compares without case sensitivity.

**Remember:** `uniq` compares each line only with its immediate neighbor. For a global count of repeated values, sort the values first so identical lines become adjacent: `... | sort | uniq -c`. If input is already grouped, sorting may be unnecessary and can destroy meaningful order.

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

## Quick recall

1. Count departments and transaction statuses. Compare `uniq -c` with and without sorting on `error warning error`.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./uniq.detailed.md).
