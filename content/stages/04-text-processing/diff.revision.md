---
id: diff
title: "diff"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Compare text files or streams and show how their lines differ."
tags: [compare, unified diff, files]
related: [grep, sort, cat]
---
# `diff` — Revision

> Compare text files or streams and show how their lines differ.

**Syntax:** `diff [OPTION]... FILE1 FILE2`

**Useful options:** -u unified context output; -q report only whether files differ; -y side-by-side; --label names process-substitution inputs where supported by Bash.

**Remember:** `diff` returns 0 when inputs match, 1 when differences exist, and greater than 1 for an error. A status of 1 is an expected comparison result, so scripts should handle it explicitly. Bash process substitution `<(command)` provides temporary readable streams without writing fixtures.

## Examples

```bash
diff -u <(printf 'alpha\nbeta\n') <(printf 'alpha\ngamma\n') || test "$?" -eq 1
```

Shows beta removed and gamma added; status 1 means different.

```bash
diff -u <(sort playground/data/employees.csv) <(sort playground/data/employees.csv)
```

No output and status 0 for identical sorted streams.

```bash
diff -q playground/projects/atlas/src/README.txt playground/projects/atlas/src/tasks.txt || test "$?" -eq 1
```

Reports that the two text files differ.

## Quick recall

1. Compare the app and auth logs by using `diff -u` on short `head` streams; explain why status 1 is expected.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./diff.detailed.md).
