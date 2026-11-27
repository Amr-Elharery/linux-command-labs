import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  contentRouteForLink,
  loadCatalog,
  parseCheatSheetDocument,
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
  it("discovers paired commands, challenges, and one complete cheat sheet per stage", () => {
    const catalog = loadCatalog(path.resolve(process.cwd(), "../.."));
    expect(catalog.commands).toHaveLength(31);
    expect(catalog.challenges).toHaveLength(9);
    expect(catalog.stages).toHaveLength(5);
    expect(catalog.cheatsheets).toHaveLength(5);
    expect(catalog.cheatsheets.map((sheet) => sheet.stage)).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(catalog.cheatsheets.flatMap((sheet) => sheet.commands)).size).toBe(31);
    for (const command of catalog.commands) {
      expect(command.guides.detailed.mode).toBe("detailed");
      expect(command.guides.revision.mode).toBe("revision");
      expect(command.guides.detailed.id).toBe(command.guides.revision.id);
    }
    expect(catalog.challenges.find((item) => item.id === "directory-organization")?.body)
      .toContain("<details>");
  });

  it("rejects cheat sheets without required metadata or sections", () => {
    expect(() => parseCheatSheetDocument(
      "---\nid: 01-file-system\ntype: cheatsheet\n---\n# Incomplete\n",
      "content/cheatsheets/01-file-system.md",
    )).toThrow("content/cheatsheets/01-file-system.md");
    expect(() => parseCheatSheetDocument([
      "---", "id: 01-file-system", 'title: "File System Operations Cheat Sheet"',
      "type: cheatsheet", "stage: 1", 'summary: "Quick reference."',
      "commands: [ls]", "---", "", "# Incomplete", "",
    ].join("\n"), "content/cheatsheets/01-file-system.md")).toThrow(/missing required sections/);
  });

  it("rejects cheat sheet links outside content and unknown command references", () => {
    const catalog = loadCatalog(path.resolve(process.cwd(), "../.."));
    const first = catalog.cheatsheets[0];
    expect(() => validateCatalog({
      ...catalog,
      cheatsheets: [{ ...first, body: first.body.replace("../stages/01-file-system/ls.detailed.md", "../../README.md") }],
    }, path.resolve(process.cwd(), "../.."))).toThrow(/out-of-content local link/);
    expect(() => validateCatalog({
      ...catalog,
      cheatsheets: [{ ...first, commands: ["unknown-command", ...first.commands.slice(1)] }],
    }, path.resolve(process.cwd(), "../.."))).toThrow(/unknown command reference/);
  });

  it("requires complete cheat sheet stage coverage", () => {
    const catalog = loadCatalog(path.resolve(process.cwd(), "../.."));
    expect(() => validateCatalog({ ...catalog, cheatsheets: catalog.cheatsheets.slice(1) }, path.resolve(process.cwd(), "../..")))
      .toThrow(/missing cheat sheet for stage 1/);
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
    expect(contentRouteForLink(
      "../stages/01-file-system/ls.detailed.md",
      "content/cheatsheets/01-file-system.md",
    )).toBe("/commands/ls/detailed");
    expect(contentRouteForLink(
      "../../cheatsheets/01-file-system.md",
      "content/stages/02-file-content/README.md",
    )).toBe("/cheatsheets/01-file-system");
  });
});
