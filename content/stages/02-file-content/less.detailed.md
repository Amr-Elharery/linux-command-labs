---
id: less
title: "less"
type: command
stage: 2
category: file-content
mode: detailed
difficulty: beginner
summary: "Page through text with forward, backward, and search navigation."
tags: [pager, search, logs, read]
related: [more, cat, head, tail, nl]
---

# `less` — Detailed

## What it does

`less` is an interactive pager for reading text without printing the entire file into the terminal history. It supports forward and backward movement and searching within a file.

## Why it matters

For a long log, `less` lets you inspect context without flooding the screen. You can jump to the end, search for a word, and return to earlier matches. Use `cat` for small files that are convenient to read all at once.

## Syntax

```text
less [OPTION]... [FILE]...
```

Common keys: Space or `f` moves forward; `b` moves backward; `/text` searches forward; `n` repeats a search; `g` goes to the start; `G` goes to the end; `q` quits.

## Useful options

- `-N`: show line numbers.
- `-S`: do not wrap long lines; use left/right arrows to see the rest.
- `-i`: ignore case when searching if the pattern contains no uppercase letters (GNU less behavior).
- `-F`: quit automatically when the file fits on one screen.
- `-X`: do not clear the terminal screen when leaving. Useful for demos and captured output.
- `+G`: open at the end of the file.

## Examples

Open the app log with line numbers; `-F -X` keeps this short fixture non-interactive in the automated check:

```bash
less -N -F -X playground/logs/app.log
```

Open the authentication log at its end:

```bash
less -F -X +G playground/logs/auth.log
```

Search is interactive: open the file, type `/Failed password`, press Enter, then `n` for the next match and `q` to quit. Do not run a test that waits for keyboard input without a bounded terminal session.

## Practical scenario

When investigating a real-sized synthetic log, use `less` to search for `ERROR`, examine nearby lines, and move backward for context. For the five-line fixture, use `head` and `tail` when you need only one end.

## Common mistakes

- A pager takes over the terminal until you press `q`.
- `less` is not a text editor; viewing a file does not save changes.
- Search patterns are literal/regular-expression searches depending on mode; quote shell arguments only when invoking `less` with a pattern option.
- `-F` exits immediately for a short file, so it can look as though the pager did not open. Remove `-F` for normal interactive viewing.
- `-S` hides the right side of long lines until you scroll horizontally; it does not delete content.

## Safety notes

`less` reads files. Inspect only the synthetic playground in exercises. Avoid posting private logs, secrets, or real system configuration into terminal captures or issue reports.

## Exercises

### Guided practice

1. Open `app.log` with `less -N` and locate the `ERROR` record by scrolling.
2. Open `auth.log`, go to the end with `G`, and return to the start with `g`.
3. Use `/Failed password` to find failed authentication records, then quit with `q`.

### Independent practice

Use `less` to compare the `WARN` records in `app.log` and write down the lines around them. Do not edit the log.

### Combination challenge

Use `tail -n 3` to identify the latest application events, then inspect the whole log with `less` to confirm their context.

<details>
<summary>Show exercise answers</summary>

```bash
less -N playground/logs/app.log
less playground/logs/auth.log
less -F -X +G playground/logs/auth.log
 tail -n 3 playground/logs/app.log
less -F -X playground/logs/app.log
```

In the interactive `less` sessions, press `q` to exit. The bounded `-F -X` examples are the forms used by the automated runner.
</details>

## Reset

These exercises only read files. Reset is not needed unless another exercise modifies the playground.

## Related commands

- [`more` — Detailed](more.detailed.md) offers simple forward paging.
- [`cat` — Detailed](cat.detailed.md) prints short text files.
- [`head` — Detailed](head.detailed.md) reads the beginning.
- [`tail` — Detailed](tail.detailed.md) reads the end and follows updates.
- [`less` — Revision](less.revision.md)
