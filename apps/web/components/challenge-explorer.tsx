"use client";

import { useWorkspace } from "@/components/workspace-provider";
import type { Challenge, LearningStage } from "@/lib/content";
import { ChallengeCard } from "@/components/challenge-card";
import { Progress } from "@/components/ui/progress";

export function ChallengeExplorer({
  challenges,
  stages,
}: {
  challenges: Challenge[];
  stages: LearningStage[];
}) {
  const { state } = useWorkspace();
  const completed = challenges.filter((challenge) => state.completedChallenges.includes(challenge.id)).length;
  return (
    <div className="space-y-8">
      <div className="max-w-xl">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Your challenge progress</span>
          <span className="text-muted-foreground">{completed} of {challenges.length} complete</span>
        </div>
        <Progress value={challenges.length ? (completed / challenges.length) * 100 : 0} className="h-2" aria-label="Challenge completion" />
      </div>
      {stages.map((stage) => {
        const items = challenges.filter((challenge) => challenge.stage === stage.number);
        if (!items.length) return null;
        return (
          <section key={stage.number} aria-labelledby={"challenge-stage-" + stage.number}>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Stage {String(stage.number).padStart(2, "0")}</p>
                <h2 id={"challenge-stage-" + stage.number} className="mt-1 text-lg font-semibold tracking-tight">{stage.title}</h2>
              </div>
              <span className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? "challenge" : "challenges"}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
