---
id: mkdir
title: "mkdir"
type: command
stage: 1
category: file-system
mode: revision
difficulty: beginner
summary: "Create directories."
tags: [directories, paths, organization]
related: [pwd, ls, cp, mv]
---

# `mkdir` — Revision

Create one or more directories.

**Syntax:** `mkdir [OPTION]... DIRECTORY...`

- `-p` creates missing parents and tolerates existing directories; `-v` prints each created path.
- `-m MODE` sets permissions at creation, e.g. `700` for owner-only access.

## Examples

```bash
mkdir -pv playground/projects/organization-lab/work/review
mkdir -m 700 playground/projects/organization-lab/work/private
mkdir playground/projects/organization-lab/work/drafts playground/projects/organization-lab/work/approved
ls playground/projects/organization-lab/work
```

## Recall

1. What does `-p` change?
2. What does mode `700` permit?
3. Does `mkdir` create files?

See [mkdir — Detailed](mkdir.detailed.md). Reset the disposable workspace with the standard setup/reset workflow.
