import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const commandFrontmatter = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.literal("command"),
  stage: z.number().int().min(1).max(5),
  category: z.string().min(1),
  mode: z.enum(["detailed", "revision"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  summary: z.string().min(1),
  tags: z.array(z.string()),
  related: z.array(z.string()),
});

const challengeFrontmatter = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.literal("challenge"),
  stage: z.number().int().min(1).max(5),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  summary: z.string().min(1),
  objectives: z.array(z.string()),
  prerequisites: z.array(z.string()),
  starting_files: z.array(z.string()),
});

const cheatSheetFrontmatter = z.object({
  id: z.string().regex(/^\d{2}-[a-z0-9-]+$/),
  title: z.string().min(1),
  type: z.literal("cheatsheet"),
  stage: z.number().int().min(1).max(5),
  summary: z.string().min(1),
  commands: z.array(z.string().min(1)).min(1),
});

const cheatSheetSections = [
  "Commands covered",
  "Purpose",
  "Essential syntax",
  "High-value options",
  "Short examples",
  "Useful combinations",
  "Common mistakes and safety",
  "Learn more",
];

export type LearningMode = "detailed" | "revision";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type CommandPage = z.infer<typeof commandFrontmatter> & {
  body: string;
  sourcePath: string;
};
export type Command = {
  id: string;
  title: string;
  stage: number;
  category: string;
  difficulty: Difficulty;
  summary: string;
  tags: string[];
  related: string[];
  guides: Record<LearningMode, CommandPage>;
};
export type Challenge = z.infer<typeof challengeFrontmatter> & {
  body: string;
  sourcePath: string;
};
export type CheatSheet = z.infer<typeof cheatSheetFrontmatter> & {
  body: string;
  sourcePath: string;
};
export type LearningStage = {
  number: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  sourcePath: string;
};
export type ContentCatalog = {
  stages: LearningStage[];
  commands: Command[];
  challenges: Challenge[];
  cheatsheets: CheatSheet[];
};

export class ContentValidationError extends Error {
  constructor(public readonly problems: string[]) {
    super("Content validation failed:\n" + problems.map((problem) => "- " + problem).join("\n"));
    this.name = "ContentValidationError";
  }
}

function zodMessage(error: z.ZodError): string {
  return error.issues
    .map((issue) => (issue.path.join(".") || "metadata") + ": " + issue.message)
    .join("; ");
}

export function parseCommandDocument(source: string, sourcePath: string): CommandPage {
  const parsed = matter(source);
  const result = commandFrontmatter.safeParse(parsed.data);
  if (!result.success) {
    throw new ContentValidationError([sourcePath + ": " + zodMessage(result.error)]);
  }
  return { ...result.data, body: parsed.content.trim(), sourcePath };
}

export function parseChallengeDocument(source: string, sourcePath: string): Challenge {
  const parsed = matter(source);
  const result = challengeFrontmatter.safeParse(parsed.data);
  if (!result.success) {
    throw new ContentValidationError([sourcePath + ": " + zodMessage(result.error)]);
  }
  if (!/<details>\s*<summary>Show solution<\/summary>[\s\S]*?<\/details>/i.test(parsed.content)) {
    throw new ContentValidationError([
      sourcePath + ": solution must use a collapsible Show solution details block",
    ]);
  }
  return { ...result.data, body: parsed.content.trim(), sourcePath };
}

export function parseCheatSheetDocument(source: string, sourcePath: string): CheatSheet {
  const parsed = matter(source);
  const result = cheatSheetFrontmatter.safeParse(parsed.data);
  if (!result.success) {
    throw new ContentValidationError([sourcePath + ": " + zodMessage(result.error)]);
  }
  const headings = new Set([...parsed.content.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1]));
  const missing = cheatSheetSections.filter((section) => !headings.has(section));
  if (missing.length) {
    throw new ContentValidationError([sourcePath + ": missing required sections: " + missing.join(", ")]);
  }
  return { ...result.data, body: parsed.content.trim(), sourcePath };
}

