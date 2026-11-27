"use client";

import { useEffect } from "react";
import { Bookmark, Check, Circle, NotebookPen } from "lucide-react";
import { useWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CommandActions({ id }: { id: string }) {
  const { state, dispatch, hydrated } = useWorkspace();
  const complete = state.completedCommands.includes(id);
  const bookmarked = state.bookmarks.includes(id);

  useEffect(() => {
    dispatch({ type: "visit-command", id });
  }, [dispatch, id]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={complete ? "secondary" : "default"}
        disabled={!hydrated}
        onClick={() => dispatch({ type: "toggle-command", id })}
        aria-pressed={complete}
      >
        {complete ? <Check /> : <Circle />}
        {complete ? "Completed" : "Mark complete"}
      </Button>
      <Button
        variant="outline"
        disabled={!hydrated}
        onClick={() => dispatch({ type: "toggle-bookmark", id })}
        aria-pressed={bookmarked}
      >
        <Bookmark className={bookmarked ? "fill-current text-primary" : ""} />
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
    </div>
  );
}

export function PersonalNote({ storageKey, title = "Personal notes" }: { storageKey: string; title?: string }) {
  const { state, dispatch, hydrated } = useWorkspace();
  return (
    <section className="rounded-2xl border border-border/70 bg-muted/35 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <NotebookPen className="size-4 text-primary" aria-hidden="true" />
        <label htmlFor={"note-" + storageKey} className="text-sm font-semibold">{title}</label>
        <span className="ml-auto text-[11px] text-muted-foreground">Saved on this device</span>
      </div>
      <Textarea
        id={"note-" + storageKey}
        value={state.notes[storageKey] ?? ""}
        onChange={(event) => dispatch({ type: "set-note", key: storageKey, note: event.target.value })}
        placeholder="Write a reminder or a question to revisit…"
        maxLength={20_000}
        disabled={!hydrated}
        className="min-h-28 resize-y border-border/70 bg-background"
      />
    </section>
  );
}
