"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Command } from "@/lib/content";
import { useWorkspace } from "@/components/workspace-provider";
import { CommandCard } from "@/components/command-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function CommandExplorer({
  commands,
  stages,
}: {
  commands: Command[];
  stages: Array<{ number: number; title: string }>;
}) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const { state } = useWorkspace();
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return commands.filter((command) => {
      const matchesStage = stage === "all" || command.stage === Number(stage);
      const searchable = [
        command.id,
        command.title,
        command.summary,
        command.category,
        ...command.tags,
        ...command.related,
      ].join(" ").toLowerCase();
      return matchesStage && (!term || searchable.includes(term));
    });
  }, [commands, query, stage]);
  const completedCount = commands.filter((command) => state.completedCommands.includes(command.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 p-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Search commands</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands, concepts, or tags…"
            className="h-11 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl bg-muted/70 px-3">
          <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Filter by stage</span>
          <select
            value={stage}
            onChange={(event) => setStage(event.target.value)}
            className="h-11 min-w-40 bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All learning stages</option>
            {stages.map((item) => <option key={item.number} value={item.number}>Stage {String(item.number).padStart(2, "0")} · {item.title}</option>)}
          </select>
        </label>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filtered.length} of {commands.length} commands</span>
        <Badge variant="secondary" className="rounded-full">{completedCount} completed</Badge>
      </div>
      {filtered.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((command) => <CommandCard key={command.id} command={command} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Search className="mx-auto size-7 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 font-semibold">No command matches that search</p>
          <p className="mt-1 text-sm text-muted-foreground">Try another name, topic, stage, or tag.</p>
        </div>
      )}
    </div>
  );
}
