# Content Guidelines

## Content metadata schema (Milestone 0)

Use YAML frontmatter between `---` delimiters. Keep values to plain strings, integers, booleans, and inline lists of strings; do not use YAML aliases, nested objects, or multiline scalars in V1 content.

### Command pages

Required fields on both mode files:

```yaml
id: grep                 # stable command ID; same in both files
title: "grep"
type: command
stage: 4                  # integer 1–5
category: text-processing # kebab-case stage category
mode: detailed            # detailed or revision
difficulty: beginner      # beginner, intermediate, or advanced
summary: "Search text using patterns."
tags: [search, logs, regex]
related: [find, awk, wc]  # command IDs
```

Required fields must be present and non-empty; `stage`, `mode`, `type`, and `difficulty` must use the values above. Filenames use `<id>.<mode>.md`. A command must eventually have exactly one file for each mode. Related IDs must resolve to known command IDs once the full command set exists; the initial validator allows IDs not yet authored but requires every referenced ID to be in the supplied course command inventory.

### Challenge pages

Required fields: `id` (stable kebab-case identifier), `title`, `type: challenge`, `stage` (1–5), `difficulty`, `summary`, `objectives` (string list), `prerequisites` (command ID list), and `starting_files` (repository-relative paths under `playground/`). Challenge prose must include the challenge format in section 4 below. Hide the solution in `<details><summary>Show solution</summary>…</details>`.

### Links and validation

Use relative Markdown links for companion modes and related command pages. `python3 scripts/validate_content.py` checks frontmatter fields/types/enums, filename and mode agreement, command mode pairs, supplied command references, challenge paths, and local Markdown links. It uses only the Python standard library.

## 1. Voice and teaching approach

- Explain the reason behind a command, not just its syntax.
- Prefer practical terminal tasks over abstract examples.
- Assume beginner knowledge initially; define unfamiliar terms.
- Be concise but do not omit important caveats.
- Distinguish portable behavior from GNU-specific options.
- Never fabricate terminal output. Verify examples or label output as illustrative.

## 2. Required Detailed mode structure

Every command's Detailed mode should include:

1. **What it does** — concise concept.
2. **Why it matters** — practical relevance.
3. **Syntax** — general form.
4. **Arguments and options** — important flags, not every obscure option.
5. **Examples** — simple to realistic, with expected output where useful.
6. **Practical scenario** — task in the shared playground.
7. **Common mistakes** — symptoms and fixes.
8. **Safety notes** — especially for deletion, recursion, permissions, and system paths.
9. **Exercises** — guided then independent.
10. **Related commands** — links to relevant topics.

## 3. Required Revision mode structure

- One-line purpose.
- Syntax.
- Most useful options.
- 3–5 practical examples.
- Common combinations/pipeline patterns where appropriate.
- 2–3 quick recall challenges.
- Link to Detailed mode.

## 4. Challenge format

Each challenge should provide:
- stable ID and title;
- stage and difficulty;
- learning objectives;
- prerequisites / command IDs;
- scenario;
- starting files;
- task requirements;
- constraints (for example, “do not edit the source file”);
- hints revealed progressively;
- solution in a separate revealable section or file;
- expected result / validation approach;
- reset instructions.

Do not expose the solution immediately in the learner's primary path.

## 5. Expected output

- Use realistic but small outputs.
- Explain whether output is exact or illustrative.
- Avoid depending on unstable fields such as timestamps, PIDs, or filesystem ordering unless the exercise accounts for them.
- Prefer deterministic fixtures.

## 6. Safety standards

- Never ask beginners to run destructive commands against real system paths.
- Use an explicit playground working directory.
- For `rm`, demonstrate preview/inspection and tightly scoped targets first.
- Do not teach unsafe `find ... -exec rm` patterns without strong guardrails.
- Explain quoting and whitespace handling for `xargs`.
- Explain that `awk`, `grep`, and similar tools process text and are not automatically CSV-aware for all CSV edge cases.
- Do not include real passwords, tokens, IPs belonging to private users, or personal logs in fixtures.

## 7. Cross-command scenarios

Build cumulative scenarios, such as:
- organize a project tree (`pwd`, `ls`, `mkdir`, `cp`, `mv`);
- inspect an application log (`less`, `head`, `tail`, `grep`, `wc`);
- find files and executables (`which`, `whereis`, `find`);
- analyze synthetic employee records (`cut`, `sort`, `uniq`, `awk`, `join`);
- inspect storage usage (`du`, `df`, `time`).

## 8. Source and originality

The supplied LabEx syllabus is a scope reference. Write original explanations, examples, datasets, and challenge instructions. Attribute the course as inspiration/reference where appropriate. Do not copy proprietary course text or solutions.
