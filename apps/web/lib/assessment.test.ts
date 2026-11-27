import { describe, expect, it } from "vitest";
import { checkAssessmentAnswer, getAssessmentTasks, parseAssessment, scoreAssessmentResponses } from "@/lib/assessment";
import { loadAssessment } from "@/lib/assessment-loader";

const assessment = loadAssessment();

describe("final assessment content and scoring", () => {
  it("loads six sections with the agreed source fixtures and a 100 point rubric", () => {
    expect(assessment.sections).toHaveLength(6);
    expect(getAssessmentTasks(assessment).reduce((sum, task) => sum + task.points, 0)).toBe(100);
    expect(assessment.sections.map((section) => section.title)).toEqual([
      "A. Command fundamentals and syntax",
      "B. File system operations",
      "C. File content inspection and search",
      "D. Text processing and pipelines",
      "E. System information and resource investigation",
      "F. Integrated practical scenario",
    ]);
    const integration = assessment.sections.at(-1)!.tasks[0];
    expect(integration.type).toBe("self_assessed");
    if (integration.type === "self_assessed") expect(integration.solution).toContain("playground/logs/auth.log");
  });

  it("checks only typed answers and accepts harmless whitespace/case variations", () => {
    const task = assessment.sections[0].tasks[0];
    if (task.type !== "knowledge") throw new Error("Expected a knowledge question");
    expect(checkAssessmentAnswer(task, "  WHICH  ")).toBe(true);
    expect(checkAssessmentAnswer(task, "whereis")).toBe(false);
    expect(checkAssessmentAnswer(task, "")).toBe(false);
  });

  it("requires the score threshold and at least half the points in every section", () => {
    const responses = Object.fromEntries(getAssessmentTasks(assessment).map((task) => [task.id, task.type === "knowledge"
      ? { answer: task.acceptedAnswers[0], submitted: true, correct: true, checkedCriteria: [] }
      : { answer: "", submitted: true, correct: null, checkedCriteria: task.rubric },
    ]));
    const perfect = scoreAssessmentResponses(assessment, responses);
    expect(perfect).toMatchObject({ score: 100, passed: true });
    expect(perfect.sections.every((section) => section.percent === 100)).toBe(true);

    const belowSectionMinimum = { ...responses };
    for (const task of assessment.sections.find((section) => section.id === "filesystem")!.tasks) {
      belowSectionMinimum[task.id] = { answer: "", submitted: false, correct: null, checkedCriteria: [] };
    }
    const fail = scoreAssessmentResponses(assessment, belowSectionMinimum);
    expect(fail.score).toBe(90);
    expect(fail.passed).toBe(false);
    expect(fail.sections.find((section) => section.id === "filesystem")?.percent).toBe(0);
  });

  it("rejects malformed or unbalanced assessment content", () => {
    expect(() => parseAssessment("{}" )).toThrow();
    expect(() => parseAssessment(JSON.stringify({ ...assessment, sections: assessment.sections.slice(0, 1) })))
      .toThrow("Assessment points must total 100");
  });
});
