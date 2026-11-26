---
id: tr
title: "tr"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Translate, delete, or squeeze individual characters in standard input."
tags: [translate, characters, stdin]
related: [cut, awk, grep]
---
# `tr` — Detailed

## What it does

Translate, delete, or squeeze individual characters in standard input.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
tr [OPTION]... SET1 [SET2]
```

## Arguments and options

-d deletes characters in SET1; -s squeezes repeated characters; -c complements SET1; character classes include `[:lower:]` and `[:upper:]`.

## Core concept

`tr` reads from standard input and writes transformed text to standard output. It is character-oriented, not field-aware: replacing commas across a CSV may also affect commas inside quoted text. Use `printf` for predictable test strings and pipes to feed files.

## Examples

```bash
printf '%s\n' 'Synthetic Log' | tr '[:lower:]' '[:upper:]'
```

SYNTHETIC LOG

```bash
printf '%s\n' 'a,,b,,,c' | tr -s ','
```

a,b,c

```bash
printf '%s\n' 'T5001,A100,notebook,3,12.75,complete' | tr ',' '\t'
```

Same characters with tabs replacing commas.

## Practical scenario

Normalize a label or convert simple unquoted CSV separators to tabs for display. Do not use that conversion as a general CSV parser.

## Common mistakes

`tr` generally requires stdin, so `tr ... file.csv` treats the filename as a set argument and fails. Shell quoting keeps character sets intact. Character classes and multibyte behavior depend on locale; use known simple ASCII data for predictable transformations.

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

Uppercase status values, squeeze repeated spaces in a label, and convert one synthetic transaction row to tab-separated display.

### Combination challenge

Use `tr` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
printf '%s\n' 'Synthetic Log' | tr '[:lower:]' '[:upper:]'
printf '%s\n' 'a,,b,,,c' | tr -s ','
head -n 2 playground/data/transactions.csv | tail -n 1 | tr ',' '\t'
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`cut` — Detailed](../04-text-processing/cut.detailed.md)
- [`awk` — Detailed](../04-text-processing/awk.detailed.md)
- [`grep` — Detailed](../04-text-processing/grep.detailed.md)
- [`tr` — Revision](./tr.revision.md)
