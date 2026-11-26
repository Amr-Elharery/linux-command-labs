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

Prerequisites: Kali Linux or Ubuntu 22.04, Bash, and the commands listed by the environment verifier. Clone this repository, then from any working directory run:

```bash
git clone <repository-url>
cd linux-command-labs
bash setup/verify-environment.sh
bash setup/setup.sh
```

The setup creates deterministic synthetic logs, CSV datasets, and project files under `playground/`. It preserves the existing `playground/logs/app.log` sample. No `sudo` or package installation is used. To remove only generated fixtures, run `bash setup/reset-lab.sh` and confirm, or pass `--yes` for a non-interactive reset. Reset preserves `app.log`, unknown files, and the playground directories. See [Playground setup and safety](docs/PLAYGROUND.md) for the full contract and test instructions.

## Web app

The web app is a presentation layer over `content/`. It should provide:
- public tutorials, learning paths, command search, and challenges;
- Detailed/Revision mode navigation;
- locally stored progress, bookmarks, notes, and quiz results;
- responsive design and first-class light/dark themes.

Personal progress must not be uploaded or committed by default.

## Development status

Milestones 0 and 1 establish the content schema, representative `grep` tutorial pair, `Log Triage` challenge, and safe local playground scripts. The remaining course pages and web application are planned milestones.

See:
- [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/CONTENT_GUIDELINES.md`](docs/CONTENT_GUIDELINES.md)
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
- [`CODEX_INSTRUCTIONS.md`](CODEX_INSTRUCTIONS.md)
