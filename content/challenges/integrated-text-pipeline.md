---
id: integrated-text-pipeline
title: "Integrated Pipeline Challenge"
type: challenge
stage: 4
difficulty: intermediate
summary: "Investigate synthetic logs and tabular datasets with a reproducible multi-command pipeline."
objectives: ["Build safe text-processing pipelines", "Use deterministic synthetic logs and datasets", "Explain assumptions about headers, sorting, fields, and CSV text"]
prerequisites: [grep, wc, cut, sort, uniq, tr, diff, join, xargs, awk]
starting_files: [playground/logs/app.log, playground/logs/auth.log, playground/data/employees.csv, playground/data/transactions.csv, playground/data/departments.csv]
---
# Integrated Pipeline Challenge

## Scenario

Investigate synthetic logs and tabular datasets with a reproducible multi-command pipeline. Use the supplied synthetic fixtures only.

## Task requirements

Build a report with (1) application severity counts, (2) authentication failures count, (3) employee department counts, (4) completed transaction total, (5) an employee-department join, and (6) a NUL-safe read-only xargs operation over the logs. Compare two small derived summaries with diff. Use no generated files and no commands outside playground except standard shell builtins.

## Constraints

- Read from `playground/`; do not redirect into or modify source fixtures.
- Quote grep patterns, awk programs, and filenames as needed.
- Skip CSV headers before counting or joining records.
- Simple text tools do not handle quoted CSV fields containing commas or newlines.
- Do not use `sudo`, system paths, or shell evaluation of data.

## Progressive hints

<details>
<summary>Hint 1 — choose the data flow</summary>

Use pipes to pass one command's stdout to the next command's stdin. Check each stage separately before combining it.
</details>

<details>
<summary>Hint 2 — field and ordering assumptions</summary>

The fixture header is a record. Remove it with `tail -n +2`. Sort join inputs on the selected fields; sort numeric amounts with `-n`.
</details>

<details>
<summary>Hint 3 — filenames and status codes</summary>

For filenames, use `find ... -print0 | xargs -0`. A grep no-match status is 1, and diff returns 1 when content differs; both may be expected outcomes.
</details>

## Expected result and validation

Results should agree with the fixed fixture rows. The completed transaction total is 68.25; there are four active employees; department counts are Engineering 2, Finance 1, Support 2. Join output order follows the sorted keys. The task can be repeated without changing fixtures.

## Solution

<details>
<summary>Show solution</summary>

```bash
grep -oE 'INFO|DEBUG|WARN|ERROR' playground/logs/app.log | sort | uniq -c
 grep -ic 'failed' playground/logs/auth.log | awk '{ printf "failed authentication events: %d\n", $1 }'
tail -n +2 playground/data/employees.csv | cut -d, -f3 | sort | uniq -c
awk -F, 'NR > 1 && $6 == "complete" { total += $5 } END { printf "completed total: %.2f\n", total }' playground/data/transactions.csv
join -t, -1 3 -2 2 <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
find playground/logs -type f -name '*.log' -print0 | xargs -0 -r wc -l --
diff -u <(printf 'WARN\nERROR\n') <(printf 'WARN\nERROR\n')
```

</details>

## Reset

These challenges are read-only. If you choose to create scratch files during independent practice, keep them under `playground/projects/organization-lab/` and restore them with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.
