---
id: 02-file-content
title: "File Content Operations Cheat Sheet"
type: cheatsheet
stage: 2
summary: "Read, page through, sample, follow, and number text files."
commands: [cat, more, less, head, tail, nl]
---

# File Content Operations Cheat Sheet

## Commands covered

| Command | Purpose |
| --- | --- |
| `cat` | Write file contents to standard output; concatenate inputs. |
| `more` | Page through text one screen at a time. |
| `less` | Page forward/backward and search without dumping a whole file. |
| `head` | Show the start of a file or stream. |
| `tail` | Show the end of a file or follow changing log output. |
| `nl` | Display text with line numbers. |

## Purpose

Use these read-only tools to inspect the synthetic logs in `playground/logs/`. `cat` is handy for short files and pipelines; use `less` for larger files so terminal output stays navigable.

## Essential syntax

```text
cat [OPTIONS] [FILE...]
more [OPTIONS] FILE...
less [OPTIONS] FILE...
head [-n N] [FILE...]
tail [-n N] [FILE...]
nl [OPTIONS] [FILE...]
```

By default, `cat`, `head`, `tail`, and `nl` write to stdout. A pipe `|` sends that output to another command; `>` replaces a file and `>>` appends, so avoid redirecting over source fixtures.

## High-value options

- `cat -n` numbers all output lines; `-b` numbers nonblank lines.
- `more -s` squeezes repeated blank lines; press `q` to leave the pager.
- `less -N` shows line numbers; `/pattern` searches and `q` exits.
- `head -n N` prints the first N lines; `-c N` prints bytes.
- `tail -n N` prints the last N lines; `-n +N` starts at line N.
- GNU `tail -f` follows the opened file; `tail -F` follows by name and retries after file replacement. Both can wait indefinitely; use Ctrl+C to stop.
- `nl -ba` numbers blank as well as nonblank lines; plain `nl` numbers nonblank lines by default.

## Short examples

Run from the repository root:

```bash
head -n 3 playground/logs/app.log
tail -n 4 playground/logs/auth.log
nl -ba playground/logs/app.log | head -n 5
grep 'ERROR' playground/logs/app.log | head -n 3
```

Interactive reading and monitoring examples (press `q` for a pager; Ctrl+C to stop following):

```bash
less -N playground/logs/app.log
more playground/logs/auth.log
tail -F playground/logs/app.log
```

## Useful combinations

- `head -n 20 FILE | less`: page through a bounded preview.
- `tail -n 50 playground/logs/app.log | nl -ba`: number a recent excerpt.
- `grep -n 'failed' playground/logs/auth.log | less`: page through matching lines with source line numbers.
- `tail -f LOG | grep --line-buffered 'ERROR'` can filter a live stream; it requires GNU grep and an active writer.

## Common mistakes and safety

- `cat` prints every byte and is inconvenient for large logs; use `less`, `head`, or `tail` to keep output bounded.
- `cat` with no file reads stdin and waits for input. `cat file > file` truncates its input before reading; do not do this.
- `more`, `less`, and `tail -f` are interactive or unbounded; do not run them in automated checks without a bound.
- `tail -f` follows the old opened file after rename; GNU `tail -F` reopens by name and retries.
- Reading configuration-like examples is safe; these commands do not edit them. Do not redirect output onto system configuration or original fixtures.

## Learn more

| Command | Detailed | Revision |
| --- | --- | --- |
| `cat` | [Guide](../stages/02-file-content/cat.detailed.md) | [Review](../stages/02-file-content/cat.revision.md) |
| `more` | [Guide](../stages/02-file-content/more.detailed.md) | [Review](../stages/02-file-content/more.revision.md) |
| `less` | [Guide](../stages/02-file-content/less.detailed.md) | [Review](../stages/02-file-content/less.revision.md) |
| `head` | [Guide](../stages/02-file-content/head.detailed.md) | [Review](../stages/02-file-content/head.revision.md) |
| `tail` | [Guide](../stages/02-file-content/tail.detailed.md) | [Review](../stages/02-file-content/tail.revision.md) |
| `nl` | [Guide](../stages/02-file-content/nl.detailed.md) | [Review](../stages/02-file-content/nl.revision.md) |
