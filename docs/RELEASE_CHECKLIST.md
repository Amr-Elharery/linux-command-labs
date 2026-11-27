# First Public Release Checklist

**Current disposition: NO-GO.** No repository has been published and no site has been deployed. This checklist records the final QA attempt on 2026-11-27; blocked checks are not marked as passed.

## Project and content

- [x] Canonical command lessons remain under `content/stages/` and render from the repository.
- [x] Five stages, 31 command pairs, nine authored challenges, and the final assessment are implemented.
- [x] The discrepancy between the stated 41 source-course activities and the incomplete numbered source list is documented in `docs/COURSE_MAPPING.md`. No activity has been invented to fill it.
- [x] Playground setup, reset, environment prerequisites, and safety boundaries are documented and the safety code was reviewed.
- [ ] Run the content validator and playground/Stage 01–06 regression suites on Linux. WSL returned `E_ACCESSDENIED`; an approved retry could not start `bash` because the available WSL distribution has no executable bash. Docker Desktop has no running Linux engine.
- [ ] Implement and expose cheat sheets. This is required by V1: `docs/PROJECT_SPEC.md` section 7 lists “Cheat sheets and final assessment” in the public site scope. No cheat sheets or application route are present. Re-scope only with an explicit project-owner decision.
- [ ] Obtain the authoritative numbered list of all source-course activities if one exists. Continue to describe the mapping discrepancy without inventing activities.

## Web app, clean install, and privacy

- [x] `apps/web/package-lock.json` is tracked by Git; its v3 root package name/version match the manifest, and `npm ci --ignore-scripts --dry-run --offline --no-audit --no-fund` exited 0 with an install plan. The lockfile is consistent, but the dry-run is not a clean install.
- [ ] Complete a clean `npm ci`. In-place attempts failed because Windows denied unlinking the native `lightningcss` binary. A fresh temporary install could not reach `registry.npmjs.org` and was stopped after hanging. A dry-run displayed an install plan but does not replace a clean install.
- [ ] Run tests, lint, typecheck, and production build after restoring dependencies from a successful clean install. Attempts after the failed in-place install reported missing `vitest`, `eslint`, `tsc`, and `next` executables. Earlier Milestone 8 passes are historical and do not satisfy this final QA gate.
- [ ] Run `npm audit` with registry access. Current attempt failed because DNS lookup for `registry.npmjs.org` returned `ENOTFOUND`; no advisory result is available. Do not apply broad upgrades without compatibility review.
- [x] Source review: assessment scoring distinguishes 65 browser-checked points from 35 learner-reported self-assessment points; the UI states that commands are not executed or verified.
- [x] Source review: workspace v1 migration preserves existing fields; malformed data is normalized/recovered; unknown future versions are preserved rather than overwritten; import is schema-validated; reset is explicit and local.
- [ ] Exercise the complete assessment flow in an isolated browser context. Existing browser attempts were not edited. No app server could be started after the dependency tree became incomplete, so start, answer, self-assess, score, submit, reload/review, retry, interruption recovery, invalid/outdated recovery, and live migration remain unverified end to end.
- [ ] Recheck the production build on a supported Linux/CI host.

## Accessibility and responsive review

- [x] Source review found semantic main/section landmarks, heading hierarchy, native labels for self-assessment checkboxes, an accessible name for answer inputs, button-based section navigation, and visible focus styling in the shared UI primitives.
- [x] Added polite screen-reader announcements for task progress and assessment results in `apps/web/components/assessment-player.tsx`.
- [ ] Verify keyboard-only navigation, focus order/visibility, screen-reader announcements, form feedback, and contrast in both themes in a running browser with assistive technology.
- [ ] Review mobile, tablet, and desktop layouts in a running browser. No responsive viewport review ran during this QA pass.
- [ ] Calculate/measure contrast for rendered states; source color tokens alone are not sufficient evidence of WCAG conformance.

## Security, dependencies, and repository hygiene

