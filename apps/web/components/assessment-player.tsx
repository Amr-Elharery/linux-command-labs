"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, CircleHelp, LockKeyhole, RotateCcw } from "lucide-react";
import type { Assessment, AssessmentSection, AssessmentTask } from "@/lib/assessment";
import { checkAssessmentAnswer, getAssessmentTasks, scoreAssessmentResponses } from "@/lib/assessment";
import type { AssessmentAttempt, AssessmentResponse } from "@/lib/workspace";
import { useWorkspace } from "@/components/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const emptyResponse = (): AssessmentResponse => ({
  answer: "",
  submitted: false,
  correct: null,
  checkedCriteria: [],
  completedAt: null,
});

export function AssessmentPlayer({ assessment, initialAttemptId }: { assessment: Assessment; initialAttemptId?: string }) {
  const { state, dispatch, hydrated } = useWorkspace();
  const allTasks = useMemo(() => getAssessmentTasks(assessment), [assessment]);
  const activeAttempt = state.assessmentAttempts.find((attempt) => attempt.status === "in_progress");
  const [viewAttemptId, setViewAttemptId] = useState<string | null>(initialAttemptId ?? null);
  const attempt = state.assessmentAttempts.find((item) => item.id === viewAttemptId)
    ?? activeAttempt
    ?? null;
  const [activeSectionId, setActiveSectionId] = useState(assessment.sections[0]?.id ?? "");
  const [showStartInfo, setShowStartInfo] = useState(!attempt);
  const progressCount = attempt
    ? allTasks.filter((task) => attempt.responses[task.id]?.submitted).length
    : 0;
  const canFinish = Boolean(attempt && progressCount === allTasks.length && attempt.status === "in_progress");

  const startAttempt = () => {
    const now = new Date().toISOString();
    const next: AssessmentAttempt = {
      id: "assessment-" + crypto.randomUUID(),
      status: "in_progress",
      startedAt: now,
      updatedAt: now,
      completedAt: null,
      responses: {},
      score: null,
      passed: null,
      sectionScores: {},
    };
    dispatch({ type: "save-assessment-attempt", attempt: next });
    setViewAttemptId(next.id);
    setShowStartInfo(false);
    setActiveSectionId(assessment.sections[0]?.id ?? "");
  };

  const saveResponse = (task: AssessmentTask, response: AssessmentResponse) => {
    if (!attempt || attempt.status !== "in_progress") return;
    const now = new Date().toISOString();
    const next: AssessmentAttempt = {
      ...attempt,
      updatedAt: now,
      responses: { ...attempt.responses, [task.id]: { ...response, completedAt: response.submitted ? now : null } },
    };
    dispatch({ type: "save-assessment-attempt", attempt: next });
  };

  const finishAttempt = () => {
    if (!attempt || !canFinish) return;
    const result = scoreAssessmentResponses(assessment, attempt.responses);
    const now = new Date().toISOString();
    dispatch({
      type: "save-assessment-attempt",
      attempt: {
        ...attempt,
        status: "completed",
        updatedAt: now,
        completedAt: now,
        score: result.score,
        passed: result.passed,
        sectionScores: Object.fromEntries(result.sections.map((section) => [section.id, section.earned])),
      },
    });
  };

  const completedAttempt = attempt?.status === "completed" ? attempt : null;
  const finalScore = completedAttempt
    ? scoreAssessmentResponses(assessment, completedAttempt.responses)
    : null;
  const selectedSection = assessment.sections.find((section) => section.id === activeSectionId) ?? assessment.sections[0];
  const completedAttempts = state.assessmentAttempts.filter((item) => item.status === "completed");

  return (
    <div className="space-y-8">
      <Card className="border-border/70 bg-card/80">
        <CardContent className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Final assessment · 6 sections</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{assessment.title}</h1>
            </div>
            <Badge variant="outline" className="rounded-full">Pass: {assessment.passingScore}/100 + section minimums</Badge>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{assessment.instructions}</p>
          <p className="mt-3 max-w-3xl text-xs font-medium text-muted-foreground">The 65 browser-checked points evaluate typed answers only; 35 practical points are self-reported. No task runs or verifies a command for you.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {assessment.prerequisites.map((item) => <Badge key={item} variant="secondary" className="font-normal">{item}</Badge>)}
          </div>
          {showStartInfo && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {activeAttempt ? (
                <Button onClick={() => { setViewAttemptId(activeAttempt.id); setShowStartInfo(false); }} disabled={!hydrated}>
                  Resume in-progress attempt <ArrowRight />
                </Button>
              ) : (
                <Button onClick={startAttempt} disabled={!hydrated}>
                  {completedAttempts.length ? "Start another attempt" : "Begin assessment"} <ArrowRight />
                </Button>
              )}
              <span className="text-xs text-muted-foreground">Your draft and attempts are saved in this browser.</span>
            </div>
          )}
          {!showStartInfo && activeAttempt && attempt?.id !== activeAttempt.id && (
            <Button variant="outline" size="sm" className="mt-5" onClick={() => setViewAttemptId(activeAttempt.id)}>
              Resume in-progress attempt
            </Button>
          )}
        </CardContent>
      </Card>

      {attempt?.status === "in_progress" && (
        <section className="space-y-5" aria-label="Assessment tasks">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Attempt in progress</p>
              <p role="status" aria-live="polite" aria-atomic="true" className="text-xs text-muted-foreground">{progressCount} of {allTasks.length} tasks submitted. You can leave and resume later.</p>
            </div>
            <Badge variant="secondary">Started {new Date(attempt.startedAt).toLocaleString()}</Badge>
          </div>
          <Progress value={allTasks.length ? (progressCount / allTasks.length) * 100 : 0} aria-label="Assessment completion" className="h-2" />
          <nav aria-label="Assessment sections" className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
            {assessment.sections.map((section) => {
              const done = section.tasks.filter((task) => attempt.responses[task.id]?.submitted).length;
              return <Button key={section.id} size="sm" variant={section.id === selectedSection?.id ? "default" : "outline"} onClick={() => setActiveSectionId(section.id)} aria-label={section.title + ", " + done + " of " + section.tasks.length + " tasks submitted"} aria-current={section.id === selectedSection?.id ? "step" : undefined}>
                {section.title.split(". ")[0]} <span className="ml-1 opacity-75">{done}/{section.tasks.length}</span>
              </Button>;
            })}
          </nav>
          {selectedSection && <section aria-labelledby="active-assessment-section">
            <div className="mb-4"><h2 id="active-assessment-section" className="text-xl font-semibold">{selectedSection.title}</h2><p className="mt-1 text-sm text-muted-foreground">{selectedSection.description}</p></div>
            <div className="space-y-4">{selectedSection.tasks.map((task) => <TaskCard key={attempt.id + ":" + task.id} task={task} response={attempt.responses[task.id] ?? emptyResponse()} onSave={(response) => saveResponse(task, response)} />)}</div>
          </section>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
            <span className="text-xs text-muted-foreground">No command is executed or automatically verified by this website.</span>
            <Button onClick={finishAttempt} disabled={!canFinish}>Finish and see results</Button>
          </div>
        </section>
      )}

      {completedAttempt && finalScore && (
        <section className="space-y-5" aria-labelledby="assessment-results">
          <Card className={completedAttempt.passed ? "border-primary/40 bg-primary/5" : "border-amber-500/40 bg-amber-500/5"}>
            <CardContent className="p-5 sm:p-7">
              <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">Assessment {completedAttempt.passed ? "passed" : "not passed"}. Score: {completedAttempt.score} out of 100.</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Attempt result</p><h2 id="assessment-results" className="mt-2 text-2xl font-semibold">{completedAttempt.passed ? "Assessment passed" : "Keep practicing and try again"}</h2></div>
                <p className="font-mono text-4xl font-bold">{completedAttempt.score}<span className="text-xl text-muted-foreground">/100</span></p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Passing requires at least {assessment.passingScore} points and {assessment.minimumSectionPercent}% in every section. Completed {new Date(completedAttempt.completedAt!).toLocaleString()}.</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{assessment.sections.map((section) => {
                const score = finalScore.sections.find((item) => item.id === section.id)!;
                return <div key={section.id} className="flex items-center justify-between rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm"><span>{section.title.split(". ")[0]} · {section.title.split(". ")[1]}</span><strong>{score.earned}/{score.possible}</strong></div>;
              })}</div>
              <p className="mt-4 text-xs text-muted-foreground">Self-assessed tasks are included as learner-reported points and are not independently verified.</p>
            </CardContent>
          </Card>
          {assessment.sections.map((section) => <ReviewSection key={section.id} section={section} responses={completedAttempt.responses} />)}
          {activeAttempt && <Button variant="outline" onClick={() => setViewAttemptId(activeAttempt.id)}>Resume in-progress attempt</Button>}
          {!activeAttempt && <Button onClick={startAttempt} disabled={!hydrated}><RotateCcw /> Start another attempt</Button>}
        </section>
      )}

      {!attempt && !showStartInfo && <Button onClick={() => setShowStartInfo(true)} variant="outline">Show assessment instructions</Button>}

      <section id="history" className="space-y-3" aria-labelledby="attempt-history-heading">
        <div><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Browser-local history</p><h2 id="attempt-history-heading" className="mt-1 text-xl font-semibold">Previous attempts</h2></div>
        {state.assessmentAttempts.length ? <div className="space-y-2">{state.assessmentAttempts.map((item, index) => <button type="button" key={item.id} onClick={() => { setViewAttemptId(item.id); setShowStartInfo(false); }} className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40">
          <span><span className="block text-sm font-semibold">{item.status === "in_progress" ? "In progress · resume attempt" : "Attempt " + (completedAttempts.length - completedAttempts.findIndex((completed) => completed.id === item.id))}</span><span className="text-xs text-muted-foreground">Started {new Date(item.startedAt).toLocaleString()}{item.completedAt ? " · Completed " + new Date(item.completedAt).toLocaleString() : ""}</span></span>
          <span className="flex items-center gap-2">{item.status === "completed" ? <Badge variant={item.passed ? "default" : "secondary"}>{item.score}/100</Badge> : <Badge variant="outline">Draft</Badge>}<ArrowRight className="size-4"/></span>
          {index === 0 && <span className="sr-only">Most recent attempt</span>}
        </button>)}</div> : <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Your attempts will appear here. Progress stays in this browser.</p>}
      </section>
    </div>
  );
}

