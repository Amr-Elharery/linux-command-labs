# Instructions for Codex

You are implementing **Linux Labs**, a GitHub-first Linux learning resource. Read the documents below before changing code:

1. `docs/PROJECT_SPEC.md`
2. `docs/ARCHITECTURE.md`
3. `docs/CONTENT_GUIDELINES.md`
4. `docs/IMPLEMENTATION_PLAN.md`

## Working rules

- Work milestone by milestone. Do not attempt to build the entire product in one pass.
- Before each milestone, summarize the intended files and acceptance criteria.
- Preserve the repository-first and content-first architecture.
- Keep learning content independent of the Next.js app.
- Do not add authentication, a backend, a database, analytics, or remote terminal execution to V1.
- Do not invent course coverage. Map every supplied course topic and record gaps/ambiguities.
- Use synthetic datasets only. Never include real credentials, personal logs, or private system data.
- All setup/reset scripts must be safe, scoped to this repository's `playground/`, and idempotent where practical.
- Never use `sudo` in setup, reset, or lab scripts.
- Avoid destructive commands outside a clearly marked disposable playground.
- Do not run arbitrary user-provided commands through a web server.
- Keep dependencies minimal and explain why each significant dependency is needed.
- Include tests or validation for meaningful functionality.
- Do not claim a command or script was tested unless it was actually run.
- Update documentation when architecture, commands, or workflows change.

## Required first task

Start with **Milestone 0: repository and content foundation** from `docs/IMPLEMENTATION_PLAN.md`.

Inspect the current repository first. If it is empty, scaffold the agreed directory structure and baseline docs. If files already exist, preserve and reconcile them rather than overwriting blindly.

Do not start the Next.js app until the content model, metadata schema, and repository conventions are agreed and documented.

## Definition of done for each milestone

- Acceptance criteria are met.
- Relevant tests/checks pass.
- No unrelated files are modified.
- README and implementation status are current.
- Provide a concise summary, files changed, commands run, test results, and remaining risks.
