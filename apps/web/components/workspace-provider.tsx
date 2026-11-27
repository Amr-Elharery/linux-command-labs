"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  WORKSPACE_KEY,
  createEmptyWorkspace,
  decodeWorkspace,
  readWorkspace,
  reduceWorkspace,
  serializeWorkspace,
  writeWorkspace,
  type StoragePort,
  type Theme,
  type WorkspaceAction,
  type WorkspaceReadStatus,
  type WorkspaceState,
} from "@/lib/workspace";

type WorkspaceContextValue = {
  state: WorkspaceState;
  hydrated: boolean;
  notice: string | null;
  status: WorkspaceReadStatus;
  dispatch: (action: WorkspaceAction) => void;
  importJson: (json: string) => void;
  exportJson: () => void;
  clearNotice: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function getBrowserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function statusMessage(status: WorkspaceReadStatus): string | null {
  if (status === "migrated") return "Your saved progress was upgraded to the current local format.";
  if (status === "recovered") return "Saved data could not be read. The workspace opened with safe defaults; export/import or reset is available.";
  if (status === "unsupported") return "Saved data uses a newer format this version cannot read. It has not been overwritten.";
  return null;
}

export function WorkspaceProvider({
  children,
  commandIds,
  challengeIds,
  assessmentTaskIds,
  assessmentSectionIds,
}: {
  children: ReactNode;
  commandIds: string[];
  challengeIds: string[];
  assessmentTaskIds: string[];
  assessmentSectionIds: string[];
}) {
  const [state, setState] = useState<WorkspaceState>(createEmptyWorkspace);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<WorkspaceReadStatus>("empty");
  const [notice, setNotice] = useState<string | null>(null);
  const shouldPersist = useRef(false);

  useEffect(() => {
    const storage = getBrowserStorage();
    if (!storage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- report a storage environment failure after browser hydration
      setStatus("recovered");
      setNotice("Browser storage is unavailable. Changes will last only until this tab closes.");
      setHydrated(true);
      return;
    }
    const saved = readWorkspace(storage, commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds);
    setState(saved.state);
    setStatus(saved.status);
    setNotice(statusMessage(saved.status));
    shouldPersist.current = saved.status === "empty" || saved.status === "loaded" || saved.status === "migrated";
    setHydrated(true);
  }, [commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds]);

  useEffect(() => {
    if (!hydrated || !shouldPersist.current) return;
    const storage = getBrowserStorage();
    if (!storage || !writeWorkspace(storage, state)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- report a failed localStorage synchronization
      setNotice("The browser could not save this workspace. Your changes remain available in this tab.");
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme, hydrated]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== WORKSPACE_KEY) return;
      if (event.newValue === null) {
        shouldPersist.current = false;
        setState(createEmptyWorkspace());
        setStatus("empty");
        setNotice(null);
        return;
      }
      const saved = decodeWorkspace(event.newValue, commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds);
      shouldPersist.current = saved.status === "loaded" || saved.status === "migrated";
      setState(saved.state);
      setStatus(saved.status);
      setNotice(statusMessage(saved.status));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds]);

  const dispatch = useCallback((action: WorkspaceAction) => {
    if (!hydrated) return;
    shouldPersist.current = true;
    setState((current) => reduceWorkspace(current, action));
  }, [hydrated]);

  const importJson = useCallback((json: string) => {
    const imported = decodeWorkspace(json, commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds);
    if (imported.status === "recovered" || imported.status === "unsupported") {
      throw new Error("That file is not a supported Linux Labs progress export.");
    }
    shouldPersist.current = true;
    setState(imported.state);
    setStatus(imported.status);
    setNotice(imported.status === "migrated" ? statusMessage("migrated") : "Progress imported into this browser.");
  }, [commandIds, challengeIds, assessmentTaskIds, assessmentSectionIds]);

  const exportJson = useCallback(() => {
    const blob = new Blob([serializeWorkspace(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "linux-labs-progress-" + new Date().toISOString().slice(0, 10) + ".json";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const clearNotice = useCallback(() => setNotice(null), []);
  const value = useMemo(
    () => ({ state, hydrated, notice, status, dispatch, importJson, exportJson, clearNotice }),
    [state, hydrated, notice, status, dispatch, importJson, exportJson, clearNotice],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return context;
}

export function useSetTheme() {
  const { state, dispatch } = useWorkspace();
  return {
    theme: state.theme,
    setTheme: (theme: Theme) => dispatch({ type: "set-theme", theme }),
  };
}
