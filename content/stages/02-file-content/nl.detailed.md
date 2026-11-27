---
id: nl
title: "nl"
type: command
stage: 2
category: file-content
mode: detailed
difficulty: beginner
summary: "Number lines while displaying text."
tags: [line-numbers, logs, pipeline]
related: [cat, head, tail, less]
---

# `nl` — Detailed

## What it does

`nl` copies text to stdout while adding line numbers. By default GNU `nl` numbers nonempty body lines; options can number every line and control number width and separator.

## Why it matters

Line numbers make it easier to refer to a specific event during a log review. `nl` can number either a file directly or the output selected by another command.

## Syntax

```text
nl [OPTION]... [FILE]...
```

## Useful options

- `-b a`: number all body lines, including blank ones.
- `-b t`: number only nonempty body lines (GNU default).
- `-v N`: start numbering at N.
- `-i N`: increment by N.
- `-w N`: set the number field width.
- `-s STRING`: set the separator between the number and line.

## Examples

Number every line of the synthetic application log:

```bash
nl -ba playground/logs/app.log
```

Number authentication records with a compact field and separator:

```bash
nl -ba -w 2 -s ': ' playground/logs/auth.log
```

Start numbering at 10:

```bash
nl -v 10 playground/logs/app.log
```

Number only the final three application records from a pipeline:

```bash
tail -n 3 playground/logs/app.log | nl -ba
```

The pipeline numbers the selected output starting at 1; it does not preserve original log line numbers. Use `tail -n +N` or number the full file first if original positions matter.

## stdout and pipelines

`nl` reads a file or stdin and writes numbered text to stdout. The pipeline above sends `tail` output into `nl`. Redirection can save that output, but `>` replaces a file and `>>` appends; the tutorial does not redirect over a source log.

## Practical scenario

Number `auth.log` with `nl -ba` before discussing which synthetic entries report failed authentication, an accepted key, or a local command. This keeps references stable for the four-line fixture.

## Common mistakes

- The default does not number blank lines; use `-ba` when every line needs a number.
- `nl` has configurable numbering sections; plain text logs use the default body behavior.
- Numbering a pipeline result restarts at 1, which may not match source-file line numbers.
- `-s` changes the display separator, not the original file.

## Safety notes

`nl` reads and displays its input; it does not add numbers to the source file. Use it only on the synthetic playground fixtures for exercises.

## Exercises

### Guided practice

1. Number every line of `playground/logs/app.log`.
2. Number every authentication record with `-ba`.
3. Print the app log starting at number 10 with `-v 10`.

### Independent practice

Use `nl -ba -w 2 -s ': '` on `auth.log`. Identify the line containing the accepted public-key event.

### Combination challenge

Pipe `tail -n 3 playground/logs/app.log` to `nl -ba`, then compare those new numbers with the original positions in `nl -ba playground/logs/app.log`.

<details>
<summary>Show exercise answers</summary>

```bash
nl -ba playground/logs/app.log
nl -ba playground/logs/auth.log
nl -v 10 playground/logs/app.log
nl -ba -w 2 -s ': ' playground/logs/auth.log
tail -n 3 playground/logs/app.log | nl -ba
nl -ba playground/logs/app.log
```

</details>

## Reset

These examples are read-only and need no reset.

## Related commands

- [`cat` — Detailed](cat.detailed.md) can number lines with `-n` too.
- [`head` — Detailed](head.detailed.md) selects the start of a file.
- [`tail` — Detailed](tail.detailed.md) selects the end.
- [`less` — Detailed](less.detailed.md) provides an interactive pager.
- [`nl` — Revision](nl.revision.md)
