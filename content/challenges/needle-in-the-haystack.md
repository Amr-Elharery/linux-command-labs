---
id: needle-in-the-haystack
title: "Needle in the Haystack"
type: challenge
stage: 4
difficulty: intermediate
summary: "Find and summarize selected warning and authentication events in synthetic logs."
objectives: ["Build safe text-processing pipelines", "Use deterministic synthetic logs and datasets", "Explain assumptions about headers, sorting, fields, and CSV text"]
prerequisites: [grep, wc, sort]
starting_files: [playground/logs/app.log, playground/logs/auth.log]
---
# Needle in the Haystack

## Scenario

Find and summarize selected warning and authentication events in synthetic logs. Use the supplied synthetic fixtures only.

## Task requirements

Search app.log for WARN or ERROR and count each severity. Search auth.log case-insensitively for failed events. Keep all reads within playground/logs. Report matching lines and counts; no output file is required.

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

The application log contains 2 WARN lines and 1 ERROR line. The authentication log contains 2 lines matching `failed`, regardless of case. Matching-line output should reproduce the corresponding fixture records; the task is read-only and repeatable.

## Solution

<details>
<summary>Show solution</summary>

```bash
grep -n -E 'WARN|ERROR' playground/logs/app.log
grep -ic 'WARN' playground/logs/app.log
grep -ic 'ERROR' playground/logs/app.log
grep -ni 'failed' playground/logs/auth.log
```

</details>

## Reset

These challenges are read-only. If you choose to create scratch files during independent practice, keep them under `playground/projects/organization-lab/` and restore them with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.
