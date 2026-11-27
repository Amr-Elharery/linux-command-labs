import type { LearningMode } from "@/lib/content";

export function commandHref(id: string, mode: LearningMode = "detailed"): string {
  return "/commands/" + encodeURIComponent(id) + "/" + mode;
}

export function challengeHref(id: string): string {
  return "/challenges/" + encodeURIComponent(id);
}

export function stageHref(slug: string): string {
  return "/paths/" + encodeURIComponent(slug);
}