function readStage(directory: string): LearningStage {
  const slug = path.basename(directory);
  const match = /^(\d{2})-([a-z0-9-]+)$/.exec(slug);
  if (!match) {
    throw new ContentValidationError(["content/stages/" + slug + ": expected a two-digit stage folder"]);
  }
  const readmePath = path.join(directory, "README.md");
  if (!existsSync(readmePath)) {
    throw new ContentValidationError(["content/stages/" + slug + ": missing README.md"]);
  }
  const readme = readFileSync(readmePath, "utf8");
  const heading = /^#\s+Stage\s+\d+\s+[—-]\s+(.+)$/m.exec(readme);
  if (!heading) {
    throw new ContentValidationError(["content/stages/" + slug + "/README.md: missing stage title heading"]);
  }
  const description = readme
    .replace(/^#.*(?:\r?\n)+/, "")
    .split(/\r?\n/)
    .find((line) => line.trim() && !line.trim().startsWith("|") && !line.trim().startsWith("#"))
    ?.trim() ?? "";
  if (!description) {
    throw new ContentValidationError(["content/stages/" + slug + "/README.md: missing stage description"]);
  }
  const body = readme.replace(/^#.*(?:\r?\n)+/, "").trim();
  return {
    number: Number(match[1]),
    slug,
    title: heading[1].trim(),
    description,
    body,
    sourcePath: "stages/" + slug + "/README.md",
  };
}

function assertStartingFiles(challenge: Challenge, repoRoot: string): void {
  const playground = path.join(repoRoot, "playground");
  let realPlayground: string;
  try {
    realPlayground = realpathSync(playground);
  } catch {
    throw new ContentValidationError([challenge.sourcePath + ": playground directory is unavailable"]);
  }
  for (const item of challenge.starting_files) {
    if (path.isAbsolute(item) || !item.startsWith("playground/")) {
      throw new ContentValidationError([
        challenge.sourcePath + ": starting file must be a relative path under playground/: " + item,
      ]);
    }
    const file = path.resolve(repoRoot, item);
    const relative = path.relative(realPlayground, file);
    if (relative.startsWith("..") || path.isAbsolute(relative) || !existsSync(file)) {
      throw new ContentValidationError([
        challenge.sourcePath + ": starting file is missing or outside playground/: " + item,
      ]);
    }
    let realFile: string;
    try {
      realFile = realpathSync(file);
    } catch {
      throw new ContentValidationError([challenge.sourcePath + ": cannot resolve starting file: " + item]);
    }
    const realRelative = path.relative(realPlayground, realFile);
    if (realRelative.startsWith("..") || path.isAbsolute(realRelative) || !statSync(realFile).isFile()) {
      throw new ContentValidationError([
        challenge.sourcePath + ": starting file resolves outside playground or is not a file: " + item,
      ]);
    }
  }
}

function validateCheatSheetLinks(
  sheet: CheatSheet,
  contentRoot: string,
  repoRoot: string,
  knownCommands: Set<string>,
): string[] {
  const problems: string[] = [];
  const linkedGuides = new Set<string>();
  const sourceDirectory = path.dirname(path.resolve(repoRoot, sheet.sourcePath));
  for (const match of sheet.body.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)) {
    const raw = match[1].replace(/^<|>$/g, "");
    if (/^(?:[a-z]+:|\/\/|#)/i.test(raw)) continue;
    const relativeTarget = raw.split(/[?#]/, 1)[0];
    let decodedTarget = relativeTarget;
    try {
      decodedTarget = decodeURIComponent(relativeTarget);
    } catch {
      problems.push(sheet.sourcePath + ": invalid URL encoding in local link " + raw);
      continue;
    }
    const resolved = path.resolve(sourceDirectory, decodedTarget);
    const relative = path.relative(contentRoot, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative) || !existsSync(resolved) || !statSync(resolved).isFile()) {
      problems.push(sheet.sourcePath + ": broken or out-of-content local link " + raw);
      continue;
    }
    const routeTarget = path.posix.normalize(path.posix.join(path.posix.dirname(sheet.sourcePath), relativeTarget));
    const guideMatch = /^(?:content\/)?stages\/(\d{2}-[a-z0-9-]+)\/([a-z0-9-]+)\.(detailed|revision)\.md$/.exec(routeTarget);
    if (guideMatch) {
      const [, stageSlug, commandId, mode] = guideMatch;
      if (!knownCommands.has(commandId)) {
        problems.push(sheet.sourcePath + ": guide link names unknown command " + commandId);
      } else if (stageSlug !== sheet.id) {
        problems.push(sheet.sourcePath + ": guide link for " + commandId + " points to a different stage");
      } else {
        linkedGuides.add(commandId + ":" + mode);
      }
    }
  }
  for (const commandId of sheet.commands) {
    for (const mode of ["detailed", "revision"]) {
      if (!linkedGuides.has(commandId + ":" + mode)) {
        problems.push(sheet.sourcePath + ": missing " + mode + " guide link for " + commandId);
      }
    }
  }
  return problems;
}

export function validateCatalog(
  catalog: ContentCatalog,
  repoRoot = path.resolve(process.cwd(), "../.."),
): ContentCatalog {
  const problems: string[] = [];
  const ids = new Set(catalog.commands.map((command) => command.id));
  const stageByNumber = new Map(catalog.stages.map((stage) => [stage.number, stage]));
  const cheatsheetIds = new Set<string>();
  const cheatsheetsByStage = new Map<number, CheatSheet>();
  const cheatSheetCommandCounts = new Map<string, number>();
  const contentRoot = path.join(repoRoot, "content");

  for (const command of catalog.commands) {
    const stage = stageByNumber.get(command.stage);
    if (!stage) problems.push("command " + command.id + ": stage " + command.stage + " has no stage README");
    const sourceFolder = command.guides.detailed.sourcePath.split("/").at(-2);
    if (sourceFolder !== stage?.slug) {
      problems.push("command " + command.id + ": metadata stage and directory disagree");
    }
    for (const related of command.related) {
      if (!ids.has(related)) problems.push("command " + command.id + ": unknown related command " + related);
    }
    const detail = command.guides.detailed;
    const revision = command.guides.revision;
    if (
      detail.id !== revision.id ||
      detail.title !== revision.title ||
      detail.stage !== revision.stage ||
      detail.category !== revision.category
    ) {
      problems.push("command " + command.id + ": Detailed/Revision identity metadata does not match");
    }
    if (!detail.sourcePath.endsWith("/" + command.id + ".detailed.md")) {
      problems.push("command " + command.id + ": Detailed filename does not match its stable id");
    }
    if (!revision.sourcePath.endsWith("/" + command.id + ".revision.md")) {
      problems.push("command " + command.id + ": Revision filename does not match its stable id");
    }
  }

  const challengeIds = new Set<string>();
  for (const challenge of catalog.challenges) {
    if (challengeIds.has(challenge.id)) problems.push("duplicate challenge id: " + challenge.id);
    challengeIds.add(challenge.id);
    if (!challenge.sourcePath.endsWith("/" + challenge.id + ".md")) {
      problems.push("challenge " + challenge.id + ": filename does not match its stable id");
    }
    if (!stageByNumber.has(challenge.stage)) {
      problems.push("challenge " + challenge.id + ": stage " + challenge.stage + " has no stage README");
    }
    for (const prerequisite of challenge.prerequisites) {
      if (!ids.has(prerequisite)) {
        problems.push("challenge " + challenge.id + ": unknown prerequisite command " + prerequisite);
      }
    }
    try {
      assertStartingFiles(challenge, repoRoot);
    } catch (error) {
      if (error instanceof ContentValidationError) problems.push(...error.problems);
      else throw error;
    }
  }

  for (const sheet of catalog.cheatsheets) {
    const stage = stageByNumber.get(sheet.stage);
    if (cheatsheetIds.has(sheet.id)) problems.push("duplicate cheat sheet id: " + sheet.id);
    cheatsheetIds.add(sheet.id);
    if (!stage) {
      problems.push("cheat sheet " + sheet.id + ": stage " + sheet.stage + " has no stage README");
      continue;
    }
    if (sheet.id !== stage.slug || !sheet.sourcePath.endsWith("/" + stage.slug + ".md")) {
      problems.push("cheat sheet " + sheet.id + ": id and filename must match stage " + stage.slug);
    }
    if (cheatsheetsByStage.has(sheet.stage)) problems.push("duplicate cheat sheet for stage " + sheet.stage);
    cheatsheetsByStage.set(sheet.stage, sheet);
    if (new Set(sheet.commands).size !== sheet.commands.length) {
      problems.push(sheet.sourcePath + ": command references must be unique");
    }
    for (const commandId of sheet.commands) {
      const command = catalog.commands.find((candidate) => candidate.id === commandId);
      if (!command) {
        problems.push(sheet.sourcePath + ": unknown command reference " + commandId);
        continue;
      }
      if (command.stage !== sheet.stage) {
        problems.push(sheet.sourcePath + ": command " + commandId + " belongs to stage " + command.stage);
      }
      cheatSheetCommandCounts.set(commandId, (cheatSheetCommandCounts.get(commandId) ?? 0) + 1);
    }
    problems.push(...validateCheatSheetLinks(sheet, contentRoot, repoRoot, ids));
  }
  for (const stage of catalog.stages) {
    if (!cheatsheetsByStage.has(stage.number)) problems.push("missing cheat sheet for stage " + stage.number);
    for (const command of catalog.commands.filter((candidate) => candidate.stage === stage.number)) {
      const count = cheatSheetCommandCounts.get(command.id) ?? 0;
      if (count !== 1) problems.push("command " + command.id + ": expected one cheat sheet reference, found " + count);
    }
  }
  if (problems.length) throw new ContentValidationError(problems);
  return catalog;
}

export function loadCatalog(repoRoot = path.resolve(process.cwd(), "../..")): ContentCatalog {
  const contentRoot = path.join(repoRoot, "content");
  const stagesRoot = path.join(contentRoot, "stages");
  const stageDirectories = readdirSync(stagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(stagesRoot, entry.name))
    .sort();
  const stages = stageDirectories.map(readStage);
  const stageSlugs = new Map(stages.map((stage) => [stage.number, stage.slug]));
  const guidesById = new Map<string, Partial<Record<LearningMode, CommandPage>>>();

  for (const directory of stageDirectories) {
    for (const filename of readdirSync(directory).filter((file) => file.endsWith(".md") && file !== "README.md")) {
      const match = /^([a-z0-9-]+)\.(detailed|revision)\.md$/.exec(filename);
      const relativePath = path.relative(contentRoot, path.join(directory, filename)).split(path.sep).join("/");
      if (!match) {
        throw new ContentValidationError([
          "content/" + relativePath + ": expected <id>.detailed.md or <id>.revision.md",
        ]);
      }
      const filenameId = match[1];
      const filenameMode = match[2] as LearningMode;
      const page = parseCommandDocument(
        readFileSync(path.join(directory, filename), "utf8"),
        "content/" + relativePath,
      );
      if (page.id !== filenameId || page.mode !== filenameMode) {
        throw new ContentValidationError(["content/" + relativePath + ": filename id/mode does not match frontmatter"]);
      }
      if (stageSlugs.get(page.stage) !== path.basename(directory)) {
        throw new ContentValidationError([
          "content/" + relativePath + ": stage number " + page.stage + " does not match its directory",
        ]);
      }
      const guides = guidesById.get(page.id) ?? {};
      if (guides[page.mode]) {
        throw new ContentValidationError([
          "content/" + relativePath + ": duplicate " + page.mode + " guide for " + page.id,
        ]);
      }
      guides[page.mode] = page;
      guidesById.set(page.id, guides);
    }
  }

  const commands: Command[] = [];
  for (const [id, guides] of guidesById) {
    if (!guides.detailed || !guides.revision) {
      throw new ContentValidationError(["command " + id + ": missing its Detailed or Revision companion page"]);
    }
    const page = guides.detailed;
    commands.push({
      id,
      title: page.title,
      stage: page.stage,
      category: page.category,
      difficulty: page.difficulty,
      summary: page.summary,
      tags: page.tags,
      related: page.related,
      guides: { detailed: guides.detailed, revision: guides.revision },
    });
  }
  commands.sort((left, right) => left.stage - right.stage || left.id.localeCompare(right.id));

  const challengesDirectory = path.join(contentRoot, "challenges");
  const challenges = readdirSync(challengesDirectory)
    .filter((filename) => filename.endsWith(".md") && filename.toLowerCase() !== "readme.md")
    .sort()
    .map((filename) => {
      const relativePath = path.relative(contentRoot, path.join(challengesDirectory, filename))
        .split(path.sep).join("/");
      return parseChallengeDocument(
        readFileSync(path.join(challengesDirectory, filename), "utf8"),
        "content/" + relativePath,
      );
    });
  const cheatsheetsDirectory = path.join(contentRoot, "cheatsheets");
  const cheatsheets = readdirSync(cheatsheetsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .sort()
    .map((filename) => {
      const relativePath = path.relative(contentRoot, path.join(cheatsheetsDirectory, filename))
        .split(path.sep).join("/");
      return parseCheatSheetDocument(
        readFileSync(path.join(cheatsheetsDirectory, filename), "utf8"),
        "content/" + relativePath,
      );
    });
  return validateCatalog({ stages, commands, challenges, cheatsheets }, repoRoot);
}

export function contentRouteForLink(href: string, sourcePath: string): string {
  if (/^(?:[a-z]+:|\/\/|mailto:|tel:)/i.test(href) || href.startsWith("#")) return href;
  const cleanHref = href.split("#", 1)[0].split("?", 1)[0];
  if (!cleanHref.endsWith(".md")) return href;
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), cleanHref));
  const routeTarget = target.replace(/^content\//, "");
  const commandMatch = /^stages\/(\d{2}-[a-z0-9-]+)\/([a-z0-9-]+)\.(detailed|revision)\.md$/.exec(routeTarget);
  if (commandMatch) return "/commands/" + commandMatch[2] + "/" + commandMatch[3];
  const challengeMatch = /^challenges\/([a-z0-9-]+)\.md$/.exec(routeTarget);
  if (challengeMatch) return "/challenges/" + challengeMatch[1];
  const cheatSheetMatch = /^cheatsheets\/(\d{2}-[a-z0-9-]+)\.md$/.exec(routeTarget);
  if (cheatSheetMatch) return "/cheatsheets/" + cheatSheetMatch[1];
  const stageMatch = /^stages\/(\d{2}-[a-z0-9-]+)\/README\.md$/.exec(routeTarget);
  if (stageMatch) return "/paths/" + stageMatch[1];
  return href;
}

export function getRepositoryRoot(): string {
  return path.resolve(process.cwd(), "../..");
}
