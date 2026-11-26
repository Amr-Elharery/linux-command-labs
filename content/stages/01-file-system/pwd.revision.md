---
id: pwd
title: "pwd"
type: command
stage: 1
category: file-system
mode: revision
difficulty: beginner
summary: "Print the current working directory."
tags: [navigation, paths, directories]
related: [cd, ls]
---

# `pwd` — Revision

Print the current directory used to resolve relative paths.

**Syntax:** `pwd [-L|-P]`

- `-L` logical path; `-P` physical path with symlinks resolved.
- Absolute path begins `/`; relative path begins at the current directory. `.` is here; `..` is the parent.

## Examples

```bash
pwd
cd playground/projects/organization-lab && pwd
cd playground/projects/organization-lab/inbox && cd ../../../.. && pwd
pwd -P
```

## Recall

1. Which kind of path starts at `/`?
2. What does `..` mean?
3. Why check `pwd` before a relative delete?

See [pwd — Detailed](pwd.detailed.md).
