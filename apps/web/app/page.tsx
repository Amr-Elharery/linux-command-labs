import { Dashboard } from "@/components/dashboard";
import { loadCatalog } from "@/lib/content";

export default function HomePage() {
  const { stages, commands, challenges } = loadCatalog();
  return <Dashboard stages={stages} commands={commands} challenges={challenges} />;
}
