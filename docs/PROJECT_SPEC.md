# Project Specification

## 1. Product summary

**Name:** Linux Labs  
**Repository:** `linux-command-labs`  
**Purpose:** A practical learning and revision resource for commonly used Linux commands, beginning with the supplied 41-activity course and designed to expand into broader Linux, Infrastructure, Security, and DevOps topics.

The project consists of:
1. A public, GitHub-readable learning repository.
2. A responsive web portal that renders the same canonical learning content.
3. A personal workspace whose progress data remains local to the browser by default.
4. A local Kali Linux playground containing safe synthetic files for hands-on exercises.

## 2. Target user and audience

Primary user: a learner practicing Linux on Kali Linux and preparing for Infrastructure, Security, and DevOps work.

Secondary audience: anyone who visits the public repository or website to learn the same material.

## 3. Goals

- Explain each command accurately and practically.
- Enable learners to execute exercises on their own Linux machine.
- Offer two levels of depth without maintaining duplicated facts.
- Make the content easy to browse on GitHub and through the web portal.
- Track personal learning progress without requiring an account.
- Make labs repeatable through setup and reset scripts.
- Preserve a path to add future Linux topics without restructuring the project.

## 4. Non-goals for V1

- User accounts or authentication.
- Cloud database or server-side progress sync.
- Browser terminal or remote shell.
- Executing shell commands from the web application.
- A full Linux administration curriculum.
- Reproducing LabEx wording or proprietary lab instructions.

## 5. Learning modes

### Detailed mode
For first-time learning. Include:
- concept and purpose;
- syntax and argument explanation;
- important options;
- examples with expected output;
- practical scenario;
- common mistakes and troubleshooting;
- safety/security notes when relevant;
- guided and independent exercises;
- links to related commands.

### Revision mode
For quick refresh. Include:
- one-line purpose;
- syntax;
- high-value options;
- concise examples;
- common combinations;
- short recall challenges;
- link to Detailed mode.

Both modes must cover the same command and learning objectives. Revision is a concise presentation, not a separate curriculum.

## 6. Initial course scope

### Stage 01 — File System Operations
`ls`, `pwd`, `cd`, `mkdir`, `cp`, `mv`, `rm`
Scenarios: listing, navigation, nested project creation, copying, moving, renaming, safe deletion, organizing directories.

### Stage 02 — File Content Operations
`cat`, `more`, `less`, `head`, `tail`, `nl`
Scenarios: inspect configuration-like files, navigate large logs, inspect beginning/end, line numbering, rapid log review.

### Stage 03 — File Search
`which`, `whereis`, `find`
Scenarios: locate executables, discover related files, search by name/type/size/time within the playground.

### Stage 04 — Text Processing
`grep`, `wc`, `cut`, `sort`, `uniq`, `tr`, `diff`, `join`, `xargs`, `awk`
Scenarios: synthetic log analysis, CSV extraction, sorting and deduplication, transformations, comparisons, joins, safe command construction, structured data analysis.

### Stage 05 — System Information
`top`, `free`, `df`, `du`, `time`
Scenarios: inspect processes and memory, understand filesystem capacity, estimate playground directory usage, compare command runtime.

**Coverage note:** The course description says 31 guided labs and 10 challenges. The supplied headline list names commands and several challenge titles but does not unambiguously map all 41 activities to commands. Create `docs/COURSE_MAPPING.md` during Milestone 0 and explicitly mark unknown titles/mappings rather than inventing them.

## 7. Web portal requirements

### Public
- Home/dashboard with course overview.
- Learning path with five stages.
- Stage pages listing commands and activities.
- Command pages with Detailed/Revision mode switch.
- Search across commands, concepts, options, and tags.
- Challenge pages with task, hints, and revealable solutions.
- Cheat sheets and final assessment.
- Accessible responsive layout.
- Light and dark themes.

### Personal workspace
- Completion state for stages, commands, and challenges.
- Bookmarks.
- Personal notes.
- Quiz/challenge results.
- Continue-learning / recently viewed.
- Progress summary.

### Privacy and persistence
- Local browser storage only in V1.
- No account required.
- No personal notes or progress sent to a server.
- Clearly explain that browser data may be lost if site data is cleared or another browser/device is used.
- Provide export/import of personal progress as a JSON file if feasible in V1. Validate imported data and version the export schema.
- Never commit a user's personal progress file to the public repository.

## 8. Playground requirements

- All generated data lives under `playground/`.
- Use synthetic logs, CSVs, text files, and project trees.
- Setup must be safe, repeatable, and scoped to the repository.
- Reset must only remove/recreate known generated playground content.
- No `sudo`; no modifications to `/etc`, `/var/log`, home directories, or other system paths.
- Include environment verification and clear prerequisites.
- Commands should be compatible with Kali and Ubuntu 22.04 where practical.
- Note GNU/Linux differences where behavior may vary.

## 9. Quality attributes

- Accuracy over breadth.
- Beginner-friendly but technically correct.
- Searchable, linkable, and easy to maintain.
- Minimal dependencies.
- Accessible keyboard navigation and semantic HTML.
- Fast static content delivery.
- Clear safety boundaries.
- No misleading claims about command output or testing.

## 10. Success criteria

- Every supplied command is represented in both modes.
- The 5 stages and source course activities are mapped.
- A learner can clone the repo, follow setup docs, and complete local exercises.
- The website renders canonical repository content.
- Personal progress persists locally and can be exported/imported.
- No backend or remote command execution is needed for V1.
