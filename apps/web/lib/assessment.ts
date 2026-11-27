import { z } from "zod";

const rubricTask = z.object({
  id: z.string().min(1),
  type: z.literal("self_assessed"),
  points: z.number().int().positive(),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  feedback: z.string().min(1),
  solution: z.string().min(1),
  rubric: z.array(z.string().min(1)).min(1),
});

const knowledgeTask = z.object({
  id: z.string().min(1),
  type: z.literal("knowledge"),
  points: z.number().int().positive(),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  feedback: z.string().min(1),
  solution: z.string().min(1),
  acceptedAnswers: z.array(z.string().min(1)).min(1),
});

const taskSchema = z.discriminatedUnion("type", [knowledgeTask, rubricTask]);

const assessmentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  version: z.number().int().positive(),
  passingScore: z.number().int().min(0).max(100),
  minimumSectionPercent: z.number().int().min(0).max(100),
  instructions: z.string().min(1),
  prerequisites: z.array(z.string().min(1)).min(1),
  sections: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    tasks: z.array(taskSchema).min(1),
  })).min(1),
});

export type Assessment = z.infer<typeof assessmentSchema>;
export type AssessmentSection = Assessment["sections"][number];
export type AssessmentTask = AssessmentSection["tasks"][number];
export type KnowledgeTask = Extract<AssessmentTask, { type: "knowledge" }>;
export type RubricTask = Extract<AssessmentTask, { type: "self_assessed" }>;

export function parseAssessment(source: string): Assessment {
  const assessment = assessmentSchema.parse(JSON.parse(source));
  const sectionIds = new Set<string>();
  const taskIds = new Set<string>();
  let points = 0;
  for (const section of assessment.sections) {
    if (sectionIds.has(section.id)) throw new Error("Duplicate assessment section id: " + section.id);
    sectionIds.add(section.id);
    for (const task of section.tasks) {
      if (taskIds.has(task.id)) throw new Error("Duplicate assessment task id: " + task.id);
      taskIds.add(task.id);
      if (task.type === "self_assessed" && new Set(task.rubric).size !== task.rubric.length) {
        throw new Error("Duplicate rubric item in assessment task: " + task.id);
      }
      points += task.points;
    }
  }
  if (points !== 100) throw new Error("Assessment points must total 100; found " + points);
  return assessment;
}

export function normalizeAssessmentAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, " ");
}

export function checkAssessmentAnswer(task: KnowledgeTask, answer: string): boolean {
  const normalized = normalizeAssessmentAnswer(answer);
  return normalized.length > 0 && task.acceptedAnswers.some(
    (accepted) => normalizeAssessmentAnswer(accepted) === normalized,
  );
}

export function getAssessmentTasks(assessment: Assessment): AssessmentTask[] {
  return assessment.sections.flatMap((section) => section.tasks);
}

export function scoreAssessmentResponses(
  assessment: Assessment,
  responses: Record<string, { submitted: boolean; correct: boolean | null; checkedCriteria: string[] }>,
) {
  const sections = assessment.sections.map((section) => {
    const earned = section.tasks.reduce((total, task) => {
      const response = responses[task.id];
      const complete = task.type === "knowledge"
        ? response?.submitted && response.correct === true
        : response?.submitted && task.rubric.every((item) => response.checkedCriteria.includes(item));
      return total + (complete ? task.points : 0);
    }, 0);
    const possible = section.tasks.reduce((total, task) => total + task.points, 0);
    return { id: section.id, earned, possible, percent: possible ? Math.round((earned / possible) * 100) : 0 };
  });
  const score = sections.reduce((total, section) => total + section.earned, 0);
  const passed = score >= assessment.passingScore && sections.every(
    (section) => section.percent >= assessment.minimumSectionPercent,
  );
  return { score, passed, sections };
}
