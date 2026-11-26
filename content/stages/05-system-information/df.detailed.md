---
id: df
title: "df"
type: command
stage: 5
category: system-information
mode: detailed
difficulty: beginner
summary: "Show capacity and free space for the filesystems that contain paths."
tags: [filesystem, capacity, storage]
related: [du, free]
---
# `df` — Detailed

## What it does

Show capacity and free space for the filesystems that contain paths.

## Why it matters

System tools answer different questions: a process snapshot, host memory summary, filesystem capacity, path usage estimate, or command duration. These observations help diagnose resource pressure, but live numbers depend on the host and moment you sample them.

## Syntax

```text
df [OPTIONS] [FILE...]
```

## Arguments and options

`-h` human-readable units; `-T` show filesystem type; `-i` report inode use; `-P` use portable one-line-per-filesystem format.

## Core concept

`df playground` reports the filesystem mounted where that path resides; it does not total the directory's files. Several paths on one mount usually show the same filesystem capacity. Filesystem type and mount details are system-dependent.

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

## Practical scenario

Check whether the filesystem hosting the playground has room before downloading or generating files. Compare this result with `du`: one is filesystem capacity, the other estimates paths.

## Common mistakes

Reading `df` as a per-directory size command. Assuming different mounts share capacity. Parsing rounded human-readable values as exact bytes. A path may be on a separate mount from the repository root.

## Safety notes

These examples inspect system state or read synthetic files. They do not change system configuration or delete data. Keep recursive `du` and other path inspections scoped to `playground/`; avoid expensive scans of the entire filesystem. Do not treat memory, process, filesystem-capacity, or timing values as fixture facts.

## Exercises

### Guided practice

1. Run the first example and identify which information is live and which comes from a fixed playground fixture.
2. Run a second example with a different display mode or scope.
3. Explain why its output can change across hosts or runs.

### Independent practice

Run `df -h playground` and `df -hT playground/data`. Explain whether the two paths share a filesystem and why the output can change.

### Combination challenge

Combine `df` with one related command to inspect a resource question. State what the command measures and what it does not measure.

<details>
<summary>Show exercise answers</summary>

```bash
df -h playground
df -hT playground
df -Pi playground
```

</details>

## Reset

These examples are read-only. No reset is required.

## Related commands

- [`du` — Detailed](./du.detailed.md)
- [`free` — Detailed](./free.detailed.md)
- [`df` — Revision](./df.revision.md)
