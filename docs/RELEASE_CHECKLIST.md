# First Public Release Checklist

**Current disposition: not ready to publish.** This document records preparation work and remaining decisions. No repository has been published and no site has been deployed.

## Project and content

- [x] Canonical command lessons remain under `content/stages/` and render from the repository.
- [x] Five stages, 31 command pairs, nine authored challenges, and the final assessment are discoverable in the app.
- [x] The 41-activity course-count discrepancy is documented in `docs/COURSE_MAPPING.md`; no activity was invented to fill it.
- [x] Playground setup, reset, environment prerequisites, and safety boundaries are documented.
- [ ] Rerun the content validator and playground/Stage 01–06 suites on a Linux host; the Windows Python shim was inaccessible and WSL returned `execvpe(bash) failed: No such file or directory`.
- [ ] Decide whether the cheat sheets named by the project spec are required in the first release; `content/cheatsheets/` currently has no authored cheat sheets or app route.
- [ ] Review or resolve the source-course discrepancy if the numbered original activity list becomes available.

## Web app and privacy

- [x] Local development, test, lint, typecheck, and production build commands are documented.
- [ ] Verify a clean dependency install with `npm ci` on the supported release host; this milestone did not remove/reinstall the working dependency tree.
- [x] Assessment drafts/results and existing workspace data stay in browser localStorage; schema version 1 data migrates to version 2 without dropping prior workspace fields.
- [x] No credentials, environment variables, analytics, backend, or remote progress service are required by the app.
- [ ] Complete manual keyboard, screen-reader, and responsive browser review. Only a read-only desktop render of the assessment entry page was checked; no interactions or viewport breakpoints were exercised. Automated checks do not replace this review.
- [ ] Recheck the production build on a supported Linux/CI host; the Windows sandbox required an unsandboxed build after denying route-output directory creation.
- [ ] Review dependency advisories and third-party package licenses before release.

## Checks run for Milestone 8

- [x] Assessment and workspace tests: `npm test` — 20 tests passed.
- [x] `npm run lint` and `npm run typecheck` passed.
- [x] `npm run build` passed outside the restricted Windows sandbox and generated 84 routes.
- [x] `git diff --check` passed.
- [ ] `python3 scripts/validate_content.py` — blocked by the inaccessible Windows Python shim.
- [ ] Playground lifecycle and Stage 01–06 regression suites — blocked because WSL has no executable `bash`.
- [ ] Browser interaction and accessibility review — assessment entry rendered in a local browser; no saved data was changed. Full keyboard, screen-reader, and responsive checks remain outstanding.

## Legal and publishing decisions

- [ ] Choose and add a project license. There is no root `LICENSE` file now, so downstream reuse terms are unspecified.
- [ ] Confirm attribution wording for the course as an inspiration/reference, without implying endorsement or reproducing its proprietary content.
- [ ] Replace the README's `<repository-url>` placeholder with the approved public repository URL.
- [ ] Select a hosting platform and confirm its build/runtime configuration. The app currently uses the Next.js server runtime, not static export.
- [x] Initial repository review found no tracked `LICENSE`, `NOTICE`, or `COPYING` file and no `.env*` files; repeat this check against the final release diff.
- [ ] Review the final public diff for private information and approve publication explicitly.
- [ ] Obtain explicit approval before publishing the repository or deploying the site.

## Project checks

From `apps/web/`:

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

From the repository root on Linux:

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

The stage runner names reflect the existing repository scripts: Stage 04 text processing uses `test_stage05_examples.py`, and Stage 05 system information uses `test_stage06_examples.py`.
