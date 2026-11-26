---
id: log-triage
title: "Log Triage"
type: challenge
stage: 4
difficulty: beginner
summary: "Summarize warning and error lines from a synthetic application log."
objectives: ["Filter lines by pattern", "Count matching records", "Preserve the source fixture"]
prerequisites: [grep, wc]
starting_files: [playground/logs/app.log]
---

# Log Triage

## Scenario

A teammate asks for a quick summary of notable events in a small synthetic service log. Work from the repository root and leave the fixture unchanged.

## Task requirements

1. Display all warning and error lines with their line numbers.
2. Count the error lines.
3. Display lines that are not debug messages.
4. Do not edit or overwrite `playground/logs/app.log`.

## Constraints

Use only the supplied synthetic file. Do not search host logs or redirect output into the fixture.

## Hints

<details>
<summary>Hint 1</summary>

Use extended patterns to match either of two severity labels.
</details>

<details>
<summary>Hint 2</summary>

`grep -c` prints the number of matching lines. `grep -v` selects non-matching lines.
</details>

## Expected result

The fixture contains two `WARN` lines and one `ERROR` line. The warning/error command should therefore show three records, and the error count should be `1`.

## Solution

<details>
<summary>Show solution</summary>

```bash
grep -En 'WARN|ERROR' playground/logs/app.log
grep -c 'ERROR' playground/logs/app.log
grep -v 'DEBUG' playground/logs/app.log
```

The outputs are illustrative line selections from the committed synthetic fixture. The final command keeps all non-debug records.
</details>

## Reset

No reset is needed: all commands are read-only and the starting file is committed synthetic content.
