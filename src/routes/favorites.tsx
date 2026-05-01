import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { prompts } from "@/data/prompts";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — PromptVault" },
      { name: "description", content: "Your saved AI prompts in PromptVault." },
      { property: "og:title", content: "Favorites — PromptVault" },
      { property: "og:description", content: "Your saved AI prompts in PromptVault." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { favorites } = useFavorites();
  const items = prompts.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Favorites</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} saved {items.length === 1 ? "prompt" : "prompts"}.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Heart className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No favorites yet.</p>
            <Link to="/library">
              <Button size="sm" className="mt-4">
                Browse Library
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
