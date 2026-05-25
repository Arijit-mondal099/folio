"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const themes = ["light", "dark", "system"] as const;

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for next-themes
  React.useEffect(() => setMounted(true), []);

  if (!mounted)
    return <Button variant="ghost" size="icon" disabled className="w-9 h-9" />;

  const current = (theme as (typeof themes)[number]) ?? "system";
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  const Icon = icons[current];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      className="w-9 h-9"
    >
      <Icon className="h-4 w-4 transition-all" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
