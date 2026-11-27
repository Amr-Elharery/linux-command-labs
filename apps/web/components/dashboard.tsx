"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Command, Flame, Sparkles } from "lucide-react";
import type { Challenge, Command as CommandRecord, LearningStage } from "@/lib/content";
import { challengeHref, commandHref } from "@/lib/routes";
import { useWorkspace } from "@/components/workspace-provider";
import { ChallengeCard } from "@/components/challenge-card";
import { CommandCard } from "@/components/command-card";
import { ProgressOverview, StageProgressCard } from "@/components/progress-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Dashboard({
  stages,
  commands,
  challenges,
}: {
  stages: LearningStage[];
  commands: CommandRecord[];
  challenges: Challenge[];
}) {
  const { state, hydrated } = useWorkspace();
  const byId = new Map(commands.map((command) => [command.id, command]));
  const recent = state.recentlyViewed.map((item) => byId.get(item.commandId)).filter((item): item is CommandRecord => Boolean(item));
  const nextCommand = recent.find((command) => !state.completedCommands.includes(command.id))
    ?? commands.find((command) => !state.completedCommands.includes(command.id))
    ?? commands[0];
  const bookmarkedCommands = commands.filter((command) => state.bookmarks.includes(command.id)).slice(0, 3);
  const bookmarkedChallenges = challenges.filter((challenge) => state.bookmarks.includes(challenge.id)).slice(0, 2);
  const nextChallenge = challenges.find((challenge) => !state.completedChallenges.includes(challenge.id));

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#172c24] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="absolute -right-12 -top-14 size-64 rounded-full border border-white/10" />
          <div className="absolute -right-2 top-0 size-44 rounded-full border border-white/10" />
          <div className="absolute bottom-[-7rem] right-[28%] size-56 rounded-full bg-[#bbef67]/10 blur-3xl" />
          <div className="relative max-w-xl">
            <Badge className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/10">
              <Sparkles className="mr-1 size-3" /> PERSONAL LEARNING SPACE
            </Badge>
            <p className="mt-7 text-sm font-medium text-white/65">A little practice goes a long way.</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-[2.7rem]">
              Build your Linux<br className="hidden sm:block" /> instincts, one command at a time.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              Five stages of practical command-line work, powered by synthetic files you can safely explore.
            </p>
            {nextCommand && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild className="h-11 rounded-full bg-[#c7f27a] px-5 font-semibold text-[#172c24] hover:bg-[#d3fa8a]">
                  <Link href={commandHref(nextCommand.id)}>
                    {recent.length ? "Continue learning" : "Start learning"}
                    <ArrowRight />
                  </Link>
                </Button>
                <span className="text-xs text-white/60">Next up: <code className="font-mono text-white/90">{nextCommand.id}</code></span>
              </div>
            )}
          </div>
        </div>
        <ProgressOverview commands={commands} challenges={challenges} state={state} />
      </section>

      <section aria-labelledby="learning-path-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">The learning path</p>
            <h2 id="learning-path-heading" className="mt-1 text-xl font-semibold tracking-tight">Five stages. Thirty-one commands.</h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex">
            <Link href="/paths">All stages <ArrowRight /></Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {stages.map((stage) => (
            <StageProgressCard
              key={stage.slug}
              stage={stage}
              commands={commands.filter((command) => command.stage === stage.number)}
              state={state}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Pick up where you left off</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">Recently opened</h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/commands">Browse all <ArrowRight /></Link>
            </Button>
          </div>
          {recent.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {recent.slice(0, 4).map((command) => <CommandCard key={command.id} command={command} compact />)}
            </div>
          ) : (
            <Card className="border-dashed bg-card/50">
              <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center">
                <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary"><Command /></span>
                <div className="flex-1">
                  <h3 className="font-semibold">Your reading list is ready</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Open a command guide and it will show up here.</p>
                </div>
                <Button asChild variant="outline"><Link href="/commands">Explore commands</Link></Button>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-7">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Saved for later</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">Bookmarks</h2>
              </div>
              <Bookmark className="size-4 text-primary" aria-hidden="true" />
            </div>
            {bookmarkedCommands.length || bookmarkedChallenges.length ? (
              <div className="space-y-2">
                {bookmarkedCommands.map((command) => (
                  <Link key={command.id} href={commandHref(command.id)} className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm transition-colors hover:border-primary/30 hover:bg-muted/50">
                    <span><code className="mr-2 font-mono font-bold">{command.id}</code><span className="text-muted-foreground">{command.summary}</span></span>
                    <ArrowRight className="ml-3 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                ))}
                {bookmarkedChallenges.map((challenge) => (
                  <Link key={challenge.id} href={challengeHref(challenge.id)} className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm hover:border-primary/30">
                    <span className="font-medium">{challenge.title}</span><ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Bookmark commands or challenges to keep them close.</p>
            )}
          </div>
          {nextChallenge && (
            <Card className="border-primary/15 bg-primary/[0.035]">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-primary"><Flame className="size-4" /> Try a challenge</div>
                <Link href={challengeHref(nextChallenge.id)} className="mt-3 block font-semibold hover:text-primary">{nextChallenge.title}</Link>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{nextChallenge.summary}</p>
                <Button asChild variant="link" className="mt-2 h-auto p-0">
                  <Link href={challengeHref(nextChallenge.id)}>Open challenge <ArrowRight /></Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section aria-labelledby="featured-challenges-heading">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Practice with purpose</p>
            <h2 id="featured-challenges-heading" className="mt-1 text-xl font-semibold tracking-tight">Cumulative challenges</h2>
          </div>
          <Button asChild variant="ghost" size="sm"><Link href="/challenges">All challenges <ArrowRight /></Link></Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {challenges.slice(0, 3).map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
        </div>
      </section>
      {!hydrated && <span className="sr-only">Loading your saved progress…</span>}
    </div>
  );
}