- [x] Markdown rendering uses `rehype-raw` followed by `rehype-sanitize` with only `details`/`summary` and the `details[open]` attribute added to the default safe schema. Review found no custom script or event-handler allowance.
- [x] Playground setup/reset/environment scripts were reviewed for repository scoping, path validation, symlink defense, confirmation, and absence of `sudo`.
- [x] Tracked-file scan found no `LICENSE`, `NOTICE`, `COPYING`, or `.env*` files. Credential-pattern scan returned no matches.
- [ ] Complete a vulnerability audit and transitive dependency license report with registry access. Direct runtime dependencies declare MIT, Apache-2.0, or ISC in the lockfile; this is not a complete transitive license review.
- [ ] Review the final public diff for private information and approve publication explicitly.

## Final QA results — 2026-11-27

### Linux regression suites

All suites below are **blocked**, not passed or failed, because Linux execution could not start:

- [ ] `python3 scripts/validate_content.py` — Windows Python shim could not start; WSL returned `Wsl/E_ACCESSDENIED`; approved retry reported `execvpe(bash) failed: No such file or directory`.
- [ ] `bash scripts/test_playground.sh` — same WSL blocker.
- [ ] `python3 scripts/test_stage01_examples.py` — same WSL blocker.
- [ ] `python3 scripts/test_stage02_examples.py` — same WSL blocker.
- [ ] `python3 scripts/test_stage03_examples.py` — same WSL blocker.
- [ ] `python3 scripts/test_stage05_examples.py` (Stage 04 text processing) — same WSL blocker.
- [ ] `python3 scripts/test_stage06_examples.py` (Stage 05 system information) — same WSL blocker.

### Web and repository checks

- [ ] `npm ci` — failed in place with Windows `EPERM` unlinking `lightningcss.win32-x64-msvc.node`; clean temporary install was blocked by registry DNS/network access.
- [ ] `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` — attempted after the failed install; each could not start because its executable was missing from the partially cleaned `node_modules` tree. These are environment/setup failures, not code test failures.
- [ ] `npm audit` — blocked: registry request failed with `ENOTFOUND registry.npmjs.org`.
- [x] `git diff --check` — passed after the final edits; Git reported only its normal LF-to-CRLF working-copy warnings.
- [ ] Assessment browser E2E — blocked because the web dependencies could not be restored and no local app could be started; pre-existing saved attempts were left untouched.

The stage runner names reflect the existing repository scripts: Stage 04 text processing uses `test_stage05_examples.py`, and Stage 05 system information uses `test_stage06_examples.py`.

## Owner decisions and release blockers

- [ ] **License:** choose and add a license. Options include MIT (permissive reuse with attribution/notice), Apache-2.0 (permissive with an express patent grant and NOTICE requirements), or separate licenses for code and learning content such as MIT/Apache-2.0 for code and CC BY 4.0 for original educational content. GPL-3.0 is a copyleft option whose redistribution terms apply to covered derivatives. The project owner must choose; no license is selected here.
- [ ] Confirm attribution wording for the source course without implying endorsement or reproducing proprietary material.
- [ ] Replace the README's `<repository-url>` placeholder with the approved public repository URL.
- [ ] Select a hosting platform and confirm its build/runtime configuration. The app uses the Next.js server runtime, not static export.
- [ ] Either complete cheat sheets for V1 or explicitly revise the project scope before release.
- [ ] Resolve or formally accept the source activity mapping limitation while preserving the documented unknowns.
- [ ] Obtain explicit approval before publishing the repository or deploying the site.

## Recommended release configuration

Use the repository's documented Node version and a Linux CI/release host. Require `npm ci`, tests, lint, typecheck, production build, `npm audit`, the content validator, playground lifecycle tests, and all Stage 01–06 regression suites as CI gates. Preserve browser-local workspace privacy; do not introduce analytics, accounts, or remote command execution as part of release preparation. Keep publishing and deployment disabled until technical gates pass and the owner decisions above are resolved or explicitly accepted.

## Commands for Linux release validation

From `apps/web/`:

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm audit
```

From the repository root:

```bash
python3 scripts/validate_content.py
bash scripts/test_playground.sh
python3 scripts/test_stage01_examples.py
python3 scripts/test_stage02_examples.py
python3 scripts/test_stage03_examples.py
python3 scripts/test_stage05_examples.py
python3 scripts/test_stage06_examples.py
git diff --check
```
