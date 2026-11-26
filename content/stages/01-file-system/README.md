# Stage 01 — File System Operations

Learn to inspect and organize directories with `ls`, `pwd`, `cd`, `mkdir`, `cp`, `mv`, and `rm`. Each command has a Detailed guide and a concise Revision guide.

| Command | Detailed | Revision |
|---|---|---|
| `ls` | [Read the tutorial](ls.detailed.md) | [Quick review](ls.revision.md) |
| `pwd` | [Read the tutorial](pwd.detailed.md) | [Quick review](pwd.revision.md) |
| `cd` | [Read the tutorial](cd.detailed.md) | [Quick review](cd.revision.md) |
| `mkdir` | [Read the tutorial](mkdir.detailed.md) | [Quick review](mkdir.revision.md) |
| `cp` | [Read the tutorial](cp.detailed.md) | [Quick review](cp.revision.md) |
| `mv` | [Read the tutorial](mv.detailed.md) | [Quick review](mv.revision.md) |
| `rm` | [Read the tutorial](rm.detailed.md) | [Quick review](rm.revision.md) |

## Practice workspace

All Stage 01 mutating examples use the dedicated synthetic workspace `playground/projects/organization-lab/`. It contains a report filename with a space and a hidden note. Treat `inbox/` and `reference/` as source material. Put practice output under `work/`.

Reset the workspace and all generated fixtures from the repository root:

```bash
bash setup/reset-lab.sh --yes && bash setup/setup.sh
```

Setup recreates the marked workspace. Reset deliberately removes everything inside that named disposable workspace; do not store personal files there. The cumulative exercise is [Directory Organization](../../challenges/directory-organization.md).

## Path reminders

- Absolute paths start with `/`; relative paths start from the current directory shown by `pwd`.
- `.` means the current directory; `..` means its parent. Repeated `..` can leave the playground.
- A filename beginning with `.` is hidden from ordinary `ls`; `ls -A` shows hidden names.
- Quote any path containing spaces, such as `"inbox/quarterly report.txt"`.
