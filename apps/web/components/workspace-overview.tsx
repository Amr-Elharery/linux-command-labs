"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Bookmark, Clock3, FileText, Sparkles, Trophy } from "lucide-react";
import type { Challenge, Command, LearningStage } from "@/lib/content";
import { challengeHref, commandHref } from "@/lib/routes";
import { calculateProgress } from "@/lib/workspace";
import { useWorkspace } from "@/components/workspace-provider";
import { WorkspaceTools } from "@/components/workspace-tools";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function WorkspaceOverview({
  commands,
  challenges,
  stages,
}: {
  commands: Command[];
  challenges: Challenge[];
  stages: LearningStage[];
}) {
  const { state } = useWorkspace();
  const progress = calculateProgress(commands, challenges, state);
  const commandById = new Map(commands.map((command) => [command.id, command]));
  const challengeById = new Map(challenges.map((challenge) => [challenge.id, challenge]));
  const savedCommands = state.bookmarks.map((id) => commandById.get(id)).filter((item): item is Command => Boolean(item));
  const savedChallenges = state.bookmarks.map((id) => challengeById.get(id)).filter((item): item is Challenge => Boolean(item));
  const notes = Object.entries(state.notes).sort(([left], [right]) => left.localeCompare(right));

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Sparkles />} label="Commands complete" value={progress.completedCommands + "/" + progress.totalCommands} detail={progress.commandPercent + "% of the catalog"} />
        <StatCard icon={<Trophy />} label="Challenges complete" value={progress.completedChallenges + "/" + progress.totalChallenges} detail="Your practice milestones" />
        <StatCard icon={<Bookmark />} label="Saved items" value={String(state.bookmarks.length)} detail="Commands and challenges" />
        <StatCard icon={<FileText />} label="Personal notes" value={String(notes.length)} detail="Stored in this browser" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/70">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Learning journey</p>
                <h2 className="mt-1 text-lg font-semibold">Stage progress</h2>
              </div>
              <Badge variant="secondary" className="rounded-full">{progress.stages.filter((item) => item.complete).length}/{stages.length} complete</Badge>
            </div>
            <div className="space-y-4">
              {stages.map((stage) => {
                const item = progress.stages.find((entry) => entry.stage === stage.number);
                return (
                  <Link href={"/paths/" + stage.slug} key={stage.slug} className="block rounded-xl p-2 transition-colors hover:bg-muted/50">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">{stage.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">{item?.completed ?? 0}/{item?.total ?? 0}</span>
                    </div>
                    <Progress value={item?.percent ?? 0} className="h-1.5" aria-label={stage.title + " completion"} />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Recently opened</h2>
            </div>
            {state.recentlyViewed.length ? (
              <div className="space-y-2">
                {state.recentlyViewed.map((entry) => {
                  const command = commandById.get(entry.commandId);
                  if (!command) return null;
                  return (
                    <Link key={entry.commandId} href={commandHref(entry.commandId)} className="flex items-center justify-between rounded-xl border border-border/70 px-3.5 py-3 hover:bg-muted/50">
                      <span><code className="font-mono font-bold">{command.id}</code><span className="ml-2 text-xs text-muted-foreground">{command.summary}</span></span>
                      <ArrowRight className="ml-2 size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Command guides you open will be listed here.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Saved for later</p>
            <h2 className="mt-1 text-lg font-semibold">Bookmarks</h2>
          </div>
          <span className="text-xs text-muted-foreground">{savedCommands.length + savedChallenges.length} saved</span>
        </div>
        {savedCommands.length || savedChallenges.length ? (
          <div className="grid gap-2 md:grid-cols-2">
            {savedCommands.map((command) => (
              <Link key={command.id} href={commandHref(command.id)} className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 hover:border-primary/30">
                <span><code className="font-mono font-bold">{command.id}</code><span className="ml-2 text-sm text-muted-foreground">{command.summary}</span></span>
                <ArrowRight className="ml-3 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            ))}
            {savedChallenges.map((challenge) => (
              <Link key={challenge.id} href={challengeHref(challenge.id)} className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 hover:border-primary/30">
                <span className="font-medium">{challenge.title}</span><ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-dashed bg-transparent"><CardContent className="p-5 text-sm text-muted-foreground">Use the bookmark button on a guide or challenge to save it here.</CardContent></Card>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Private to this browser</p>
            <h2 className="mt-1 text-lg font-semibold">Your notes</h2>
          </div>
          <Badge variant="outline" className="rounded-full">{notes.length} saved</Badge>
        </div>
        {notes.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {notes.map(([key, note]) => {
              const [kind, id] = key.split(":", 2);
              const command = kind === "command" ? commandById.get(id) : undefined;
              const challenge = kind === "challenge" ? challengeById.get(id) : undefined;
              if (!command && !challenge) return null;
              const href = command ? commandHref(command.id) : challengeHref(challenge!.id);
              const label = command ? command.id : challenge!.title;
              return (
                <Link key={key} href={href} className="rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/30">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</span>
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{note}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed bg-transparent"><CardContent className="p-5 text-sm text-muted-foreground">Notes you add to command guides and challenges will appear here.</CardContent></Card>
        )}
      </section>

      {Object.keys(state.challengeResults).length > 0 && (
        <section>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Practice history</p>
            <h2 className="mt-1 text-lg font-semibold">Challenge results</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(state.challengeResults).map(([id, result]) => {
              const challenge = challengeById.get(id);
              if (!challenge) return null;
              return (
                <Link key={id} href={challengeHref(id)} className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 hover:border-primary/30">
                  <span className="font-medium">{challenge.title}<span className="ml-2 text-xs text-muted-foreground">{new Date(result.completedAt).toLocaleDateString()}</span></span>
                  <Badge variant="secondary">{result.score === null ? "Done" : result.score + "/100"}</Badge>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <WorkspaceTools />
    </div>
  );
}

function StatCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return (
    <Card className="border-border/70 bg-card/80">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">{icon}{label}</div>
        <p className="mt-3 font-mono text-2xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
