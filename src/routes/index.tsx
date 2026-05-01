import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Search, Heart, Layers } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PromptVault — Structured AI Prompts for Developers" },
      {
        name: "description",
        content:
          "A curated, structured library of AI prompts for software engineers. DSA, debugging, system design, SQL, web dev, and interviews.",
      },
      { property: "og:title", content: "PromptVault — Structured AI Prompts for Developers" },
      {
        property: "og:description",
        content: "A curated, structured library of AI prompts for software engineers.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="relative pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-10 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-[var(--brand)] opacity-[0.08] blur-3xl"
          />

          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5" />
              Structured prompts, built for engineers
            </div>

            <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
              PromptVault
            </h1>
            <p className="mt-5 text-balance text-lg text-muted-foreground sm:text-xl">
              Structured AI Prompts for Developers
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link to="/library">
                <Button size="lg" className="h-11 px-6">
                  Explore Prompts <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/favorites">
                <Button size="lg" variant="outline" className="h-11 px-6">
                  Favorites
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-4 pb-24 sm:grid-cols-3">
          {[
            {
              icon: Layers,
              title: "Categorized library",
              desc: "DSA, debugging, system design, SQL, web dev, interviews.",
            },
            {
              icon: Search,
              title: "Dynamic playground",
              desc: "Fill in placeholders and copy a ready-to-paste prompt.",
            },
            {
              icon: Heart,
              title: "Save favorites",
              desc: "Pin the prompts you reach for again and again.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
