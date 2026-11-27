"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bookmark, ClipboardCheck, Command, House, Layers3, Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Overview", icon: House },
  { href: "/paths", label: "Learning paths", icon: Layers3 },
  { href: "/commands", label: "Commands", icon: Command },
  { href: "/challenges", label: "Challenges", icon: BookOpen },
  { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
  { href: "/workspace", label: "My workspace", icon: Bookmark },
];

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { notice, clearNotice } = useWorkspace();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="group flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
              <Terminal className="size-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight">Linux Labs</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">Learn by doing</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={"inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors " +
                    (active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/commands" className="hidden sm:block">
              <Button variant="secondary" size="sm" className="rounded-full px-4">
                <span className="mr-1 text-primary">›_</span> Find a command
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <nav aria-label="Mobile navigation" className="scrollbar-none flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={"flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold " +
                  (active ? "bg-primary text-primary-foreground" : "bg-muted/70 text-muted-foreground")}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      {notice && (
        <div role="status" className="border-b border-amber-300/60 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-sm sm:px-6">
            <span>{notice}</span>
            <Button variant="ghost" size="sm" onClick={clearNotice} aria-label="Dismiss notice">Dismiss</Button>
          </div>
        </div>
      )}

      <main className="mx-auto min-h-[calc(100vh-10rem)] max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        {children}
      </main>
      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span>Linux Labs · Your progress stays in this browser.</span>
          <span>Content-first Linux practice · No account required</span>
        </div>
      </footer>
    </div>
  );
}
