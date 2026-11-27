import { CommandExplorer } from "@/components/command-explorer";
import { loadCatalog } from "@/lib/content";
export default function CommandsPage(){const {commands,stages}=loadCatalog();return <div className="space-y-6"><header><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Command library</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Find your next command</h1><p className="mt-2 text-muted-foreground">Search names, concepts, tags, or browse by learning stage.</p></header><CommandExplorer commands={commands} stages={stages}/></div>}
