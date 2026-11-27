---
id: tail
title: "tail"
type: command
stage: 2
category: file-content
mode: detailed
difficulty: beginner
summary: "Print the end of a file and optionally follow new log output."
tags: [logs, follow, stdout]
related: [head, less, nl, cat]
---

# `tail` — Detailed

## What it does

`tail` prints the last part of a file or stream. It can also keep watching a file as new lines arrive, which is useful for monitoring a changing application log.

## Why it matters

The newest events often appear at the end of a log. `tail -f` lets you watch new records without repeatedly reopening the file.

## Syntax

```text
tail [OPTION]... [FILE]...
```

## Useful options

- `-n N` / `--lines=N`: print the last N lines.
- `-n +N`: start at line N and print through the end.
- `-c N`: print the last N bytes.
- `-f` / `--follow=descriptor`: follow the opened file as it grows; GNU `tail` uses descriptor-following by default.
- `-F`: follow by filename and retry if it is replaced or temporarily missing; in GNU coreutils this is `--follow=name --retry`.
- `-s N`: wait N seconds between follow checks (GNU).
- `-q`: omit headings when multiple files are read.

## Examples

Show the last two application events:

```bash
tail -n 2 playground/logs/app.log
```

Expected output:

```text
2025-03-08T09:15:15Z ERROR request timed out
2025-03-08T09:16:30Z WARN retry limit approaching
```

Print from line 4 through the end:

```bash
tail -n +4 playground/logs/app.log
```

For an interactive live monitor, run `tail -f playground/logs/app.log` and stop with Ctrl+C. `-f` follows the open file descriptor, so after a log is renamed during rotation it can remain attached to the old file. `tail -F playground/logs/app.log` follows the name and retries after replacement, which is often preferable for a rotated log.

These examples bound follow time for automation. GNU `timeout` interrupts each follower after a fraction of a second; status 124 is expected when the time limit is reached.

```bash
timeout --signal=INT 0.2s tail -n 2 -f playground/logs/app.log
```

```bash
timeout --signal=INT 0.2s tail -n 2 -F playground/logs/auth.log
```

Both print the current last two lines, then stop. The committed fixtures do not grow, so these checks verify startup output without hanging.

## stdout and pipelines

`tail` writes selected lines to stdout. For example, `tail -n 3 FILE | nl -ba` numbers the selected lines. The pipe connects output to input; it does not save a new file. Redirecting with `>` replaces a destination and `>>` appends, so inspect destinations before using either.

## Practical scenario

To monitor a local application while it runs, use `tail -f` on a synthetic log in the playground. If the logging service rotates the file, `-F` is usually a better choice because it follows the filename and retries. Do not substitute a private `/var/log` path in beginner exercises.

## Common mistakes

- `tail file` prints up to ten final lines, which is the whole file for these short fixtures.
- `-f` is intended for an active process; on a static fixture it waits until interrupted.
- `-f` and `-F` differ after rename/replacement. `-f` follows the old descriptor; GNU `-F` reopens by name and retries.
- `timeout` is a test bound, not a replacement for Ctrl+C during ordinary interactive monitoring.

## Safety notes

Following is read-only but can run indefinitely and stream new data. Keep the path specific and synthetic. Never tail real authentication logs or expose private records. Do not redirect output over the file being followed.

## Exercises

### Guided practice

1. Print the last two lines of `app.log`.
2. Print `auth.log` from line 3 to the end with `tail -n +3`.
3. Run the bounded `tail -f` example and note its final two records.

### Independent practice

Run the bounded `tail -F` form against `auth.log`. Explain why a service that renames log files may benefit from `-F`.

### Combination challenge

Pipe the final three app log records through `nl -ba`. Then use `head` to inspect the opening two records.

<details>
<summary>Show exercise answers</summary>

```bash
tail -n 2 playground/logs/app.log
tail -n +3 playground/logs/auth.log
```

```bash
timeout --signal=INT 0.2s tail -n 2 -f playground/logs/app.log
```

```bash
timeout --signal=INT 0.2s tail -n 2 -F playground/logs/auth.log
```

```bash
tail -n 3 playground/logs/app.log | nl -ba
head -n 2 playground/logs/app.log
```

The timeout commands intentionally end with status 124 after printing their initial output. In an interactive terminal, use plain `tail -f` or `tail -F` and stop with Ctrl+C.
</details>

## Reset

These examples do not alter fixtures. If another exercise changes files, restore them with the playground reset and setup scripts.

## Related commands

- [`head` — Detailed](head.detailed.md) reads the beginning.
- [`less` — Detailed](less.detailed.md) searches and navigates the full log.
- [`nl` — Detailed](nl.detailed.md) numbers selected records.
- [`tail` — Revision](tail.revision.md)
