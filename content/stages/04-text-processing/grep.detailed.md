---
id: grep
title: "grep"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Search lines of text for fixed strings or regular-expression patterns."
tags: [search, logs, regular-expressions]
related: [wc, awk, find]
---
# `grep` — Detailed

## What it does

Search lines of text for fixed strings or regular-expression patterns.

## Why it matters

Text processing commands are most useful as small stages in a pipeline. Each reads arguments and/or standard input, then writes results to standard output; a pipe passes those results onward without an intermediate file.

## Syntax

```text
grep [OPTIONS] PATTERN [FILE...]
```

## Arguments and options

- `-i`: ignore letter case; `-n`: print matching line numbers; `-v`: select nonmatching lines.
- `-c`: count matching lines; `-F`: treat the pattern literally; `-w`: match whole words (GNU grep).
- `-r`: search directories recursively; keep the root scoped to `playground/`.
- `-E`: use extended regular expressions, including `|` and `+` with fewer escapes; `--` ends option parsing.

## Core concept

A pattern is interpreted as a basic regular expression (BRE) by default. `.` matches one character, `^` anchors a line start, `$` anchors its end, and `*` repeats the preceding expression. Quote patterns so the shell passes them intact. `-E` enables the more readable extended syntax such as `WARN|ERROR`. Recursive searches should name a bounded playground directory and can use `--include` to restrict file types.

## Standard input and pipelines

When no file is named, grep reads standard input. A pipe (`|`) connects one command's standard output to the next command's standard input, so filtered lines can be counted without an intermediate file. Input/output redirection (`<`, `>`, `>>`) reads or writes files; avoid redirecting over a source fixture. Quote a pattern to keep shell glob characters from expanding before grep receives them.

## Examples

```bash
grep -n 'ERROR' playground/logs/app.log
```

```text
2025-03-08T09:15:15Z ERROR request timed out
```

The line is printed because its text matches. Grep exits 0 when it finds a match, 1 when it finds none, and a larger status for an error.

```bash
grep -i -E 'warn|error' playground/logs/app.log
```

```text
2025-03-08T09:14:00Z WARN cache refresh delayed
2025-03-08T09:15:15Z ERROR request timed out
2025-03-08T09:16:30Z WARN retry limit approaching
```

```bash
grep -Rni --include='*.log' 'failed password' playground/logs
```

Shows the synthetic failed-password record(s) from auth.log. Recursive search is useful across several scoped log files.

```bash
grep -c 'ERROR' playground/logs/app.log
grep -F 'service started' playground/logs/app.log
```

The first command prints `1`; the second searches for literal text rather than interpreting a regular expression.

## Practical scenario

Triage synthetic logs by searching `playground/logs/` for `ERROR`, then compare with case-insensitive recursive search for failed authentication events.

## Common mistakes

An unquoted pattern containing `*` may expand as a shell filename glob. BRE and extended regular expressions differ; escape a literal dot or use `-F`. A no-match result normally has exit status 1; that is not a command failure in the usual sense. Recursive search may report unreadable files; narrow the path or inspect only files you can read. Grep filters lines and is not a CSV parser.

- Quote paths containing spaces, for example `"playground/projects/organization-lab/inbox/quarterly report.txt"`.
- A pipeline connects stdout to stdin. Use `>` to replace a file and `>>` to append; both can overwrite or alter files, so these guides avoid redirecting into source fixtures. `<` supplies stdin from a file.
- Bash normally returns the status of the final pipeline command. In scripts, `set -o pipefail` also exposes earlier pipeline failures.

## Safety notes

All file examples read synthetic files beneath `playground/`. The only pipelines that create derived paths are omitted; process substitutions and standard input keep examples read-only. Keep recursive grep, xargs, and data-processing commands scoped to the playground. Never use a shell pipeline to process untrusted filenames as code.

## Exercises

### Guided practice

1. Run `grep -n 'ERROR' playground/logs/app.log`, then use `-i` to search for warnings.
2. Use `-c` to count INFO records and `-v` to select non-DEBUG lines.
3. Search recursively for failed authentication events and explain why the search is scoped to `playground/logs`.

### Independent practice

Find lines containing either `timeout` or `delayed`, case-insensitively. Print line numbers and explain whether your expression uses basic or extended regular-expression syntax.

### Combination challenge

Use `grep` with at least one related command to answer a question about the synthetic logs or data. Explain each pipeline stage and identify which command's exit status is reported.

<details>
<summary>Show exercise answers</summary>

```bash
grep -in -E 'WARN|ERROR' playground/logs/app.log
grep -Rni --include='*.log' 'failed' playground/logs
grep -n 'timeout\|delayed' playground/logs/app.log
```

</details>

## Reset

Examples are read-only. If an exercise creates files, keep them under `playground/projects/organization-lab/` and restore with `bash setup/reset-lab.sh --yes && bash setup/setup.sh`.

## Related commands

- [`wc` — Detailed](../04-text-processing/wc.detailed.md)
- [`awk` — Detailed](../04-text-processing/awk.detailed.md)
- [`find` — Detailed](../03-file-search/find.detailed.md)
- [`grep` — Revision](./grep.revision.md)
