import { Link } from "@tanstack/react-router";
import { Copy, Heart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import type { Prompt } from "@/data/prompts";
import { cn } from "@/lib/utils";

const categoryStyles: Record<string, string> = {
  DSA: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Debugging: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "System Design": "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "Web Dev": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  SQL: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Interview: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const { isFavorite, toggle } = useFavorites();
  const [copied, setCopied] = useState(false);

  const fav = isFavorite(prompt.id);

  const onCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(prompt.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
            categoryStyles[prompt.category],
          )}
        >
          {prompt.category}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(prompt.id);
          }}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={fav ? "Remove favorite" : "Add favorite"}
        >
          <Heart className={cn("h-4 w-4", fav && "fill-rose-500 text-rose-500")} />
        </button>
      </div>

      <h3 className="text-base font-semibold tracking-tight">{prompt.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{prompt.description}</p>

      <div className="mt-5 flex items-center gap-2">
        <Link to="/prompts/$id" params={{ id: prompt.id }} className="flex-1">
          <Button size="sm" className="w-full">
            Use Prompt <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
        <Button size="sm" variant="outline" onClick={onCopy}>
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
