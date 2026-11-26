---
id: join
title: "join"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Combine two text files on matching fields."
tags: [relational data, fields, sorted input]
related: [sort, cut, awk]
---
# `join` — Revision

> Combine two text files on matching fields.

**Syntax:** `join [OPTIONS] FILE1 FILE2`

**Useful options:** -t sets a one-character field separator; -1 and -2 choose join fields (default field 1); -a 1 or -a 2 includes unpaired rows; -e supplies a replacement for empty fields.

**Remember:** By default, `join` matches the first whitespace-delimited field. Both inputs must be sorted on their respective join fields using the same ordering and compatible locales. For comma-separated synthetic data, set `-t,`; remove headers first, then sort the employee data on department field 3 and department data on field 2.

## Examples

```bash
join -t, -1 3 -2 2 <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
```

Engineering employees match the Engineering department record; likewise Support and Finance.

```bash
printf 'A 1\nB 2\n' | sort > /dev/null
```

A harmless demonstration that join's default whitespace key expects sorted inputs.

```bash
join -t, -1 3 -2 2 -a 1 -e '(unmatched)' <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
```

Joins department names while retaining any unmatched employee-side rows.

## Quick recall

1. Join employee records to department manager IDs. Try `-a 1` and explain how it preserves employee rows whose department does not match.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./join.detailed.md).
