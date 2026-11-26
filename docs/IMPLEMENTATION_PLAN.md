# Implementation Plan

Work in small, reviewable milestones. Do not build all phases in one pass.

## Milestone 0 — Repository and content foundation

Tasks:
- Inspect repository and existing files.
- Create agreed top-level directory structure.
- Add README, contributing guide, .gitignore, and project docs.
- Create `docs/COURSE_MAPPING.md` mapping all supplied topics and known activity titles.
- Decide and document canonical content format and frontmatter schema.
- Add one representative command page and one representative challenge as examples.
- Add a lightweight content metadata/link validator if justified.

Acceptance:
- Repository purpose and setup are clear.
- Every supplied command appears in the course map.
- Unknown activity mappings are explicitly marked.
- A sample content page can be read directly on GitHub.
- No Next.js app is generated yet unless the content contract is agreed.

## Milestone 1 — Safe Kali playground

Tasks:
- Add setup, reset, and environment verification scripts.
- Generate synthetic project files, logs, and CSV datasets.
- Add README with setup, reset, and safety instructions.
- Test scripts in a temporary clone or disposable test directory.

Acceptance:
- Scripts work from any current working directory.
- Scripts do not require sudo.
- All writes/deletes are confined to the expected playground.
- Reset restores known sample state without touching unrelated files.
- Fixtures are deterministic and contain no real secrets.

## Milestone 2 — Stage 01 content

Tasks:
- Create Detailed and Revision content for `ls`, `pwd`, `cd`, `mkdir`, `cp`, `mv`, `rm`.
- Add directory organization challenge.
- Verify all commands and expected outputs on Kali.
- Add cross-links and stage overview.

Acceptance:
- Both modes cover all seven commands.
- Exercises are executable and resettable.
- Safety guidance for `rm`, `cp`, and `mv` is present.
- Examples are tested or clearly labeled illustrative.

## Milestone 3 — Stages 02 and 03

Complete file content and file search commands, with log inspection and resource discovery challenges.

Acceptance:
- All commands have both modes.
- Search examples are scoped to playground.
- Large-file examples demonstrate `less` and `tail` appropriately.

## Milestone 4 — Stage 04 text processing

Complete all ten text-processing commands and practical log/employee data scenarios.

Acceptance:
- Explain pipelines, quoting, whitespace, sorting prerequisites for `uniq`, and `xargs` safety.
- Explain `awk` field processing and limitations of simple CSV parsing.
- Fixtures and expected outputs are deterministic.

## Milestone 5 — Stage 05 system information

Complete `top`, `free`, `df`, `du`, and `time`.

Acceptance:
- Explain host-level versus playground-level observations.
- Avoid brittle expected values for live system metrics.
- Use `du` on repository playground for deterministic exercises where possible.

## Milestone 6 — Web portal V1

Tasks:
- Scaffold Next.js App Router, TypeScript, Tailwind, and selected UI components.
- Build content loader and validate metadata.
- Add home, learning path, stage, command, challenge, and cheat-sheet views.
- Add Detailed/Revision switch.
- Add search and responsive light/dark themes.

Acceptance:
- Website renders repository content, not duplicated hardcoded lessons.
- Public content works without login.
- Keyboard navigation and semantic structure are reasonable.
- Build and lint/type checks pass.

## Milestone 7 — Personal workspace

Tasks:
- Add local progress, bookmarks, notes, recent activity, quiz results.
- Add export/import with schema validation.
- Add clear personal data control.

Acceptance:
- Data persists across reloads in the same browser.
- No personal data is transmitted to a backend.
- Invalid imports are rejected safely.
- UI explains browser/device-local behavior.

## Milestone 8 — Final assessment and release

Tasks:
- Build integrated assessment across all five stages.
- Run content, script, app, accessibility, and link checks.
- Finish documentation and deployment instructions.
- Publish repository and deploy static site.

Acceptance:
- All 41 source activities are accounted for or discrepancies documented.
- All 25 commands have both learning modes.
- Setup and reset instructions are verified.
- No credentials, personal logs, or local progress are committed.

## Scope control

Do not add a browser terminal, authentication, remote execution, backend, or database to V1. Revisit only with a separate proposal and security review.
