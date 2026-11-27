import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  contentRouteForLink,
  loadCatalog,
  parseCommandDocument,
  validateCatalog,
} from "@/lib/content";

const temporaryRoots: string[] = [];
const commandSource = (mode: "detailed" | "revision") => [
  "---",
  "id: ls",
  'title: "ls"',
  "type: command",
  "stage: 1",
  "category: file-system",
  "mode: " + mode,
  "difficulty: beginner",
  'summary: "List files."',
  "tags: [files]",
  "related: [pwd]",
  "---",
  "",
  "# ls",
].join("\n");

function temporaryRepository() {
  const root = mkdtempSync(path.join(os.tmpdir(), "linux-labs-content-"));
  temporaryRoots.push(root);
  mkdirSync(path.join(root, "content/stages/01-file-system"), { recursive: true });
  mkdirSync(path.join(root, "content/challenges"), { recursive: true });
  mkdirSync(path.join(root, "playground"), { recursive: true });
  writeFileSync(
    path.join(root, "content/stages/01-file-system/README.md"),
    "# Stage 01 — File System Operations\n\nInspect files and folders.\n",
  );
  return root;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("repository content discovery", () => {
  it("discovers all paired commands, stages, and challenge Markdown", () => {
    const catalog = loadCatalog(path.resolve(process.cwd(), "../.."));
    expect(catalog.commands).toHaveLength(31);
    expect(catalog.challenges).toHaveLength(9);
    expect(catalog.stages).toHaveLength(5);
    for (const command of catalog.commands) {
      expect(command.guides.detailed.mode).toBe("detailed");
      expect(command.guides.revision.mode).toBe("revision");
      expect(command.guides.detailed.id).toBe(command.guides.revision.id);
    }
    expect(catalog.challenges.find((item) => item.id === "directory-organization")?.body)
      .toContain("<details>");
  });

  it("reports malformed frontmatter with its source path", () => {
    expect(() => parseCommandDocument("---\nid: ls\n---\n", "content/stages/01-file-system/ls.detailed.md"))
      .toThrow("content/stages/01-file-system/ls.detailed.md");
  });

  it("rejects a missing Detailed/Revision companion instead of skipping the command", () => {
    const root = temporaryRepository();
    writeFileSync(path.join(root, "content/stages/01-file-system/ls.detailed.md"), commandSource("detailed"));
    expect(() => loadCatalog(root)).toThrow(/command ls: missing its Detailed or Revision companion page/);
  });

  it("validates related command references after catalog discovery", () => {
    const catalog = loadCatalog(path.resolve(process.cwd(), "../.."));
    const commands = catalog.commands.map((command) =>
      command.id === "ls" ? { ...command, related: ["not-a-real-command"] } : command,
    );
    expect(() => validateCatalog({ ...catalog, commands }, path.resolve(process.cwd(), "../..")))
      .toThrow(/unknown related command not-a-real-command/);
  });
});

describe("Markdown navigation mapping", () => {
  it("maps relative Markdown links to the app's stable routes", () => {
    expect(contentRouteForLink(
      "./wc.revision.md",
      "stages/04-text-processing/grep.detailed.md",
    )).toBe("/commands/wc/revision");
    expect(contentRouteForLink(
      "../../challenges/log-inspection.md",
      "stages/02-file-content/tail.detailed.md",
    )).toBe("/challenges/log-inspection");
    expect(contentRouteForLink(
      "../01-file-system/README.md",
      "stages/02-file-content/cat.detailed.md",
    )).toBe("/paths/01-file-system");
    expect(contentRouteForLink("https://example.com/reference", "challenges/log-inspection.md"))
      .toBe("https://example.com/reference");
  });
});
