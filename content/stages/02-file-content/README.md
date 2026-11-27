# Stage 02 — File Content Operations

Learn to inspect synthetic text and log files with `cat`, `more`, `less`, `head`, `tail`, and `nl`. Every command has a Detailed guide and a concise Revision guide.

**Quick reference:** [File Content Operations Cheat Sheet](../../cheatsheets/02-file-content.md).

| Command | Detailed | Revision |
|---|---|---|
| `cat` | [Read the tutorial](cat.detailed.md) | [Quick review](cat.revision.md) |
| `more` | [Read the tutorial](more.detailed.md) | [Quick review](more.revision.md) |
| `less` | [Read the tutorial](less.detailed.md) | [Quick review](less.revision.md) |
| `head` | [Read the tutorial](head.detailed.md) | [Quick review](head.revision.md) |
| `tail` | [Read the tutorial](tail.detailed.md) | [Quick review](tail.revision.md) |
| `nl` | [Read the tutorial](nl.detailed.md) | [Quick review](nl.revision.md) |

## Practice files

- `playground/logs/app.log`: five deterministic service events.
- `playground/logs/auth.log`: four synthetic authentication/local-command events, with no passwords or real user data.
- `playground/projects/atlas/config/app.conf`: a harmless configuration-like text fixture for read-only inspection.

Use `cat` for short files and `less` for longer files that need navigation or search. `head` and `tail` select an end; `nl` adds display-only line numbers. None of these examples modify source fixtures. Avoid reading real host authentication logs or configuration files.

## Pager and follow-mode testing

`more -f` and `less -F -X` allow the short fixture examples to run when stdout is captured without waiting for key presses. In an interactive pager, press `q` to quit. Use plain `tail -f` or `tail -F` in a terminal and stop with Ctrl+C. Automated follow examples use `timeout` so static fixtures cannot leave a process running indefinitely.

The cumulative exercise is [Log Inspection](../../challenges/log-inspection.md). The examples test can be run with:

```bash
python3 scripts/test_stage02_examples.py
```

All work is read-only. If a later exercise changes generated files, use the standard reset/setup workflow from the repository root.
