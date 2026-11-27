---
id: more
title: "more"
type: command
stage: 2
category: file-content
mode: detailed
difficulty: beginner
summary: "View text one screen at a time with a simple pager."
tags: [pager, logs, read]
related: [less, cat, head, tail]
---

# `more` — Detailed

## What it does

`more` is a pager: it presents text a screen at a time instead of sending the entire file past the terminal at once. It is a simple way to read a long log without changing it.

## Why it matters

A terminal may show only the last part of a large `cat` output. A pager lets you advance deliberately, so earlier context remains accessible. `less` generally offers more navigation and search controls; `more` is useful when you want a straightforward forward reading flow.

## Syntax

```text
more [OPTION]... [FILE]...
```

Interactive keys commonly include Space for the next screen, Enter for one more line, and `q` to quit. Key behavior can vary slightly across pager implementations.

## Useful options

- `-d`: show help text for pager keys and prompt more helpfully.
- `-f`: count logical lines rather than screen lines (helpful for long wrapped lines).
- `-s`: squeeze repeated blank lines.
- `+NUMBER`: start at that line number (GNU `more`).

## Examples

Page the synthetic authentication log:

```bash
more -f playground/logs/auth.log
```

In an interactive terminal, press Space to advance and `q` to leave. When stdout is redirected, `more` writes the text and exits without waiting for a key; this is how the automated example check runs it.

Start near line 3 of the application log:

```bash
more +3 playground/logs/app.log
```

Show help-aware prompts while reading the app log:

```bash
more -d playground/logs/app.log
```

## Practical scenario

Use `more` when a synthetic log is longer than one screen and you mainly want to page forward. For the current five-record `app.log`, `head` or `tail` is faster when you already know which end you need.

## Common mistakes

- `more` is interactive when attached to a terminal; press `q` to quit rather than closing the terminal.
- With a short file, the full text may fit on one screen, so the pager closes quickly or never shows a useful prompt.
- `more` pages text; it does not search structured fields or filter matching records.
- A pipeline can supply input, for example `cat FILE | more`, but `more FILE` avoids an unnecessary `cat` process.

## Safety notes

`more` only reads. Use it with synthetic files under `playground/`, not private logs or sensitive system configuration. Do not confuse paging output with editing a file.

## Exercises

### Guided practice

1. Run `more -f playground/logs/auth.log` and exit with `q` if the terminal pauses.
2. Start `playground/logs/app.log` at line 3 with `more +3`.
3. Compare the navigation experience with `less`.

### Independent practice

Page through `auth.log` and record the line that reports an accepted public key. Use `nl` afterward if you want a stable line reference.

### Combination challenge

Use `head` to read the first application event, then page through the authentication log with `more` and identify the final event.

<details>
<summary>Show exercise answers</summary>

```bash
more -f playground/logs/auth.log
more +3 playground/logs/app.log
less -F -X playground/logs/app.log
head -n 1 playground/logs/app.log
more -f playground/logs/auth.log
```

The accepted public-key event is on line 2; the final authentication record is the synthetic `sudo` event.
</details>

## Reset

These exercises are read-only. If another exercise changes playground files, run the standard reset and setup workflow from the repository root.

## Related commands

- [`less` — Detailed](less.detailed.md) provides more navigation and search controls.
- [`cat` — Detailed](cat.detailed.md) prints short files directly.
- [`head` — Detailed](head.detailed.md) selects the beginning of a file.
- [`tail` — Detailed](tail.detailed.md) selects the end of a file.
- [`more` — Revision](more.revision.md)
