---
id: xargs
title: "xargs"
type: command
stage: 4
category: text-processing
mode: revision
difficulty: beginner
summary: "Build command arguments from standard input, preferably using NUL-delimited paths."
tags: [arguments, null delimiter, safe filenames]
related: [find, wc, grep]
---
# `xargs` — Revision

> Build command arguments from standard input, preferably using NUL-delimited paths.

**Syntax:** `COMMAND ... | xargs [OPTIONS] COMMAND [INITIAL-ARGS...]`

**Useful options:** -0 reads NUL-delimited items; -r skips execution for empty input (GNU); -n limits items per command; -I replaces a placeholder (implies one item per command); -t prints commands before running.

**Remember:** Whitespace-delimited input is unsafe for filenames that contain spaces, tabs, or newlines. Pair `find -print0` with `xargs -0`. Use `--` before path operands when the invoked command supports it. `xargs` runs the named program directly; it does not normally interpret shell operators such as `;` or `|` in input. Do not use `sh -c` for untrusted names.

## Examples

```bash
find playground/logs -type f -name '*.log' -print0 | xargs -0 -r wc -l --
```

Counts both synthetic logs; each path remains a single argument.

```bash
printf '%s\0' 'quarterly report.txt' 'launch-checklist.txt' | xargs -0 -r -I{} wc -l -- "playground/projects/organization-lab/inbox/{}"
```

Counts each named file, including a path with spaces.

```bash
printf '%s\0' 'a; touch BAD' | xargs -0 -r -I{} printf 'name: %s\n' '{}'
```

Prints literal text; the semicolon is not executed as shell syntax.

## Quick recall

1. Use find and NUL-safe xargs to count logs and list files under the disposable workspace, including a name with spaces.
2. Which input assumptions matter for this command?
3. How would you keep the operation read-only and confined to `playground/`?

## Pipeline reminder

Quote patterns, fields, and paths as needed. A pipe sends stdout to the next command's stdin; redirection writes to files. Check exit statuses, especially for grep no-match and diff differences.

[Read the Detailed guide](./xargs.detailed.md).
