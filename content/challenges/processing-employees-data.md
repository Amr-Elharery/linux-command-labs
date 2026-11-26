---
id: processing-employees-data
title: "Processing Employees Data"
type: challenge
stage: 4
difficulty: intermediate
summary: "Summarize and join employee, department, and transaction records."
objectives: ["Build safe text-processing pipelines", "Use deterministic synthetic logs and datasets", "Explain assumptions about headers, sorting, fields, and CSV text"]
prerequisites: [cut, sort, uniq, join, awk]
starting_files: [playground/data/employees.csv, playground/data/departments.csv, playground/data/transactions.csv]
---
# Processing Employees Data

## Scenario

Summarize and join employee, department, and transaction records. Use the supplied synthetic fixtures only.

## Task requirements

Count active employees by department; calculate total completed transaction amount; join employees to department records by matching department names. Skip headers and sort both join inputs on their respective keys.

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
awk -F, 'NR > 1 && $5 == "active" { count[$3]++ } END { for (d in count) printf "%s,%d\n", d, count[d] }' playground/data/employees.csv | sort
awk -F, 'NR > 1 && $6 == "complete" { total += $5 } END { printf "%.2f\n", total }' playground/data/transactions.csv
join -t, -1 3 -2 2 <(tail -n +2 playground/data/employees.csv | sort -t, -k3,3) <(tail -n +2 playground/data/departments.csv | sort -t, -k2,2)
```

</details>

## Reset

These challenges are read-only. If you choose to create scratch files during independent practice, keep them under `playground/projects/organization-lab/` and restore them with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.
