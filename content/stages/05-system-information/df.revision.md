---
id: df
title: "df"
type: command
stage: 5
category: system-information
mode: revision
difficulty: beginner
summary: "Show capacity and free space for the filesystems that contain paths."
tags: [filesystem, capacity, storage]
related: [du, free]
---
# `df` — Revision

> Show capacity and free space for the filesystems that contain paths.

**Syntax:** `df [OPTIONS] [FILE...]`

**Useful options:** `-h` human-readable units; `-T` show filesystem type; `-i` report inode use; `-P` use portable one-line-per-filesystem format.

**Remember:** `df playground` reports the filesystem mounted where that path resides; it does not total the directory's files. Several paths on one mount usually show the same filesystem capacity. Filesystem type and mount details are system-dependent.

## Examples

```bash
df -h playground
```

Readable capacity/used/available values for the filesystem containing playground; values vary.

```bash
df -hT playground
```

Adds a filesystem-type column; device, type, and capacity depend on the machine.

```bash
df -Pi playground
```

Portable one-line format showing inode capacity and use.

## Quick recall

1. Run `df -h playground` and `df -hT playground/data`. Explain whether the two paths share a filesystem and why the output can change.
2. Which values here are fixed by a fixture, and which are live?
3. What does this command measure—and what does it not measure?

[Read the Detailed guide](./df.detailed.md).
