"use client";

import Link from "next/link";
import { ArrowUpRight, BookmarkCheck, CheckCircle2 } from "lucide-react";
import type { Challenge } from "@/lib/content";
import { challengeHref } from "@/lib/routes";
import { useWorkspace } from "@/components/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const { state } = useWorkspace();
  const completed = state.completedChallenges.includes(challenge.id);
  const bookmarked = state.bookmarks.includes(challenge.id);
  return (
    <Card className="group h-full border-border/70 bg-card/85 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="rounded-full uppercase tracking-wide">{challenge.difficulty}</Badge>
          <div className="flex items-center gap-2 text-muted-foreground">
            {bookmarked && <BookmarkCheck className="size-4 text-primary" aria-label="Bookmarked" />}
            {completed && <CheckCircle2 className="size-4 text-primary" aria-label="Completed" />}
          </div>
        </div>
        <Link href={challengeHref(challenge.id)} className="mt-4 flex items-start justify-between gap-2 text-base font-semibold tracking-tight hover:text-primary">
          {challenge.title}<ArrowUpRight className="mt-0.5 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{challenge.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {challenge.prerequisites.slice(0, 5).map((item) => (
            <Badge key={item} variant="secondary" className="font-mono text-[10px]">{item}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
