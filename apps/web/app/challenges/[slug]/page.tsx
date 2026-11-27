import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { loadCatalog } from "@/lib/content";
import { MarkdownContent } from "@/components/markdown-content";
import { ChallengeActions } from "@/components/challenge-actions";
import { PersonalNote } from "@/components/command-actions";
import { Badge } from "@/components/ui/badge";
export function generateStaticParams(){return loadCatalog().challenges.map(x=>({slug:x.id}));}
export default async function ChallengePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=loadCatalog().challenges.find(x=>x.id===slug);if(!c)notFound();return <div className="mx-auto max-w-4xl space-y-7"><Link href="/challenges" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4"/>All challenges</Link><header><div className="flex gap-2"><Badge variant="secondary">Stage {String(c.stage).padStart(2,"0")}</Badge><Badge variant="outline">{c.difficulty}</Badge></div><h1 className="mt-3 text-3xl font-semibold tracking-tight">{c.title}</h1><p className="mt-2 text-muted-foreground">{c.summary}</p></header><ChallengeActions id={c.id}/><MarkdownContent body={c.body} sourcePath={c.sourcePath}/><PersonalNote storageKey={"challenge:"+c.id} title="Challenge notes"/></div>}
