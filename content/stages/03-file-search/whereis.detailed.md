---
id: whereis
title: "whereis"
type: command
stage: 3
category: file-search
mode: detailed
difficulty: beginner
summary: "Locate a command's binary and related source or manual files in standard locations."
tags: [command-lookup, binaries, manuals]
related: [which, find]
---

# `whereis` — Detailed

## What it does

`whereis` reports locations associated with a command, typically its binary, source files, and manual pages. It checks standard system locations and optional search roots; it is not the same as searching your current directory tree.

## Why it matters

It can show that a command has a manual page or source location even when you are comparing several installations. Use `which` when you specifically want the executable found through PATH, and `find` when you want to search a chosen directory tree.

## Syntax

```text
whereis [OPTION]... NAME...
```

## Useful options

- `-b`: search for binaries only.
- `-m`: search for manual pages only.
- `-s`: search for source files only.
- `-B DIR... -f`: restrict binary lookup to directories you specify.
- `-M DIR... -f`: restrict manual-page lookup to directories you specify.

Available files depend on installed packages and distribution layout.

## Examples

Find standard locations associated with `grep`:

```bash
whereis grep
```

Show only binary locations:

```bash
whereis -b grep
```

Show the manual page location if installed:

```bash
whereis -m grep
```

Compare PATH resolution and broader location information:

```bash
which grep
whereis grep
```

## Practical scenario

Use `whereis -b grep` to inspect the standard binary location, then use `which grep` to see the executable selected by PATH. The outputs may overlap, but they answer different questions.

## Limitations and common mistakes

- `whereis` checks known standard locations; it does not recursively search the repository or every mounted filesystem.
- A manual page may exist even if no executable is on PATH, and a binary may exist without an installed manual page.
- Search results depend on the operating system's directory conventions and installed package files.
- Use `find` with a specific start path when you need an explicit tree search.
- Use `command -v`/`type -a` for shell aliases, functions, and builtins; `whereis` does not inspect the active shell's definitions.

## Safety notes

`whereis` is read-only. The examples look up installed command metadata but do not run the returned command or alter system directories.

## Exercises

### Guided practice

1. Run `whereis grep`.
2. Run `whereis -b grep` and `whereis -m grep` separately.
3. Compare `whereis -b find` with `which find`.

### Independent practice

Use `whereis -b -m bash` to summarize which binary and manual locations exist on your machine. Your exact paths may differ.

### Combination challenge

Use `whereis -b grep` to inspect system lookup results, then use `find playground -type f -iname '*.log'` to locate log fixtures. Explain why `whereis` does not replace `find`.

<details>
<summary>Show exercise answers</summary>

```bash
whereis grep
whereis -b grep
whereis -m grep
whereis -b find
which find
whereis -b -m bash
find playground -type f -iname '*.log'
```

</details>

## Reset

These commands are read-only; no reset is needed.

## Related commands

- [`which` — Detailed](which.detailed.md) checks PATH resolution.
- [`find` — Detailed](find.detailed.md) searches an explicit tree.
- [`whereis` — Revision](whereis.revision.md)
