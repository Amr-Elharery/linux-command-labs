import type { Metadata } from "next";
import Script from "next/script";
import { SiteFrame } from "@/components/site-frame";
import { WorkspaceProvider } from "@/components/workspace-provider";
import { loadCatalog } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Linux Labs — Learn Linux, command by command",
    template: "%s · Linux Labs",
  },
  description: "A practical Linux command learning path with safe synthetic playground files and private local progress.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const catalog = loadCatalog();
  const commandIds = catalog.commands.map((command) => command.id);
  const challengeIds = catalog.challenges.map((challenge) => challenge.id);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body>
        <WorkspaceProvider commandIds={commandIds} challengeIds={challengeIds}>
          <SiteFrame>{children}</SiteFrame>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
