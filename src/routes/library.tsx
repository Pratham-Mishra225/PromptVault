import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories, prompts } from "@/data/prompts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Prompt Library — PromptVault" },
      {
        name: "description",
        content:
          "Browse a structured library of developer AI prompts: DSA, debugging, system design, SQL, web dev, and interviews.",
      },
      { property: "og:title", content: "Prompt Library — PromptVault" },
      { property: "og:description", content: "Browse a structured library of developer AI prompts." },
    ],
  }),
  component: Library,
});

function Library() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      if (activeCat && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [query, activeCat]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Prompt Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {prompts.length} structured prompts. Search, filter, and copy in one click.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts..."
              className="h-10 pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={activeCat === null ? "default" : "outline"}
              onClick={() => setActiveCat(null)}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={activeCat === c ? "default" : "outline"}
                onClick={() => setActiveCat(c)}
                className={cn("transition-all")}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">No prompts match your search.</p>
            <Link to="/library">
              <Button variant="link" size="sm" className="mt-2">
                Clear filters
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
