---
id: cat
title: "cat"
type: command
stage: 2
category: file-content
mode: detailed
difficulty: beginner
summary: "Read and concatenate file contents to standard output."
tags: [read, stdout, pipeline, files]
related: [less, head, tail, nl]
---

# `cat` — Detailed

## What it does

`cat` reads one or more files and writes their contents to standard output (stdout). Standard output is the normal stream where a command displays results; the terminal is one possible destination. With multiple files, `cat` writes them one after another.

## Why it matters

It is quick for short files and useful when another command should receive the file through a pipe. It is usually a poor choice for a large log because it floods the terminal, pushes earlier content off screen, and offers no convenient page navigation.

## Syntax

```text
cat [OPTION]... [FILE]...
```

With no file, `cat` reads standard input. That can wait for keyboard input until end-of-file (Ctrl+D in a terminal).

## Useful options

- `-n`: number every output line.
- `-b`: number only nonblank lines.
- `-s`: squeeze repeated blank lines.
- `--`: stop option parsing, useful for a filename beginning with `-`.

## Examples

Display the five-line synthetic application log:

```bash
cat playground/logs/app.log
```

The output is the fixture's five records, from `INFO service started` through `WARN retry limit approaching`.

Number each application log line:

```bash
cat -n playground/logs/app.log
```

Read the synthetic configuration-like sample without changing it:

```bash
cat playground/projects/atlas/config/app.conf
```

This is a repository fixture, not a real system configuration file.

Pass file contents to another command through stdout and a pipe:

```bash
cat playground/logs/auth.log | tail -n 2
```

The last two authentication records are printed. For a one-command task, `tail -n 2 FILE` is shorter; the pipeline illustrates that stdout from `cat` becomes stdin for `tail`.

## stdout, redirection, and pipelines

By default, `cat` writes to stdout and leaves the source alone. `command > file` redirects stdout and **replaces** the destination; `command >> file` appends. Neither form is needed to read these fixtures, so do not redirect output over a source log. A pipe (`|`) sends one command's stdout directly to another command's stdin. Error messages normally go to stderr, a separate stream.

## cat or less?

Use `cat` when the file is short and you want all of it at once, such as `app.conf`. Use `less` when you need to move through a longer log, search within it, or revisit earlier lines. Printing a large file with `cat` creates a long stream that is hard to navigate and may make useful terminal history difficult to find.

## Practical scenario

Read `playground/logs/app.log` once with `cat`, then inspect only the last two authentication events with the pipeline above. Both files are synthetic and read-only for this exercise.

## Common mistakes

- `cat directory` fails because a directory is not a regular text file.
- `cat` with no filename reads stdin and may appear to hang; press Ctrl+D to end terminal input.
- `cat file > file` truncates the file before `cat` reads it. Never redirect a file onto itself.
- When a path contains spaces, quote it as one argument.
- `cat` concatenates bytes; it does not understand CSV columns or decode every binary format.

## Safety notes

Reading with `cat` does not modify a file. Keep examples scoped to `playground/`; do not dump private logs, secrets, or real system configuration into a public terminal transcript. Avoid `>` and `>>` until the destination has been checked carefully.

## Exercises

### Guided practice

1. Display `playground/logs/app.log` with `cat`.
2. Number `playground/logs/auth.log` with `cat -n`.
3. Read `playground/projects/atlas/config/app.conf` without editing it.

### Independent practice

Display only the final two authentication records with a `cat` to `tail` pipeline. Explain where stdout goes.

### Combination challenge

Use `cat` to read the authentication log, then pass it to `nl` so the records can be referenced by line number.

<details>
<summary>Show exercise answers</summary>

```bash
cat playground/logs/app.log
cat -n playground/logs/auth.log
cat playground/projects/atlas/config/app.conf
cat playground/logs/auth.log | tail -n 2
cat playground/logs/auth.log | nl -ba
```

</details>

## Reset

These examples only read files. If another exercise changes the playground, restore it with `bash setup/reset-lab.sh --yes && bash setup/setup.sh` from the repository root.

## Related commands

- [`less` — Detailed](less.detailed.md) pages and searches through longer files.
- [`head` — Detailed](head.detailed.md) prints the beginning of a file.
- [`tail` — Detailed](tail.detailed.md) prints the end or follows log updates.
- [`nl` — Detailed](nl.detailed.md) numbers lines.
- [`cat` — Revision](cat.revision.md)
