# Linux Labs — Linux Command Practice Labs

A practical, GitHub-first learning resource for Linux command-line skills, designed to run locally on Kali Linux and remain compatible with Ubuntu 22.04 where practical.

## Product principles

- **Repository first:** all learning content remains readable without running the website.
- **One source of truth:** Markdown/MDX content powers both the repository and web interface.
- **Two learning modes:** Detailed and Revision cover the same topics at different depths.
- **Safe practice:** exercises operate on synthetic data inside the repository's playground.
- **Hybrid experience:** public learning content; personal progress stays in the user's browser by default.
- **No unnecessary backend:** V1 requires no account system, database, or remote command execution.

## Learning path

| Stage | Topic | Commands |
|---|---|---|
| 01 | File System Operations | `ls`, `pwd`, `cd`, `mkdir`, `cp`, `mv`, `rm` |
| 02 | File Content Operations | `cat`, `more`, `less`, `head`, `tail`, `nl` |
| 03 | File Search | `which`, `whereis`, `find` |
| 04 | Text Processing | `grep`, `wc`, `cut`, `sort`, `uniq`, `tr`, `diff`, `join`, `xargs`, `awk` |
| 05 | System Information | `top`, `free`, `df`, `du`, `time` |

The supplied course describes 31 guided labs and 10 challenges (41 activities). Preserve this coverage when mapping source topics, and record any ambiguity in `docs/COURSE_MAPPING.md`.

## Repository layout

```text
apps/web/                 Next.js learning portal
content/stages/            Canonical learning content
content/challenges/        Cross-command challenges
content/cheatsheets/       Concise command references
content/assessments/       Stage and final assessments
playground/                Synthetic practice files only
setup/                     Safe setup/reset/verification scripts
scripts/                   Content and quality checks
docs/                      Product and technical documentation
progress/                  Progress template; no personal data committed
```

## Local practice setup

The setup scripts are planned for a later milestone. Do not run unreviewed scripts with elevated privileges. The playground must remain self-contained and must never target system directories.

## Web app

The web app is a presentation layer over `content/`. It should provide:
- public tutorials, learning paths, command search, and challenges;
- Detailed/Revision mode navigation;
- locally stored progress, bookmarks, notes, and quiz results;
- responsive design and first-class light/dark themes.

Personal progress must not be uploaded or committed by default.

## Development status

This starter repository contains product and implementation specifications. It is not yet the completed course or web application.

See:
- [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/CONTENT_GUIDELINES.md`](docs/CONTENT_GUIDELINES.md)
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
- [`CODEX_INSTRUCTIONS.md`](CODEX_INSTRUCTIONS.md)
