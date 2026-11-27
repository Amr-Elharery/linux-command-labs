"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSetTheme } from "@/components/workspace-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useSetTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={"Switch to " + nextTheme + " mode"}
      title={"Switch to " + nextTheme + " mode"}
      onClick={() => setTheme(nextTheme)}
      className="rounded-full border-border/70 bg-card/70"
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
