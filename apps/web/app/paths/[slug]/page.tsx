import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { loadCatalog } from "@/lib/content";
import { MarkdownContent } from "@/components/markdown-content";
import { CommandCard } from "@/components/command-card";
import { ChallengeCard } from "@/components/challenge-card";

export function generateStaticParams() { return loadCatalog().stages.map(({slug}) => ({slug})); }
export default async function PathPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const catalog=loadCatalog(); const stage=catalog.stages.find((x)=>x.slug===slug); if(!stage) notFound();
  const commands=catalog.commands.filter((x)=>x.stage===stage.number); const challenges=catalog.challenges.filter((x)=>x.stage===stage.number);
  return <div className="space-y-9"><Link href="/paths" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4"/>All learning paths</Link><header><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Stage {String(stage.number).padStart(2,"0")}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{stage.title}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{stage.description}</p></header><MarkdownContent body={stage.body} sourcePath={"content/"+stage.sourcePath}/><section><h2 className="mb-4 text-xl font-semibold">Commands</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{commands.map(x=><CommandCard key={x.id} command={x}/>)}</div></section>{challenges.length>0&&<section><h2 className="mb-4 text-xl font-semibold">Practice challenges</h2><div className="grid gap-3 sm:grid-cols-2">{challenges.map(x=><ChallengeCard key={x.id} challenge={x}/>)}</div></section>}</div>;
}
