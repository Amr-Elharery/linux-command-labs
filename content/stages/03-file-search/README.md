# Stage 03 — File Search

Use `which` for PATH lookup, `whereis` for standard binary/source/manual locations, and `find` to search an explicit directory tree. Each command has a Detailed and Revision guide.

| Command | Detailed | Revision |
|---|---|---|
| `which` | [Read the tutorial](which.detailed.md) | [Quick review](which.revision.md) |
| `whereis` | [Read the tutorial](whereis.detailed.md) | [Quick review](whereis.revision.md) |
| `find` | [Read the tutorial](find.detailed.md) | [Quick review](find.revision.md) |

## Search scope and safety

Stage 03 examples search only `playground/`. Use a relative path from the repository root or an absolute path to the checkout. Choose a specific starting directory instead of `/`, `/home`, `/etc`, or other private/system trees. `find` may report `Permission denied` when it cannot traverse a directory; narrow the search or inspect its permissions, and do not use `sudo` to bypass them.

For safe command actions, use read-only `-exec` operations such as `wc -l -- {} +`. Preserve unusual filenames through `-print0 | xargs -0`. Do not practice deletion with `find`.

The cumulative challenge is [Critical Resource Discovery](../../challenges/critical-resource-discovery.md). File modification-time demonstrations create controlled samples only under `playground/projects/organization-lab/work/`; reset that workspace with:

```bash
bash setup/reset-lab.sh --yes && bash setup/setup.sh
```

To execute the stage examples in isolated fixture copies, run `python3 scripts/test_stage03_examples.py` from the repository root.
