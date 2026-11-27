export const WORKSPACE_KEY = "linux-labs.workspace.v1";

export type Theme = "light" | "dark";
export type RecentCommand = { commandId: string; viewedAt: number };
export type ChallengeResult = { score: number | null; completedAt: string };

export type WorkspaceState = {
  schemaVersion: 1;
  completedCommands: string[];
  completedChallenges: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  recentlyViewed: RecentCommand[];
  challengeResults: Record<string, ChallengeResult>;
  theme: Theme;
};

export type WorkspaceReadStatus = "empty" | "loaded" | "migrated" | "recovered" | "unsupported";
export type WorkspaceRead = { state: WorkspaceState; status: WorkspaceReadStatus };
export type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type WorkspaceAction =
  | { type: "toggle-command"; id: string }
  | { type: "toggle-challenge"; id: string; completedAt?: string }
  | { type: "toggle-bookmark"; id: string }
  | { type: "set-note"; key: string; note: string }
  | { type: "visit-command"; id: string; viewedAt?: number }
  | { type: "set-theme"; theme: Theme }
  | { type: "set-challenge-result"; id: string; result: ChallengeResult }
  | { type: "reset" };

export function createEmptyWorkspace(): WorkspaceState {
  return {
    schemaVersion: 1,
    completedCommands: [],
    completedChallenges: [],
    bookmarks: [],
    notes: {},
    recentlyViewed: [],
    challengeResults: {},
    theme: "light",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function uniqueKnownIds(value: unknown, knownIds: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && knownIds.has(item)))];
}

function stringRecord(value: unknown, maxLength = 20_000): Record<string, string> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, item]) => key.length <= 200 && typeof item === "string" && item.length <= maxLength,
    ),
  ) as Record<string, string>;
}

function recentEntries(value: unknown, knownCommands: Set<string>): RecentCommand[] {
  if (!Array.isArray(value)) return [];
  const recent = value.flatMap((entry) => {
    if (!isRecord(entry) || typeof entry.commandId !== "string" || !knownCommands.has(entry.commandId)) return [];
    const viewedAt = typeof entry.viewedAt === "number" && Number.isFinite(entry.viewedAt)
      ? entry.viewedAt
      : 0;
    return [{ commandId: entry.commandId, viewedAt }];
  });
  return [...new Map(recent.map((entry) => [entry.commandId, entry])).values()]
    .sort((left, right) => right.viewedAt - left.viewedAt)
    .slice(0, 8);
}

function resultRecord(value: unknown, knownChallenges: Set<string>): Record<string, ChallengeResult> {
  if (!isRecord(value)) return {};
  const entries: [string, ChallengeResult][] = [];
  for (const [id, result] of Object.entries(value)) {
    if (!knownChallenges.has(id) || !isRecord(result)) continue;
    const score = result.score === null
      ? null
      : typeof result.score === "number" && Number.isFinite(result.score) && result.score >= 0 && result.score <= 100
        ? result.score
        : null;
    const completedAt = typeof result.completedAt === "string" && !Number.isNaN(Date.parse(result.completedAt))
      ? result.completedAt
      : "";
    if (completedAt) entries.push([id, { score, completedAt }]);
  }
  return Object.fromEntries(entries);
}

function normalizeWorkspace(
  input: Record<string, unknown>,
  commandIds: Set<string>,
  challengeIds: Set<string>,
): WorkspaceState {
  const completedCommands = uniqueKnownIds(input.completedCommands, commandIds);
  const completedChallenges = uniqueKnownIds(input.completedChallenges, challengeIds);
  const bookmarks = uniqueKnownIds(input.bookmarks, new Set([...commandIds, ...challengeIds]));
  const theme = input.theme === "dark" ? "dark" : "light";
  return {
    schemaVersion: 1,
    completedCommands,
    completedChallenges,
    bookmarks,
    notes: stringRecord(input.notes),
    recentlyViewed: recentEntries(input.recentlyViewed, commandIds),
    challengeResults: resultRecord(input.challengeResults, challengeIds),
    theme,
  };
}

function migrateLegacyWorkspace(
  input: Record<string, unknown>,
  commandIds: Set<string>,
  challengeIds: Set<string>,
): WorkspaceState {
  const combined = Array.isArray(input.completedItems) ? input.completedItems : [];
  const completedCommands = combined.filter(
    (id): id is string => typeof id === "string" && commandIds.has(id),
  );
  const completedChallenges = combined.filter(
    (id): id is string => typeof id === "string" && challengeIds.has(id),
  );
  return normalizeWorkspace(
    { ...input, completedCommands, completedChallenges },
    commandIds,
    challengeIds,
  );
}

