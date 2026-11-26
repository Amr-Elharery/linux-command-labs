---
id: grep
title: "grep"
type: command
stage: 4
category: text-processing
mode: detailed
difficulty: beginner
summary: "Search lines of text for a matching pattern."
tags: [search, logs, patterns]
related: [find, awk, wc]
---

# grep — Detailed

## What it does

`grep` reads text and prints lines that match a pattern. The name comes from an old editor command; for everyday use, think “filter these lines by a search expression.”

## Why it matters

Logs and reports can be much larger than a screen. `grep` narrows them to relevant lines while leaving the source file unchanged.

## Syntax

```bash
grep [OPTION]... PATTERN [FILE]...
```

If no file is given, `grep` reads standard input. Quote patterns so the shell does not interpret special characters first.

## Arguments and useful options

- `PATTERN`: a basic regular expression by default; use `-F` for literal text.
- `-i`: ignore letter case.
- `-n`: show line numbers.
- `-v`: select lines that do not match.
- `-r`: search directories recursively; scope the directory deliberately.
- `-E`: use extended regular expressions, including `|` and `+` without extra escaping.
- `-w`: match a whole word (GNU option; available on Kali and Ubuntu).

A successful match exits with status 0; no matching lines exits with status 1. This is useful in scripts and is not itself an error condition.

## Examples

The following output is illustrative and uses the fixture created below.

```bash
grep 'WARN' playground/logs/app.log
```

```text
2025-03-08T09:14:00Z WARN cache refresh delayed
2025-03-08T09:16:30Z WARN retry limit approaching
```

Ignore case and print line numbers:

```bash
grep -in 'warn' playground/logs/app.log
```

Match either warning or error using extended regular expressions:

```bash
grep -En 'WARN|ERROR' playground/logs/app.log
```

Count matching lines without printing them:

```bash
grep -c 'ERROR' playground/logs/app.log
```

Search literal punctuation with fixed-string mode:

```bash
grep -F 'user.name' playground/logs/app.log
```

## Practical scenario

From the repository root, inspect the synthetic application log in `playground/logs/app.log`. Use `grep -n` to locate `ERROR`, then `grep -v` to show the lines that are not errors. The file is a synthetic fixture and should be treated as read-only.

## Common mistakes

- **A dot matches more than a literal dot:** use `grep -F` or escape the dot in a regular expression.
- **No output:** check spelling, case, and path; try `-i` if case should not matter.
- **A pipeline stops after no matches:** `grep` returns status 1 when nothing matches. Handle that expected case when scripting.
- **CSV fields split incorrectly:** `grep` matches lines, not CSV fields. Quoted commas require a CSV-aware tool or parser.

## Safety notes

`grep` does not modify files unless combined with a separate redirection or command. Keep recursive searches inside `playground/` for exercises, and avoid searching private or sensitive logs. Do not redirect results over the source file.

## Exercises

### Guided

1. Run `grep -n 'ERROR' playground/logs/app.log`.
2. Use `grep -i 'warn'` to find warnings regardless of case.
3. Use `grep -c 'INFO'` to count informational lines.
4. Add `-v` to select non-error lines.

### Independent

Find lines mentioning either `timeout` or `refused`, case-insensitively. Print line numbers and explain why your chosen pattern uses `-E` or two separate commands.

## Related commands

- `find` locates files by properties (Stage 03).
- `awk` works with fields and structured text.
- `wc` counts lines, words, and bytes.
- [grep — Revision](grep.revision.md)
