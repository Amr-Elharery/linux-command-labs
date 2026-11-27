import type { Metadata } from "next";
import { AssessmentPlayer } from "@/components/assessment-player";
import { loadAssessment } from "@/lib/assessment-loader";

export const metadata: Metadata = { title: "Final Assessment" };

export default async function AssessmentPage({ searchParams }: { searchParams: Promise<{ attempt?: string }> }) {
  const [{ attempt }, assessment] = await Promise.all([searchParams, Promise.resolve(loadAssessment())]);
  return <AssessmentPlayer assessment={assessment} initialAttemptId={attempt} />;
}
