import Link from "next/link";
import { ArrowRight, BookMarked } from "lucide-react";
import { loadCatalog } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";

export default function CheatSheetsPage() {
  const { stages, cheatsheets } = loadCatalog();
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Quick reference</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cheat Sheets</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Concise syntax and examples for each stage. Open a command’s Detailed guide for the full explanation or Revision guide for a quick review.</p>
      </header>
      <nav aria-label="Cheat Sheets by stage" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cheatsheets.map((sheet) => {
          const stage = stages.find((item) => item.number === sheet.stage)!;
          return (
            <Link href={`/cheatsheets/${sheet.id}`} key={sheet.id} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Card className="h-full border-border/70 transition-colors group-hover:border-primary/40">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <BookMarked className="size-5 text-primary" aria-hidden="true" />
                    <span className="font-mono text-xs text-muted-foreground">STAGE {String(sheet.stage).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">{stage.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sheet.summary}</p>
                  <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">{sheet.commands.length} commands <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
