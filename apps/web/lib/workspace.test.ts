import { describe, expect, it } from "vitest";
import {
  WORKSPACE_KEY,
  calculateProgress,
  createEmptyWorkspace,
  decodeWorkspace,
  readWorkspace,
  reduceWorkspace,
  writeWorkspace,
  type StoragePort,
} from "@/lib/workspace";
import { challengeHref, commandHref, stageHref } from "@/lib/routes";

class MemoryStorage implements StoragePort {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const commandIds = ["ls", "pwd"];
const challengeIds = ["directory-organization"];
const assessmentTaskIds = ["a-which", "b-organize"];
const assessmentSectionIds = ["fundamentals", "filesystem"];

describe("workspace persistence", () => {
  it("starts empty, saves, and reloads versioned LocalStorage data", () => {
    const storage = new MemoryStorage();
    const initial = readWorkspace(storage, commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds);
    expect(initial.status).toBe("empty");
    const changed = reduceWorkspace(initial.state, { type: "toggle-command", id: "ls" });
    expect(writeWorkspace(storage, changed)).toBe(true);
    expect(storage.getItem(WORKSPACE_KEY)).toContain('"schemaVersion":2');
    const loaded = readWorkspace(storage, commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds);
    expect(loaded.status).toBe("loaded");
    expect(loaded.state.completedCommands).toEqual(["ls"]);
  });

  it("recovers safely from corrupted or unsupported values", () => {
    const corrupted = decodeWorkspace("{broken", commandIds, challengeIds);
    expect(corrupted.status).toBe("recovered");
    expect(corrupted.state).toEqual(createEmptyWorkspace());
    const newer = decodeWorkspace('{"schemaVersion":99}', commandIds, challengeIds);
    expect(newer.status).toBe("unsupported");
    expect(newer.state).toEqual(createEmptyWorkspace());
  });

  it("migrates old completedItems and filters unknown IDs", () => {
    const result = decodeWorkspace(
      JSON.stringify({ completedItems: ["ls", "directory-organization", "not-a-command"], bookmarks: ["pwd"] }),
      commandIds,
      challengeIds,
    );
    expect(result.status).toBe("migrated");
    expect(result.state.completedCommands).toEqual(["ls"]);
    expect(result.state.completedChallenges).toEqual(["directory-organization"]);
    expect(result.state.bookmarks).toEqual(["pwd"]);
  });

  it("upgrades existing version 1 workspace without losing user data", () => {
    const result = decodeWorkspace(JSON.stringify({
      schemaVersion: 1,
      completedCommands: ["ls"],
      completedChallenges: ["directory-organization"],
      bookmarks: ["pwd"],
      notes: { "command:ls": "review options" },
      recentlyViewed: [{ commandId: "pwd", viewedAt: 100 }],
      challengeResults: { "directory-organization": { score: 90, completedAt: "2026-11-27T10:00:00.000Z" } },
      theme: "dark",
    }), commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds);
    expect(result.status).toBe("migrated");
    expect(result.state.schemaVersion).toBe(2);
    expect(result.state).toMatchObject({
      completedCommands: ["ls"],
      completedChallenges: ["directory-organization"],
      bookmarks: ["pwd"],
      notes: { "command:ls": "review options" },
      recentlyViewed: [{ commandId: "pwd", viewedAt: 100 }],
      theme: "dark",
      assessmentAttempts: [],
    });
    expect(result.state.challengeResults["directory-organization"].score).toBe(90);
  });

  it("drops invalid entries but keeps valid data", () => {
    const result = decodeWorkspace(
      JSON.stringify({
        schemaVersion: 2,
        completedCommands: ["ls", "unknown", "ls"],
        completedChallenges: [],
        bookmarks: ["directory-organization", "missing"],
        notes: { "command:ls": "review flags", broken: 12 },
        recentlyViewed: [{ commandId: "pwd", viewedAt: 20 }, { commandId: "lost", viewedAt: 30 }],
        challengeResults: {
          "directory-organization": { score: 80, completedAt: "2026-11-27T10:00:00.000Z" },
        },
        assessmentAttempts: [],
        theme: "dark",
      }),
      commandIds,
      challengeIds,
    );
    expect(result.status).toBe("loaded");
    expect(result.state.completedCommands).toEqual(["ls"]);
    expect(result.state.notes).toEqual({ "command:ls": "review flags" });
    expect(result.state.recentlyViewed).toEqual([{ commandId: "pwd", viewedAt: 20 }]);
    expect(result.state.theme).toBe("dark");
  });
});

describe("workspace actions and progress", () => {
  it("toggles bookmarks, records notes, completions, recent commands, and challenge results", () => {
    let state = createEmptyWorkspace();
    state = reduceWorkspace(state, { type: "toggle-bookmark", id: "ls" });
    state = reduceWorkspace(state, { type: "set-note", key: "command:ls", note: "Try -la" });
    state = reduceWorkspace(state, { type: "visit-command", id: "ls", viewedAt: 42 });
    state = reduceWorkspace(state, {
      type: "toggle-challenge",
      id: "directory-organization",
      completedAt: "2026-11-27T10:00:00.000Z",
    });
    state = reduceWorkspace(state, {
      type: "set-challenge-result",
      id: "directory-organization",
      result: { score: 95, completedAt: "2026-11-27T10:01:00.000Z" },
    });
    expect(state.bookmarks).toEqual(["ls"]);
    expect(state.notes["command:ls"]).toBe("Try -la");
    expect(state.recentlyViewed[0]).toEqual({ commandId: "ls", viewedAt: 42 });
    expect(state.completedChallenges).toEqual(["directory-organization"]);
    expect(state.challengeResults["directory-organization"].score).toBe(95);
  });

  it("calculates command and stage progress from user state", () => {
    let state = createEmptyWorkspace();
    state = reduceWorkspace(state, { type: "toggle-command", id: "ls" });
    state = reduceWorkspace(state, { type: "toggle-command", id: "pwd" });
    const progress = calculateProgress(
      [{ id: "ls", stage: 1 }, { id: "pwd", stage: 1 }, { id: "find", stage: 3 }],
      [{ id: "directory-organization" }],
      state,
    );
    expect(progress.completedCommands).toBe(2);
    expect(progress.commandPercent).toBe(67);
    expect(progress.stages[0]).toMatchObject({ completed: 2, total: 2, percent: 100, complete: true });
    expect(progress.stages[1]).toMatchObject({ completed: 0, total: 1, complete: false });
  });

  it("resets all personal workspace state", () => {
    const changed = reduceWorkspace(
      { ...createEmptyWorkspace(), bookmarks: ["ls"], notes: { "command:ls": "note" } },
      { type: "reset" },
    );
    expect(changed).toEqual(createEmptyWorkspace());
  });

  it("persists interrupted attempts and retains repeated completed attempts", () => {
    const storage = new MemoryStorage();
    const draft = {
      id: "assessment-draft-1",
      status: "in_progress" as const,
      startedAt: "2026-11-27T10:00:00.000Z",
      updatedAt: "2026-11-27T10:01:00.000Z",
      completedAt: null,
      responses: { "a-which": { answer: "which", submitted: true, correct: true, checkedCriteria: [], completedAt: "2026-11-27T10:01:00.000Z" } },
      score: null,
      passed: null,
      sectionScores: {},
    };
    let state = reduceWorkspace(createEmptyWorkspace(), { type: "save-assessment-attempt", attempt: draft });
    expect(writeWorkspace(storage, state)).toBe(true);
    const loaded = readWorkspace(storage, commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds);
    expect(loaded.state.assessmentAttempts[0]).toMatchObject({ id: draft.id, status: "in_progress", responses: draft.responses });
    const completed = { ...draft, status: "completed" as const, completedAt: "2026-11-27T10:02:00.000Z", updatedAt: "2026-11-27T10:02:00.000Z", score: 80, passed: true, sectionScores: { fundamentals: 10 } };
    state = reduceWorkspace(loaded.state, { type: "save-assessment-attempt", attempt: completed });
    state = reduceWorkspace(state, { type: "save-assessment-attempt", attempt: { ...completed, id: "assessment-draft-2", startedAt: "2026-11-28T10:00:00.000Z", updatedAt: "2026-11-28T10:00:00.000Z" } });
    expect(state.assessmentAttempts.map((attempt) => attempt.id)).toEqual(["assessment-draft-2", "assessment-draft-1"]);
    for (let index = 3; index <= 12; index += 1) {
      const timestamp = new Date(Date.UTC(2026, 11, index, 10)).toISOString();
      state = reduceWorkspace(state, {
        type: "save-assessment-attempt",
        attempt: { ...completed, id: "assessment-draft-" + index, startedAt: timestamp, updatedAt: timestamp },
      });
    }
    expect(state.assessmentAttempts).toHaveLength(10);
    expect(state.assessmentAttempts[0].id).toBe("assessment-draft-12");
  });

  it("drops malformed and unknown assessment data while preserving valid workspace fields", () => {
    const result = decodeWorkspace(JSON.stringify({
      schemaVersion: 2,
      completedCommands: ["ls"], completedChallenges: [], bookmarks: [], notes: {}, recentlyViewed: [], challengeResults: {}, theme: "light",
      assessmentAttempts: [
        { id: "bad", status: "completed", startedAt: "yesterday", updatedAt: "yesterday", completedAt: "yesterday", responses: {}, score: 900, passed: true, sectionScores: {} },
        { id: "assessment-ok", status: "in_progress", startedAt: "2026-11-27T10:00:00.000Z", updatedAt: "2026-11-27T10:01:00.000Z", completedAt: null, responses: { "not-a-task": { answer: "x", submitted: true, correct: true, checkedCriteria: [], completedAt: null } }, score: null, passed: null, sectionScores: { "not-a-section": 80 } },
      ],
    }), commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds);
    expect(result.state.completedCommands).toEqual(["ls"]);
    expect(result.status).toBe("recovered");
    expect(result.state.assessmentAttempts).toHaveLength(1);
    expect(result.state.assessmentAttempts[0]).toMatchObject({ responses: {}, sectionScores: {} });
  });
});

describe("stable navigation helpers", () => {
  it("builds explicit mode, challenge, and stage routes from stable IDs", () => {
    expect(commandHref("grep", "revision")).toBe("/commands/grep/revision");
    expect(commandHref("top")).toBe("/commands/top/detailed");
    expect(challengeHref("disk-usage-detective")).toBe("/challenges/disk-usage-detective");
    expect(stageHref("01-file-system")).toBe("/paths/01-file-system");
  });
});
