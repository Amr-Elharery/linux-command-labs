---
id: wc
title: "wc"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Count lines, words, bytes, or characters in text."
tags: [count, lines, bytes]
related: [grep, awk, cut]
---
# `wc` — Detailed

## What it does

Count lines, words, bytes, or characters in text.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
wc [OPTION]... [FILE...]
```

## Arguments and options

-l lines; -w words; -c bytes; -m characters. With no file argument, wc reads standard input.

## Core concept

A pipeline connects one program's standard output to the next program's standard input. This lets you count selected data without creating intermediate files. `wc -l` counts newline characters, so a final unterminated line is not counted as a line.

## Examples

```bash
wc -l playground/logs/app.log
```

5 playground/logs/app.log

```bash
grep -i 'warn' playground/logs/app.log | wc -l
```

2

```bash
wc -w < playground/projects/atlas/src/tasks.txt
```

15 (whitespace-delimited words in the fixture)

## Practical scenario

Count total log records and count only warning records by piping grep output to wc. `< file` redirects a file into standard input; `|` sends stdout to the next command.

## Common mistakes

`wc` may include a filename in output when reading named files, but not when reading redirected stdin. `-l` counts newline bytes rather than visual terminal rows. Pipeline status by default is the last command's status in many shells; Bash `set -o pipefail` makes a pipeline report an earlier failure too.

- Quote paths containing spaces, for example `"playground/projects/organization-lab/inbox/quarterly report.txt"`.
- A pipeline connects stdout to stdin. Use `>` to replace a file and `>>` to append; both can overwrite or alter files, so these guides avoid redirecting into source fixtures. `<` supplies stdin from a file.
- Bash normally returns the status of the final pipeline command. In scripts, `set -o pipefail` also exposes earlier pipeline failures.

## Safety notes

All file examples read synthetic files beneath `playground/`. The only pipelines that create derived paths are omitted; process substitutions and standard input keep examples read-only. Keep recursive grep, xargs, and data-processing commands scoped to the playground. Never use a shell pipeline to process untrusted filenames as code.

## Exercises

### Guided practice

1. Run the first example and explain what each side of any pipe receives.
2. Repeat with the relevant option changed (case, delimiter, key, or field).
3. Check the result against the fixture and account for its header when present.

### Independent practice

Count employees and data rows separately; remember the CSV header. Count ERROR lines by piping grep into wc.

### Combination challenge

Use `wc` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
wc -l playground/logs/auth.log
grep -i 'error' playground/logs/app.log | wc -l
wc -w < playground/projects/atlas/src/tasks.txt
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`grep` — Detailed](../04-text-processing/grep.detailed.md)
- [`awk` — Detailed](../04-text-processing/awk.detailed.md)
- [`cut` — Detailed](../04-text-processing/cut.detailed.md)
- [`wc` — Revision](./wc.revision.md)
