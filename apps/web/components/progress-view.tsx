"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import type { Challenge, Command, LearningStage } from "@/lib/content";
import { stageHref } from "@/lib/routes";
import { calculateProgress, type WorkspaceState } from "@/lib/workspace";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProgressOverview({
  commands,
  challenges,
  state,
}: {
  commands: Command[];
  challenges: Challenge[];
  state: WorkspaceState;
}) {
  const progress = calculateProgress(commands, challenges, state);
  return (
    <Card className="overflow-hidden border-0 bg-primary text-primary-foreground shadow-xl shadow-primary/15">
      <CardContent className="relative p-6 sm:p-7">
        <div className="absolute -right-10 -top-16 size-48 rounded-full border border-primary-foreground/10" />
        <div className="absolute -right-1 -top-7 size-32 rounded-full border border-primary-foreground/10" />
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary-foreground/70">Your progress</p>
        <div className="relative mt-3 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-4xl font-bold tracking-tight">{progress.completedCommands}<span className="ml-1 text-xl text-primary-foreground/60">/ {progress.totalCommands}</span></p>
            <p className="mt-1 text-sm text-primary-foreground/75">commands completed</p>
          </div>
          <p className="font-mono text-3xl font-semibold">{progress.commandPercent}<span className="text-lg">%</span></p>
        </div>
        <Progress value={progress.commandPercent} className="mt-5 h-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground" aria-label="Course completion" />
        <div className="mt-5 flex items-center justify-between border-t border-primary-foreground/15 pt-4 text-xs text-primary-foreground/75">
          <span>{progress.stages.filter((stage) => stage.complete).length} of {progress.stages.length} stages complete</span>
          <span>{progress.completedChallenges}/{progress.totalChallenges} challenges</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StageProgressCard({
  stage,
  commands,
  state,
}: {
  stage: LearningStage;
  commands: Command[];
  state: WorkspaceState;
}) {
  const progress = calculateProgress(commands, [], state).stages.find((item) => item.stage === stage.number);
  const value = progress?.percent ?? 0;
  return (
    <Link href={stageHref(stage.slug)} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card className="h-full border-border/70 bg-card/80 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary font-mono text-xs font-bold text-primary">
                {String(stage.number).padStart(2, "0")}
              </span>
              <div>
                <CardTitle className="text-sm tracking-tight">{stage.title}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{commands.length} commands · {value}% complete</p>
              </div>
            </div>
            <ArrowRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={value} className="h-1.5" aria-label={stage.title + " progress"} />
          <div className="mt-3 flex items-center justify-between">
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{stage.description}</p>
            <span className="ml-3 shrink-0" aria-label={progress?.complete ? "Stage completed" : "Stage in progress"}>
              {progress?.complete
                ? <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                : <Circle className="size-4 text-border" aria-hidden="true" />}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function StageCommands({ commands }: { commands: Command[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {commands.map((command) => (
        <span key={command.id} className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
          {command.id}
        </span>
      ))}
    </div>
  );
}
