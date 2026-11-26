---
id: diff
title: "diff"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Compare text files or streams and show how their lines differ."
tags: [compare, unified diff, files]
related: [grep, sort, cat]
---
# `diff` — Detailed

## What it does

Compare text files or streams and show how their lines differ.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
diff [OPTION]... FILE1 FILE2
```

## Arguments and options

-u unified context output; -q report only whether files differ; -y side-by-side; --label names process-substitution inputs where supported by Bash.

## Core concept

`diff` returns 0 when inputs match, 1 when differences exist, and greater than 1 for an error. A status of 1 is an expected comparison result, so scripts should handle it explicitly. Bash process substitution `<(command)` provides temporary readable streams without writing fixtures.

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

## Practical scenario

Compare two small text streams or project fixtures without altering them. Use unified output to see changed lines.

## Common mistakes

Treating status 1 as an execution error. Comparing differently ordered lists may show many changes; sort only when order is irrelevant. Some diff options are GNU-specific. Process substitution requires Bash and is not POSIX sh.

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

Compare the app and auth logs by using `diff -u` on short `head` streams; explain why status 1 is expected.

### Combination challenge

Use `diff` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
diff -u <(printf 'alpha\nbeta\n') <(printf 'alpha\ngamma\n') || test "$?" -eq 1
diff -u <(sort playground/data/employees.csv) <(sort playground/data/employees.csv)
diff -q playground/projects/atlas/src/README.txt playground/projects/atlas/src/tasks.txt || test "$?" -eq 1
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`grep` — Detailed](../04-text-processing/grep.detailed.md)
- [`sort` — Detailed](../04-text-processing/sort.detailed.md)
- [`cat` — Detailed](../02-file-content/cat.detailed.md)
- [`diff` — Revision](./diff.revision.md)
