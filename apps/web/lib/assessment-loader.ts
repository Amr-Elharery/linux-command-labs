import { readFileSync } from "node:fs";
import path from "node:path";
import { parseAssessment, type Assessment } from "@/lib/assessment";

export function loadAssessment(repoRoot = path.resolve(process.cwd(), "../..")): Assessment {
  return parseAssessment(readFileSync(path.join(repoRoot, "content/assessments/final-assessment.json"), "utf8"));
}
