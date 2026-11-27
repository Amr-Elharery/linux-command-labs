"use client";

import { useRef, useState } from "react";
import { Download, FileUp, RotateCcw, ShieldCheck } from "lucide-react";
import { useWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WorkspaceTools() {
  const { state, hydrated, status, importJson, exportJson, dispatch } = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const importFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    if (file.size > 1_000_000) {
      setError("Choose a progress file smaller than 1 MB.");
      return;
    }
    try {
      importJson(await file.text());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read that progress file.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
      <div>
        <h2 className="font-semibold tracking-tight">Your data, your device</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Progress and notes stay in this browser. Export a backup to move them to another browser; importing replaces the current workspace.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={!hydrated} onClick={exportJson}>
          <Download /> Export progress
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Choose a Linux Labs progress export"
          onChange={(event) => void importFile(event.target.files?.[0])}
        />
        <Button variant="outline" disabled={!hydrated} onClick={() => inputRef.current?.click()}>
          <FileUp /> Import progress
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={!hydrated} className="text-destructive hover:text-destructive">
              <RotateCcw /> Reset progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset this browser’s Linux Labs progress?</DialogTitle>
              <DialogDescription>
                This clears completed commands and challenges, bookmarks, notes, recent activity, challenge results, assessment attempts, and the selected theme from this browser. It does not change repository files.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Keep my progress</Button></DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={() => dispatch({ type: "reset" })}>Reset local progress</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {(error || status === "recovered" || status === "unsupported") && (
        <p role="alert" className="text-sm text-destructive">{error ?? "Some saved data could not be restored. Export any accessible data before resetting."}</p>
      )}
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
        No account, backend, or cloud synchronization is used.
        <span className="sr-only">{state.schemaVersion === 2 ? "Workspace schema version 2." : ""}</span>
      </p>
    </section>
  );
}
