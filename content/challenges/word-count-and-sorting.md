---
id: word-count-and-sorting
title: "Word Count and Sorting"
type: challenge
stage: 4
difficulty: intermediate
summary: "Count and rank synthetic transaction statuses and employee departments."
objectives: ["Build safe text-processing pipelines", "Use deterministic synthetic logs and datasets", "Explain assumptions about headers, sorting, fields, and CSV text"]
prerequisites: [wc, cut, sort, uniq]
starting_files: [playground/data/employees.csv, playground/data/transactions.csv]
---
# Word Count and Sorting

## Scenario

Count and rank synthetic transaction statuses and employee departments. Use the supplied synthetic fixtures only.

## Task requirements

Count employees excluding the header. Produce department counts and transaction status counts. Sort numeric transaction amounts ascending. Explain why sort precedes uniq and why numeric sort matters.

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

Results should agree with the fixed fixture rows. The completed transaction total is 54.75; there are four active employees; department counts are Engineering 2, Finance 1, Support 2. Join output order follows the sorted keys. The task can be repeated without changing fixtures.

## Solution

<details>
<summary>Show solution</summary>

```bash
tail -n +2 playground/data/employees.csv | wc -l
tail -n +2 playground/data/employees.csv | cut -d, -f3 | sort | uniq -c
tail -n +2 playground/data/transactions.csv | cut -d, -f6 | sort | uniq -c
tail -n +2 playground/data/transactions.csv | sort -t, -k5,5n
```

</details>

## Reset

These challenges are read-only. If you choose to create scratch files during independent practice, keep them under `playground/projects/organization-lab/` and restore them with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.
