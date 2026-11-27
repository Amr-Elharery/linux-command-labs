import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { loadCatalog } from "@/lib/content";
import { stageHref } from "@/lib/routes";
import { Card, CardContent } from "@/components/ui/card";

export default function PathsPage() {
  const { stages, commands, challenges } = loadCatalog();
  return <div className="space-y-6"><header><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Structured practice</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Learning paths</h1><p className="mt-2 text-muted-foreground">Work through each stage using command guides and hands-on challenges.</p></header><div className="grid gap-4 md:grid-cols-2">{stages.map((stage) => <Link href={stageHref(stage.slug)} key={stage.slug} className="group"><Card className="h-full border-border/70 transition-colors group-hover:border-primary/40"><CardContent className="p-5"><div className="flex items-center justify-between"><Layers3 className="size-5 text-primary" /><span className="font-mono text-xs text-muted-foreground">STAGE {String(stage.number).padStart(2,"0")}</span></div><h2 className="mt-5 text-xl font-semibold">{stage.title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.description}</p><p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">{commands.filter(x=>x.stage===stage.number).length} commands · {challenges.filter(x=>x.stage===stage.number).length} challenges <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></p></CardContent></Card></Link>)}</div></div>;
}
