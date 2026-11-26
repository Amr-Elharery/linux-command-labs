---
id: cd
title: "cd"
type: command
stage: 1
category: file-system
mode: revision
difficulty: beginner
summary: "Change the current shell's working directory."
tags: [navigation, paths, shell-builtin]
related: [pwd, ls]
---

# `cd` — Revision

Change the current shell directory; it is a shell builtin.

**Syntax:** `cd [OPTION] [DIRECTORY]`

- `cd path` enter a path; `cd ..` parent; `cd -` previous directory; bare `cd` home.
- Quote paths containing spaces. `-L` follows logical path names; `-P` resolves symlinks physically.

## Examples

```bash
cd playground/projects/organization-lab && pwd
```

```bash
cd playground/projects/organization-lab/inbox && cd .. && pwd
```

```bash
cd playground/projects/organization-lab && cd inbox && cd - && pwd
```

```bash
cd "playground/projects/organization-lab/inbox"
```

## Recall

1. Why must `cd` be a shell builtin?
2. What does `cd -` do?
3. Can several `..` components leave the playground?

See [cd — Detailed](cd.detailed.md). Check your location with `pwd` after navigating.
