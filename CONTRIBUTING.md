# Contributing

Thanks for improving Linux Labs.

## Content contributions

- Follow `docs/CONTENT_GUIDELINES.md`.
- Keep Detailed and Revision modes aligned.
- Use synthetic, deterministic fixtures.
- Verify shell commands on Kali or Ubuntu before marking them tested.
- Keep Stage 01 mutating examples inside `playground/projects/organization-lab/` and reset them with the documented workflow.
- Scope all exercises to `playground/`.
- Add related-command links and update course mapping when adding coverage.

## Code contributions

- Keep the app as a renderer of canonical content.
- Avoid adding a backend or remote command execution to V1.
- Keep dependencies minimal.
- Add or update tests for changed behavior.
- Update docs when workflows or schemas change.

## Suggested commit messages

- `docs: add grep detailed tutorial`
- `content: add file search challenges`
- `feat(web): add command explorer`
- `fix(playground): scope reset to generated fixtures`
