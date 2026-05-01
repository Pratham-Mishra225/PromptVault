import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Copy, Check, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { prompts } from "@/data/prompts";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prompts/$id")({
  loader: ({ params }) => {
    const prompt = prompts.find((p) => p.id === params.id);
    if (!prompt) throw notFound();
    return { prompt };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.prompt.title} — PromptVault` },
          { name: "description", content: loaderData.prompt.description },
          { property: "og:title", content: `${loaderData.prompt.title} — PromptVault` },
          { property: "og:description", content: loaderData.prompt.description },
        ]
      : [{ title: "Prompt — PromptVault" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Prompt not found</h1>
        <Link to="/library">
          <Button className="mt-4">Back to library</Button>
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  component: PromptDetail,
});

function PromptDetail() {
  const { prompt } = Route.useLoaderData();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(prompt.id);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(prompt.inputs.map((k) => [k, ""])),
  );
  const [copied, setCopied] = useState(false);

  const generated = useMemo(() => {
    let out = prompt.template;
    for (const key of prompt.inputs) {
      const v = values[key]?.trim();
      out = out.replaceAll(`{${key}}`, v ? v : `{${key}}`);
    }
    return out;
  }, [prompt, values]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <Link to="/library" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              {prompt.category}
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{prompt.title}</h1>
            <p className="mt-1.5 text-muted-foreground">{prompt.description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toggle(prompt.id)}>
            <Heart className={cn("h-4 w-4", fav && "fill-rose-500 text-rose-500")} />
            {fav ? "Saved" : "Save"}
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Inputs */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-sm font-semibold">Inputs</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Fill in the placeholders below.
            </p>

            <div className="mt-4 space-y-4">
              {prompt.inputs.length === 0 ? (
                <p className="text-sm text-muted-foreground">This prompt has no variables.</p>
              ) : (
                prompt.inputs.map((key) => {
                  const isLong = ["code", "schema", "architecture", "experience", "query", "error", "requirements"].includes(key);
                  return (
                    <div key={key} className="space-y-1.5">
                      <Label htmlFor={key} className="font-mono text-xs">
                        {`{${key}}`}
                      </Label>
                      {isLong ? (
                        <Textarea
                          id={key}
                          rows={5}
                          value={values[key]}
                          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                          placeholder={`Enter ${key}...`}
                          className="font-mono text-sm"
                        />
                      ) : (
                        <Input
                          id={key}
                          value={values[key]}
                          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                          placeholder={`Enter ${key}...`}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Output */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Generated Prompt</h2>
              <Button size="sm" onClick={onCopy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
              {generated}
            </pre>
          </section>
        </div>
      </main>
    </div>
  );
}
