"use client";

import Link from "next/link";
import { ArrowUpRight, Bookmark, Check } from "lucide-react";
import type { Command } from "@/lib/content";
import { commandHref } from "@/lib/routes";
import { useWorkspace } from "@/components/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CommandCard({ command, compact = false }: { command: Command; compact?: boolean }) {
  const { state, dispatch } = useWorkspace();
  const bookmarked = state.bookmarks.includes(command.id);
  const completed = state.completedCommands.includes(command.id);
  return (
    <Card className="group h-full border-border/70 bg-card/85 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={commandHref(command.id)} className="inline-flex items-center gap-2 font-mono text-lg font-bold tracking-tight text-foreground hover:text-primary">
              {command.id}<ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </Link>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{command.summary}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-primary"
            aria-label={(bookmarked ? "Remove bookmark for " : "Bookmark ") + command.id}
            aria-pressed={bookmarked}
            onClick={() => dispatch({ type: "toggle-bookmark", id: command.id })}
          >
            <Bookmark className={bookmarked ? "fill-current text-primary" : ""} aria-hidden="true" />
          </Button>
        </div>
        {!compact && (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            <Badge variant="secondary" className="rounded-full font-mono text-[11px]">Stage {String(command.stage).padStart(2, "0")}</Badge>
            {command.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full text-[11px] font-normal">{tag}</Badge>
            ))}
            {completed && <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary"><Check className="size-3.5" /> Done</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
