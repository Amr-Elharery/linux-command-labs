# Stage 05 — System Information

Learn to inspect processes, memory, filesystem capacity, path usage, and command duration. Live values describe the current host and vary over time.

**Quick reference:** [System Information Cheat Sheet](../../cheatsheets/05-system-information.md).

## Commands

- [`top` Detailed](./top.detailed.md) · [Revision](./top.revision.md)
- [`free` Detailed](./free.detailed.md) · [Revision](./free.revision.md)
- [`df` Detailed](./df.detailed.md) · [Revision](./df.revision.md)
- [`du` Detailed](./du.detailed.md) · [Revision](./du.revision.md)
- [`time` Detailed](./time.detailed.md) · [Revision](./time.revision.md)

## Cumulative challenge

- [Disk Usage Detective](../../challenges/disk-usage-detective.md)

## Interpreting results

- `top` and `free` describe live processes and host memory.
- `df` reports capacity for the filesystem containing a path.
- `du` estimates usage attributed to directories and files; apparent byte counts can be deterministic for unchanged fixtures, while allocated blocks depend on the filesystem.
- `time` reports a measurement whose real, user, and system values vary between executions.

Automated examples use bounded batch mode for `top`; they check output shape rather than dynamic numeric readings. Exercises read the synthetic `playground/` files and do not modify them.
