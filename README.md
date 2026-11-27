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
| 01 | [File System Operations](content/stages/01-file-system/README.md) | `ls`, `pwd`, `cd`, `mkdir`, `cp`, `mv`, `rm` |
| 02 | [File Content Operations](content/stages/02-file-content/README.md) | `cat`, `more`, `less`, `head`, `tail`, `nl` |
| 03 | [File Search](content/stages/03-file-search/README.md) | `which`, `whereis`, `find` |
| 04 | [Text Processing](content/stages/04-text-processing/README.md) | `grep`, `wc`, `cut`, `sort`, `uniq`, `tr`, `diff`, `join`, `xargs`, `awk` |
| 05 | [System Information](content/stages/05-system-information/README.md) | `top`, `free`, `df`, `du`, `time` |

The source course describes 31 guided labs and 10 challenges (41 activities), but the provided material does not enumerate or classify every activity. The discrepancy is documented in `docs/COURSE_MAPPING.md`; the authored final assessment does not claim to fill it.

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

The web app renders the Markdown in `content/` directly. With Node.js 20.9 or newer and npm installed:

```bash
git clone <repository-url>
cd linux-command-labs/apps/web
npm ci
npm run dev
```

Open the local URL printed by Next.js (normally `http://localhost:3000`). The site includes the six-section Final Assessment at `/assessment`. Knowledge answers are checked in the browser; practical tasks are explicitly self-assessed. The site does not run commands. Attempts resume and remain in browser localStorage. Use `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` to validate changes. Personal progress, bookmarks, notes, challenge scores, assessment attempts, and theme preference stay in browser localStorage; they are specific to that browser/device and may be lost if site data is cleared, so use My workspace to export a JSON backup. No account or server-side personal profile is used.

Personal progress must not be uploaded or committed by default.

## Development status

Milestones 0–6 establish the content schema, safe playground, and all five command stages. Milestone 7 delivers the web portal and browser-local personal workspace. Milestone 8 adds the final assessment and a release checklist; Linux QA, cheat-sheet scope, licensing, repository URL, accessibility review, and publish/deploy decisions remain open.

See:
- [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/CONTENT_GUIDELINES.md`](docs/CONTENT_GUIDELINES.md)
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
- [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md)
- [`CODEX_INSTRUCTIONS.md`](CODEX_INSTRUCTIONS.md)