function TaskCard({ task, response, onSave }: { task: AssessmentTask; response: AssessmentResponse; onSave: (response: AssessmentResponse) => void }) {
  const draft = response.answer;
  const isSelfAssessed = task.type === "self_assessed";
  const allChecked = isSelfAssessed && task.rubric.every((criterion) => response.checkedCriteria.includes(criterion));
  const updateDraft = (answer: string) => onSave({ ...response, answer, submitted: false, correct: null, completedAt: null });
  const submitKnowledge = () => {
    if (task.type !== "knowledge" || !draft.trim()) return;
    onSave({ ...response, answer: draft, submitted: true, correct: checkAssessmentAnswer(task, draft), completedAt: new Date().toISOString() });
  };
  const checkCriterion = (criterion: string, checked: boolean) => {
    if (task.type !== "self_assessed") return;
    const checkedCriteria = checked
      ? [...response.checkedCriteria, criterion]
      : response.checkedCriteria.filter((item) => item !== criterion);
    onSave({ ...response, checkedCriteria, submitted: false, correct: null, completedAt: null });
  };
  const submitSelfAssessment = () => {
    if (task.type !== "self_assessed" || !allChecked) return;
    onSave({ ...response, submitted: true, correct: null, completedAt: new Date().toISOString() });
  };
  return <Card className="border-border/70"><CardContent className="space-y-4 p-4 sm:p-5">
    <div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{task.type === "knowledge" ? "Browser-checked answer" : "Self-assessed practice"}</Badge><Badge variant="secondary">{task.points} points</Badge>{response.submitted&&<Badge variant={response.correct===false?"destructive":"default"}>{response.correct===false?"Review this answer":"Submitted"}</Badge>}</div>
    <h3 className="font-medium leading-6">{task.prompt}</h3>
    {task.type === "knowledge" ? <div className="flex flex-col gap-2 sm:flex-row"><Input value={draft} maxLength={4000} onChange={(event)=>updateDraft(event.target.value)} disabled={response.submitted} aria-label={"Answer: " + task.prompt} onKeyDown={(event)=>{if(event.key==="Enter")submitKnowledge();}} placeholder="Type your answer"/><Button onClick={submitKnowledge} disabled={response.submitted||!draft.trim()}>Check answer</Button></div> : <div className="space-y-3">
      <p className="text-xs text-muted-foreground">The site cannot inspect or execute terminal commands. Run the task in your Linux terminal, then confirm each item.</p>
      <div className="space-y-2">{task.rubric.map((criterion)=><label key={criterion} className="flex cursor-pointer items-start gap-3 rounded-lg bg-muted/40 p-3 text-sm leading-5"><input type="checkbox" className="mt-1 size-4 accent-primary" checked={response.checkedCriteria.includes(criterion)} disabled={response.submitted} onChange={(event)=>checkCriterion(criterion,event.target.checked)}/><span>{criterion}</span></label>)}</div>
      <Button onClick={submitSelfAssessment} disabled={response.submitted||!allChecked}><Check/>Confirm self-assessment</Button>
    </div>}
    {response.submitted&&<div role="status" className={response.correct===false?"rounded-lg bg-destructive/10 p-3 text-sm":"rounded-lg bg-primary/10 p-3 text-sm"}><p className="font-semibold">{response.correct===false?"Not quite yet":"Task recorded"}</p><p className="mt-1 text-muted-foreground">{task.feedback}</p></div>}
    <details className="rounded-xl border border-border/70 px-3 py-2" open={false}>
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-primary"><CircleHelp className="size-4"/>Hint</summary><p className="mt-2 text-sm text-muted-foreground">{task.hint}</p>
    </details>
    {response.submitted&&<details className="rounded-xl border border-border/70 px-3 py-2"><summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-muted-foreground"><LockKeyhole className="size-4"/>Show explanation</summary><pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-xs leading-5">{task.solution}</pre></details>}
  </CardContent></Card>;
}

function ReviewSection({section,responses}:{section:AssessmentSection;responses:Record<string,AssessmentResponse>}) {
  return <details className="rounded-2xl border border-border/70 bg-card px-4 py-3"><summary className="cursor-pointer font-semibold">Review {section.title}</summary><div className="mt-4 space-y-3">{section.tasks.map((task)=>{const response=responses[task.id]??emptyResponse();return <div key={task.id} className="rounded-xl bg-muted/40 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{task.prompt}</p><Badge variant={response.correct===false?"destructive":"secondary"}>{response.correct===null?"Self-assessed":response.correct?"Correct":"Review"}</Badge></div>{response.answer&&<p className="mt-2 text-sm text-muted-foreground">Your answer: <code>{response.answer}</code></p>}{task.type==="self_assessed"&&<p className="mt-2 text-xs text-muted-foreground">{response.checkedCriteria.length} of {task.rubric.length} rubric items confirmed by you.</p>}<details className="mt-3"><summary className="cursor-pointer text-xs font-semibold text-primary">Show explanation</summary><pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-background p-3 font-mono text-xs">{task.solution}</pre></details></div>;})}</div></details>;
}
