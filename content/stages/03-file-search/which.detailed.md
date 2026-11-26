---
id: which
title: "which"
type: command
stage: 3
category: file-search
mode: detailed
difficulty: beginner
summary: "Show which executable a command name resolves to through PATH."
tags: [path, executable, command-lookup]
related: [whereis, find]
---

# `which` — Detailed

## What it does

`which` searches the directories listed in `PATH` and prints the executable path it finds for a command name. `PATH` is an ordered, colon-separated list of directories; the first matching executable is normally the one a shell starts.

## Why it matters

When a command appears to behave differently, checking its resolved path can reveal which installed executable is being selected. `which` looks up command names; it does not search arbitrary files by content or filename.

## Syntax

```text
which [OPTION]... COMMAND...
```

## Useful options

- `-a`: print all matching executable paths in `PATH` (supported by common GNU/Linux `which` implementations).
- `--`: end option parsing before command names.

## Examples

Show the executable selected for `grep`:

```bash
which grep
```

Expected output is one executable path, commonly `/usr/bin/grep` (the exact path can vary by distribution).

List all PATH matches:

```bash
which -a grep
```

Inspect the PATH order and compare it with shell lookup:

```bash
printf '%s\n' "$PATH"
command -v grep
```

`command -v` is a shell builtin and can report aliases, functions, builtins, or executable paths depending on the name. In contrast, `which` is intended to report external executables.

Look up another common tool:

```bash
which find
```

## Practical scenario

Before using a tool in a lab, run `which grep` or `which find` to see which executable is available through PATH. The command lookup itself does not change files.

## Limitations and common mistakes

- `which` only searches PATH directories; it does not search `playground/` for a file by name.
- Different `which` implementations handle aliases, shell functions, and options differently. Use `type -a NAME` or `command -v NAME` in Bash when you need shell-aware lookup.
- If no match is found, output may be empty and the command returns nonzero. Check that the package is installed and PATH includes its directory; do not assume it is under `/bin`.
- PATH order matters: an earlier directory may contain a different executable with the same name.
- A path printed by `which` says where the command is found, not whether it is safe to run.

## Safety notes

`which` is read-only. Do not modify PATH to include untrusted or writable directories just to make a command resolve; an attacker could place a look-alike executable earlier in PATH.

## Exercises

### Guided practice

1. Run `which grep` and `which find`.
2. Run `which -a grep` and compare the results with the order of PATH directories.
3. Run `command -v cd` and `which cd`; explain why a shell builtin may not have an external executable path.

### Independent practice

Look up `bash`, `head`, and `tail`. Which paths repeat across the results, if any?

### Combination challenge

Use `which find` to check command availability, then use `find playground -type f -name 'app.log'` to locate the synthetic log. Explain why these commands search different things.

<details>
<summary>Show exercise answers</summary>

```bash
which grep
which find
which -a grep
command -v cd
which cd || true
which bash head tail
find playground -type f -name 'app.log'
```

`which` looks along PATH for executable command names. `find` searches entries underneath its explicit starting directory. `cd` is a shell builtin, so `command -v` can identify it while `which` may print nothing.
</details>

## Reset

These commands are read-only; no reset is needed.

## Related commands

- [`whereis` — Detailed](whereis.detailed.md) checks standard binary, source, and manual locations.
- [`find` — Detailed](find.detailed.md) searches an explicit directory tree.
- [`which` — Revision](which.revision.md)
