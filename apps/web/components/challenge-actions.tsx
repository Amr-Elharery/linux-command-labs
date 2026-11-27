"use client";

import { useState } from "react";
import { Bookmark, Check, Circle, Trophy } from "lucide-react";
import { useWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChallengeActions({ id }: { id: string }) {
  const { state, dispatch, hydrated } = useWorkspace();
  const completed = state.completedChallenges.includes(id);
  const bookmarked = state.bookmarks.includes(id);
  const result = state.challengeResults[id];
  const [score, setScore] = useState(result?.score?.toString() ?? "");

  const saveScore = () => {
    const value = score.trim() === "" ? null : Number(score);
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > 100)) return;
    dispatch({
      type: "set-challenge-result",
      id,
      result: { score: value, completedAt: result?.completedAt ?? new Date().toISOString() },
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/35 p-4 sm:p-5">
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={!hydrated}
          variant={completed ? "secondary" : "default"}
          onClick={() => dispatch({ type: "toggle-challenge", id })}
          aria-pressed={completed}
        >
          {completed ? <Check /> : <Circle />}
          {completed ? "Challenge complete" : "Mark challenge complete"}
        </Button>
        <Button
          disabled={!hydrated}
          variant="outline"
          onClick={() => dispatch({ type: "toggle-bookmark", id })}
          aria-pressed={bookmarked}
        >
          <Bookmark className={bookmarked ? "fill-current text-primary" : ""} />
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
      </div>
      <div className="flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={"score-" + id} className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Trophy className="size-3.5 text-primary" aria-hidden="true" />
            Optional self-score (0–100)
          </label>
          <Input
            id={"score-" + id}
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(event) => setScore(event.target.value)}
            disabled={!hydrated}
            className="max-w-40 bg-background"
          />
        </div>
        <Button variant="outline" disabled={!hydrated} onClick={saveScore}>Save result</Button>
        {result?.completedAt && (
          <span className="pb-2 text-xs text-muted-foreground">
            Last recorded {new Date(result.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
