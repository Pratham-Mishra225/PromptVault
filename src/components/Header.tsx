import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Sparkles, Heart } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, toggle } = useTheme();
  const { location } = useRouterState();

  const navItem = (to: string, label: string) => {
    const active = location.pathname === to || (to === "/library" && location.pathname.startsWith("/prompts"));
    return (
      <Link
        to={to}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm transition-colors",
          active
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">PromptVault</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItem("/library", "Library")}
          {navItem("/favorites", "Favorites")}
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/favorites" className="sm:hidden">
            <Button variant="ghost" size="icon" aria-label="Favorites">
              <Heart className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
