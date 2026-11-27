import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { loadCatalog } from "@/lib/content";
import { MarkdownContent } from "@/components/markdown-content";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return loadCatalog().cheatsheets.map((sheet) => ({ id: sheet.id }));
}

export default async function CheatSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = loadCatalog();
  const index = catalog.cheatsheets.findIndex((sheet) => sheet.id === id);
  if (index < 0) notFound();
  const sheet = catalog.cheatsheets[index];
  const previous = catalog.cheatsheets[index - 1];
  const next = catalog.cheatsheets[index + 1];
  const stage = catalog.stages.find((item) => item.number === sheet.stage)!;
  const body = sheet.body.replace(/^#\s+[^\n]+\n+/, "");

  return (
    <div className="space-y-6">
      <Link href="/cheatsheets" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All Cheat Sheets</Link>
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Stage {String(sheet.stage).padStart(2, "0")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{stage.title} Cheat Sheet</h1>
        <p className="max-w-3xl text-muted-foreground">{sheet.summary}</p>
      </header>
      <nav aria-label="Cheat Sheet stage navigation" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3">
        {previous ? <Button asChild size="sm" variant="outline"><Link href={`/cheatsheets/${previous.id}`}><ArrowLeft /> Stage {String(previous.stage).padStart(2, "0")}</Link></Button> : <span className="text-xs text-muted-foreground">First stage</span>}
        <span className="text-xs text-muted-foreground">Cheat Sheet {index + 1} of {catalog.cheatsheets.length}</span>
        {next ? <Button asChild size="sm" variant="outline"><Link href={`/cheatsheets/${next.id}`}>Stage {String(next.stage).padStart(2, "0")} <ArrowRight /></Link></Button> : <span className="text-xs text-muted-foreground">Last stage</span>}
      </nav>
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-border/70 bg-card p-4 sm:p-6 lg:p-8">
        <MarkdownContent body={body} sourcePath={sheet.sourcePath} />
      </div>
      <nav aria-label="Cheat Sheet stage navigation" className="flex flex-wrap items-center justify-between gap-3">
        {previous ? <Button asChild variant="ghost"><Link href={`/cheatsheets/${previous.id}`}><ArrowLeft /> Previous Cheat Sheet</Link></Button> : <span />}
        {next ? <Button asChild variant="ghost"><Link href={`/cheatsheets/${next.id}`}>Next Cheat Sheet <ArrowRight /></Link></Button> : <Link className="text-sm text-primary underline-offset-4 hover:underline" href="/cheatsheets">Back to all stages</Link>}
      </nav>
    </div>
  );
}
