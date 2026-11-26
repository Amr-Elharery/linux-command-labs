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
└── package.json                 # only if workspace tooling is justified
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

Avoid adding a CMS or database in V1.

### Deployment consideration
Keep the app compatible with static export if practical, so GitHub Pages remains an option. Vercel is also acceptable. Avoid server-only features that create unnecessary deployment lock-in.

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
  schemaVersion: 1;
  completedItems: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  quizResults: Record<string, {
    score: number;
    completedAt: string;
  }>;
  recentlyViewed: string[];
};
```

Do not treat this example as permission to store sensitive information. Notes are user-controlled local content.

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
- Escape rendered content and validate metadata.
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