export function decodeWorkspace(
  json: string,
  commandIds: Iterable<string>,
  challengeIds: Iterable<string>,
): WorkspaceRead {
  const commands = new Set(commandIds);
  const challenges = new Set(challengeIds);
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return { state: createEmptyWorkspace(), status: "recovered" };
  }
  if (!isRecord(value)) return { state: createEmptyWorkspace(), status: "recovered" };

  const version = typeof value.schemaVersion === "number" ? value.schemaVersion : 0;
  if (version > 1) return { state: createEmptyWorkspace(), status: "unsupported" };
  if (version < 1) {
    return { state: migrateLegacyWorkspace(value, commands, challenges), status: "migrated" };
  }

  const state = normalizeWorkspace(value, commands, challenges);
  const shapeIsValid =
    Array.isArray(value.completedCommands) &&
    Array.isArray(value.completedChallenges) &&
    Array.isArray(value.bookmarks) &&
    isRecord(value.notes) &&
    Array.isArray(value.recentlyViewed) &&
    isRecord(value.challengeResults) &&
    (value.theme === "light" || value.theme === "dark");
  return { state, status: shapeIsValid ? "loaded" : "recovered" };
}

export function readWorkspace(
  storage: StoragePort,
  commandIds: Iterable<string>,
  challengeIds: Iterable<string>,
): WorkspaceRead {
  let stored: string | null;
  try {
    stored = storage.getItem(WORKSPACE_KEY);
  } catch {
    return { state: createEmptyWorkspace(), status: "recovered" };
  }
  return stored === null
    ? { state: createEmptyWorkspace(), status: "empty" }
    : decodeWorkspace(stored, commandIds, challengeIds);
}

export function writeWorkspace(storage: StoragePort, state: WorkspaceState): boolean {
  try {
    storage.setItem(WORKSPACE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function reduceWorkspace(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case "toggle-command":
      return { ...state, completedCommands: toggle(state.completedCommands, action.id) };
    case "toggle-challenge": {
      const completing = !state.completedChallenges.includes(action.id);
      const completedChallenges = toggle(state.completedChallenges, action.id);
      const challengeResults = { ...state.challengeResults };
      if (completing) {
        challengeResults[action.id] ??= { score: null, completedAt: action.completedAt ?? new Date().toISOString() };
      } else {
        delete challengeResults[action.id];
      }
      return { ...state, completedChallenges, challengeResults };
    }
    case "toggle-bookmark":
      return { ...state, bookmarks: toggle(state.bookmarks, action.id) };
    case "set-note": {
      const notes = { ...state.notes };
      if (action.note.trim()) notes[action.key] = action.note.slice(0, 20_000);
      else delete notes[action.key];
      return { ...state, notes };
    }
    case "visit-command": {
      const recentlyViewed = [
        { commandId: action.id, viewedAt: action.viewedAt ?? Date.now() },
        ...state.recentlyViewed.filter((item) => item.commandId !== action.id),
      ].slice(0, 8);
      return { ...state, recentlyViewed };
    }
    case "set-theme":
      return { ...state, theme: action.theme };
    case "set-challenge-result":
      return {
        ...state,
        challengeResults: { ...state.challengeResults, [action.id]: action.result },
      };
    case "reset":
      return createEmptyWorkspace();
  }
}

export function calculateProgress(
  commands: Array<{ id: string; stage: number }>,
  challenges: Array<{ id: string }>,
  state: WorkspaceState,
) {
  const completed = new Set(state.completedCommands);
  const completedChallengeIds = new Set(state.completedChallenges);
  const stageNumbers = [...new Set(commands.map((command) => command.stage))].sort((a, b) => a - b);
  return {
    completedCommands: commands.filter((command) => completed.has(command.id)).length,
    totalCommands: commands.length,
    commandPercent: commands.length
      ? Math.round((commands.filter((command) => completed.has(command.id)).length / commands.length) * 100)
      : 0,
    completedChallenges: challenges.filter((challenge) => completedChallengeIds.has(challenge.id)).length,
    totalChallenges: challenges.length,
    stages: stageNumbers.map((stage) => {
      const stageCommands = commands.filter((command) => command.stage === stage);
      const done = stageCommands.filter((command) => completed.has(command.id)).length;
      return {
        stage,
        completed: done,
        total: stageCommands.length,
        percent: stageCommands.length ? Math.round((done / stageCommands.length) * 100) : 0,
        complete: stageCommands.length > 0 && done === stageCommands.length,
      };
    }),
  };
}

export function serializeWorkspace(state: WorkspaceState): string {
  return JSON.stringify(state, null, 2);
}

export function createWorkspaceExportName(date = new Date()): string {
  return "linux-labs-progress-" + date.toISOString().slice(0, 10) + ".json";
}
