# Architecture

## 1. Guiding principle

**Content is the product; the website is a client of the content.**

The repository must remain useful without the web app. The web app must not become the only place where learning material exists.

## 2. Proposed repository layout

```text
linux-command-labs/
├── apps/
│   └── web/                      # Next.js App Router application
├── content/
│   ├── stages/
│   │   ├── 01-file-system/
│   │   ├── 02-file-content/
│   │   ├── 03-file-search/
│   │   ├── 04-text-processing/
│   │   └── 05-system-information/
│   ├── challenges/
│   ├── cheatsheets/
│   └── assessments/
├── playground/
│   ├── projects/
│   ├── logs/
│   ├── data/
│   └── backups/
├── setup/
├── scripts/
├── docs/
├── progress/
├── README.md
├── CODEX_INSTRUCTIONS.md
├── CONTRIBUTING.md
├── .gitignore
└── apps/web/package.json        # isolated web dependencies
```

Do not create empty placeholder files for every future lab. Create folders and representative examples only when they help establish the conventions.

## 3. Content model

Use Markdown with YAML frontmatter. Keep content readable in GitHub. The web app should parse and validate frontmatter through a small content layer.

Suggested command page metadata:

```yaml
---
id: grep
title: "grep"
stage: 4
category: "text-processing"
difficulty: "beginner"
summary: "Search text using patterns."
tags: ["search", "logs", "regex"]
related: ["find", "awk", "wc"]
---
```

Recommended content organization:
- One canonical command page per command.
- Clearly separated Detailed and Revision sections or companion files linked by the same stable command ID.
- Challenge files reference command IDs.
- Avoid duplicating command facts between modes. If separate files are used for modes, validate matching IDs and links.

### Milestone 0 decision

Use plain Markdown with YAML frontmatter. Each command has two companion files in its stage directory: `<command>.detailed.md` and `<command>.revision.md`. Both carry the same stable `id` and stage metadata, plus a `mode` field. This keeps each file directly readable on GitHub and makes mode links explicit without duplicating content in one long page. Challenges live in `content/challenges/`; put solutions in a GitHub-compatible `<details>` block so they are hidden until requested. The web renderer can preserve this reveal behavior.

The required fields and validation rules are specified in `docs/CONTENT_GUIDELINES.md`. Keep YAML to simple scalar values and inline lists for the initial content layer; the metadata validator checks the agreed subset without introducing a dependency.

Course activity mapping remains a source-data issue: the supplied syllabus does not provide the full 41 activity titles or a reliable guided/challenge classification. Preserve each supplied headline and mark the unprovided activity explicitly in `docs/COURSE_MAPPING.md` rather than inferring it.

## 4. Web stack

Preferred:
- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui where components add value.
- Markdown/MDX content loader with frontmatter validation.
- Static generation for public content wherever possible.

V1 is implemented in `apps/web`: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui primitives, React Markdown with GFM, gray-matter frontmatter parsing, and Zod validation. `lib/content.ts` discovers stage READMEs, Detailed/Revision pairs, challenge files, and one cheat sheet per stage from the repository. It validates stable IDs, matching metadata, stage placement, command references, cheat-sheet sections and guide links, prerequisites, and challenge starter paths; malformed content fails loudly instead of disappearing from the interface.

Routes include the dashboard, stage index/detail, searchable command library, both guide modes, cheat-sheet index/stage detail, challenge index/detail, the structured final assessment, and personal workspace. Dynamic route parameters are checked against the discovered catalog. Markdown is sanitized before rendering; the sanitizer retains GitHub-compatible `details`/`summary` solution blocks and local Markdown links are mapped to application routes. The app reads the repository content at build/runtime and does not keep a second copy of lesson text.

V1 runs with `next dev` / `next start`; static export is not configured because the content loader reads repository files and the deployment contract has not yet been selected. Avoid adding a CMS or database in V1.

### Deployment consideration
V1 prerenders content routes but is configured for the Next.js server runtime, not `output: export`. Hosting remains an outstanding release decision; avoid server-only features beyond repository content discovery that would create unnecessary lock-in.

## 5. Progress storage

V1:
- Browser localStorage (or IndexedDB only if a concrete need arises).
- Versioned data schema.
- Safe parsing and migration handling.
- Export/import JSON.
- Clear/reset personal data control in the UI.
- No remote persistence.

Example conceptual data:

```ts
type ProgressState = {
  schemaVersion: 2;
  completedItems: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  quizResults: Record<string, {
    score: number;
    completedAt: string;
  }>;
  recentlyViewed: string[];
  assessmentAttempts: AssessmentAttempt[];
};
```

Do not treat this example as permission to store sensitive information. Notes are user-controlled local content. The app stores schema version 2 under the stable key `linux-labs.workspace.v1`. Version 1 workspace data is migrated while preserving completions, bookmarks, notes, recent views, challenge results, and theme; the new assessment history starts empty. Attempt records are bounded and filtered against the assessment task/section IDs. Unsupported future versions are preserved rather than overwritten. Corrupt data opens with safe defaults and a recovery notice. Users can export/import a JSON copy and use a confirmation dialog before clearing data. Theme initialization reads the stored preference before paint to reduce theme flash.

The final assessment definition is canonical structured JSON in `content/assessments/final-assessment.json`. Its Zod schema enforces task shape, unique IDs, and a 100-point total. Typed answers are checked locally against accepted answers; practical task points are learner-reported rubric confirmations. The browser neither runs commands nor verifies practical work. Attempts autosave after responses, can resume after navigation/reload, and retain up to ten records for review. This client-side assessment is a learning aid, not a secure exam or credential.

## 6. Playground architecture

- `setup/setup.sh`: create only the known playground structure and deterministic sample files; preserve the existing `playground/logs/app.log` fixture.
- `setup/reset-lab.sh`: require an interactive yes/no confirmation or explicit `--yes`, remove only enumerated generated files plus the single marker-validated `playground/projects/organization-lab/` disposable tree, and preserve `app.log` and unknown files elsewhere.
- `setup/verify-environment.sh`: detect distribution/kernel, check required tools, and report selected versions without installing anything.
- `scripts/test_playground.sh`: exercise setup/reset in a temporary disposable repository copy, including symlink and out-of-root safety cases.
- `scripts/`: validation and synthetic-data generation helpers.

Use a repository-root resolution strategy that works regardless of the caller's current directory. Resolve and validate the target path before destructive operations. Refuse to operate if the target is not the expected repository playground directory. Never use `sudo`.

## 7. Security

- No shell execution in the browser.
- No terminal websocket or exposed local daemon.
- No secrets or personal logs in fixtures.
- Sanitize rendered Markdown HTML and validate metadata/starter paths.
- Treat Markdown as content, not executable trusted HTML.
- Keep dependencies current and minimal.
- Do not add analytics or third-party tracking by default.

## 8. Future extension points

Possible later additions:
- Permissions and ownership.
- Users and groups.
- Processes and signals.
- Package management.
- systemd and services.
- Networking, DNS, SSH.
- Bash scripting.
- Containers and DevOps workflows.
- Optional isolated browser terminal, only after a separate threat model and infrastructure design.
