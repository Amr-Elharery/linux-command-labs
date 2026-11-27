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

export function validateCatalog(
  catalog: ContentCatalog,
  repoRoot = path.resolve(process.cwd(), "../.."),
): ContentCatalog {
  const problems: string[] = [];
  const ids = new Set(catalog.commands.map((command) => command.id));
  const stageByNumber = new Map(catalog.stages.map((stage) => [stage.number, stage]));

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
  return validateCatalog({ stages, commands, challenges }, repoRoot);
}

export function contentRouteForLink(href: string, sourcePath: string): string {
  if (/^(?:[a-z]+:|\/\/|mailto:|tel:)/i.test(href) || href.startsWith("#")) return href;
  const cleanHref = href.split("#", 1)[0].split("?", 1)[0];
  if (!cleanHref.endsWith(".md")) return href;
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), cleanHref));
  const commandMatch = /^stages\/(\d{2}-[a-z0-9-]+)\/([a-z0-9-]+)\.(detailed|revision)\.md$/.exec(target);
  if (commandMatch) return "/commands/" + commandMatch[2] + "/" + commandMatch[3];
  const challengeMatch = /^challenges\/([a-z0-9-]+)\.md$/.exec(target);
  if (challengeMatch) return "/challenges/" + challengeMatch[1];
  const stageMatch = /^stages\/(\d{2}-[a-z0-9-]+)\/README\.md$/.exec(target);
  if (stageMatch) return "/paths/" + stageMatch[1];
  return href;
}

export function getRepositoryRoot(): string {
  return path.resolve(process.cwd(), "../..");
}
