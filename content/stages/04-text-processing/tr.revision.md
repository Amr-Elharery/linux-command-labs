---
id: tr
title: "tr"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Translate, delete, or squeeze individual characters in standard input."
tags: [translate, characters, stdin]
related: [cut, awk, grep]
---
# `tr` — Revision

> Translate, delete, or squeeze individual characters in standard input.

**Syntax:** `tr [OPTION]... SET1 [SET2]`

**Useful options:** -d deletes characters in SET1; -s squeezes repeated characters; -c complements SET1; character classes include `[:lower:]` and `[:upper:]`.

**Remember:** `tr` reads from standard input and writes transformed text to standard output. It is character-oriented, not field-aware: replacing commas across a CSV may also affect commas inside quoted text. Use `printf` for predictable test strings and pipes to feed files.

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

## Quick recall

1. Uppercase status values, squeeze repeated spaces in a label, and convert one synthetic transaction row to tab-separated display.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./tr.detailed.md).
