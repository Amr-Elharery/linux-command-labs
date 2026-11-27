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

Status: approved. Setup/reset passed 13 checks in the disposable-copy suite on Ubuntu 26.04 WSL2, including idempotency, path/symlink handling, and challenge-workspace restoration. See `docs/PLAYGROUND.md` for the safety contract.

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

Status: Detailed and Revision pages for all seven commands, the stage README, and the cumulative `directory-organization` challenge are authored. All 50 fenced Bash blocks passed in isolated playground copies on Ubuntu 26.04 WSL2. The reset workflow restores the dedicated marked practice workspace. See `scripts/test_stage01_examples.py` for the executable-example check.

## Milestone 3 — File Content Operations (Stage 02)

Tasks:
- Create Detailed and Revision content for `cat`, `more`, `less`, `head`, `tail`, and `nl`.
- Add the cumulative log inspection challenge.
- Use the synthetic application and authentication logs.
- Verify examples with bounded pager/follow tests.

Acceptance:
- All six commands have both modes.
- `cat` versus pagers, stdout/pipelines, and safe configuration-like file reading are explained.
- `tail -f` and `tail -F` are distinguished accurately.
- Pager and follow examples do not hang automated checks.

Status: Complete. All 40 fenced Bash blocks and deterministic fixture-output checks passed on Ubuntu 26.04 WSL2. See `scripts/test_stage02_examples.py`.

## Milestone 4 — File Search (Stage 03)

Tasks:
- Create Detailed and Revision content for `which`, `whereis`, and `find`.
- Add the cumulative critical resource discovery challenge.
- Demonstrate `find` predicates, logical grouping, safe actions, and permission handling within `playground/`.
- Verify name/type/size/time results and command lookup behavior.

Acceptance:
- All three commands have both modes and their limits are distinguished.
- Examples explain PATH, absolute/relative search roots, spaces, and find depth.
- `-exec` and NUL-delimited `xargs -0` examples are read-only.
- Modification-time examples use controlled fixture timestamps.
- Tests leave the source playground unchanged.

Status: Complete. All Stage 03 example blocks, deterministic name/type/size/time checks, PATH/whereis checks, and source-playground integrity checks passed on Ubuntu 26.04 WSL2. See `scripts/test_stage03_examples.py`.

## Milestone 5 — Stage 04 text processing

Tasks:
- Create Detailed and Revision guides for all ten text-processing commands.
- Add cumulative log-search, word-count/sorting, employee-data, and integrated-pipeline challenges.
- Explain pipelines, standard input/output, quoting, redirection, field extraction, sort/join assumptions, exit statuses, NUL-safe paths, and CSV limitations.
- Test examples and deterministic calculations against isolated playground copies.

Acceptance:
- All ten commands have both modes and synthetic fixture examples.
- Pipeline concepts, sort/join prerequisites, safe `xargs`, awk calculations, and CSV limitations are covered.
- Tests leave the source playground unchanged and assert deterministic output.

Status: Complete. The text-processing runner passed all 76 Bash blocks plus deterministic grep/wc/cut/sort/uniq/awk/join, sorted-join, NUL-safe xargs, and source-playground integrity checks. The content validator and playground, Stage 01, Stage 02, and Stage 03 suites also passed in Ubuntu WSL. See `scripts/test_stage05_examples.py`.

## Milestone 6 — Stage 05 system information

Tasks:
- Create Detailed and Revision guides for `top`, `free`, `df`, `du`, and `time`.
- Add the cumulative Disk Usage Detective challenge.
- Test examples in isolated fixture copies without fixed assertions for dynamic metrics or timing.
- Compare `du` apparent bytes with stable synthetic fixture sizes.

Acceptance:
- Explain host-level versus playground-level observations.
- Avoid brittle expected values for live system metrics.
- Use `du` on repository playground for deterministic exercises where possible.
- Bound non-interactive `top` and verify time output format without asserting measurements.

Status: Complete. All 36 system-information Bash examples passed in Ubuntu WSL. Structural checks passed for batch `top`, `free`, and `df`; deterministic `du` byte/sort checks and the timing-format check passed without fixed metric or duration assertions. The source playground remained unchanged. See `scripts/test_stage06_examples.py`.

## Milestone 7 — Web portal & personal workspace

Tasks:
- Scaffold Next.js App Router, TypeScript, Tailwind, and selected UI components.
- Build content loader and validate metadata.
- Add home, learning path, stage, command, challenge, and workspace views.
- Add Detailed/Revision switch.
- Add search and responsive light/dark themes.
- Add versioned browser-local progress, bookmarks, notes, recent activity, and challenge results.
- Add validated JSON import/export, recovery/migration handling, and confirmed reset.

Acceptance:
- Website renders repository content, not duplicated hardcoded lessons.
- Public content works without login.
- Personal data survives reloads in the same browser and is never sent to a backend.
- Invalid imports are rejected; users can back up and clear browser-local data.
- Keyboard navigation and semantic structure are reasonable.
- Build and lint/type checks pass.

Status: Implemented. The portal discovers the five stage READMEs, all 31 Detailed/Revision pairs, and nine challenge files directly from the repository. Workspace state is browser-local with validation, migration, export/import, recovery, and confirmed reset. Unit tests, lint, and typecheck passed. One production build completed and prerendered all routes; a subsequent retry hit a Windows sandbox `EPERM` while writing generated route files. The Linux content validator and WSL suites could not run because this host has no accessible Linux shell.

## Milestone 8 — Final assessment and release

Tasks:
- Build a structured, scored assessment across all five stages with an integrated practical scenario.
- Persist/resume attempts and history without losing existing browser-local progress.
- Run content, script, app, accessibility, and link checks; document environment-blocked checks.
- Finish release checklist, attribution, license, repository URL, and deployment decisions.
- Do not publish or deploy without explicit approval.

Acceptance:
- All known source activity discrepancies are documented; no missing activity is invented.
- All 31 commands have both learning modes.
- Setup and reset instructions are verified.
- No credentials, personal logs, or local progress are committed.

Status: Assessment and release preparation implemented; Milestone 8 validation is incomplete. Release remains pending: run Linux validator/regressions on an accessible Linux host, perform browser accessibility/responsive review, decide whether the specified cheat sheets must be added, choose a license, confirm course attribution, replace the repository URL placeholder, and obtain explicit approval before publication/deployment.

## Scope control

Do not add a browser terminal, authentication, remote execution, backend, or database to V1. Revisit only with a separate proposal and security review.
