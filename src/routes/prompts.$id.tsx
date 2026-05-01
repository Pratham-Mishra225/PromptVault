import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { ArrowLeft, Copy, Check, Heart, Link2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  prompts,
  contextModes,
  contextPreambles,
  type ContextMode,
} from "@/data/prompts";
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

/** Render a template, replacing {input} tokens with user values and highlighting them. */
function renderHighlighted(
  template: string,
  values: Record<string, string>,
  inputs: string[],
) {
  if (inputs.length === 0) return <>{template}</>;
  // Build a regex matching any known input placeholder.
  const re = new RegExp(`\\{(${inputs.map(escapeRe).join("|")})\\}`, "g");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(template)) !== null) {
    if (m.index > lastIndex) parts.push(template.slice(lastIndex, m.index));
    const key = m[1];
    const v = values[key]?.trim();
    if (v) {
      parts.push(
        <mark
          key={`v-${i++}`}
          className="rounded bg-[var(--brand)]/15 px-1 py-0.5 text-foreground ring-1 ring-[var(--brand)]/30"
        >
          {v}
        </mark>,
      );
    } else {
      parts.push(
        <span
          key={`p-${i++}`}
          className="rounded bg-muted-foreground/10 px-1 py-0.5 font-mono text-muted-foreground ring-1 ring-border"
        >
          {`{${key}}`}
        </span>,
      );
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < template.length) parts.push(template.slice(lastIndex));
  return (
    <>
      {parts.map((p, idx) => (
        <Fragment key={idx}>{p}</Fragment>
      ))}
    </>
  );
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyTemplate(template: string, values: Record<string, string>, inputs: string[]) {
  let out = template;
  for (const key of inputs) {
    const v = values[key]?.trim();
    out = out.replaceAll(`{${key}}`, v ? v : `{${key}}`);
  }
  return out;
}

function buildFinalTemplate(base: string, mode: ContextMode) {
  return `${contextPreambles[mode]}\n\n${base}`;
}

function PromptDetail() {
  const { prompt } = Route.useLoaderData();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(prompt.id);

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(prompt.inputs.map((k) => [k, ""])),
  );
  const [mode, setMode] = useState<ContextMode>("Learning");
  const [detailed, setDetailed] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedChain, setCopiedChain] = useState(false);

  const baseTemplate = useMemo(() => {
    if (detailed) return prompt.template;
    return prompt.conciseTemplate ?? prompt.template;
  }, [prompt, detailed]);

  const finalTemplate = useMemo(
    () => buildFinalTemplate(baseTemplate, mode),
    [baseTemplate, mode],
  );

  const generatedText = useMemo(
    () => applyTemplate(finalTemplate, values, prompt.inputs),
    [finalTemplate, values, prompt.inputs],
  );

  const onCopy = async () => {
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const chainText = useMemo(() => {
    if (!prompt.chain) return "";
    return prompt.chain
      .map(
        (s, i) =>
          `### Step ${i + 1}: ${s.step}\n${applyTemplate(s.template, values, prompt.inputs)}`,
      )
      .join("\n\n---\n\n");
  }, [prompt, values]);

  const onCopyChain = async () => {
    await navigator.clipboard.writeText(chainText);
    setCopiedChain(true);
    setTimeout(() => setCopiedChain(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              {prompt.category}
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{prompt.title}</h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-[var(--brand)]">
              Structured prompts for real developer workflows
            </p>
            <p className="mt-2 text-muted-foreground">{prompt.description}</p>
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
              Tune the context, then fill in placeholders.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Context Mode</Label>
                <Select value={mode} onValueChange={(v) => setMode(v as ContextMode)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contextModes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end justify-between gap-3 rounded-md border border-border bg-background/50 px-3 py-1.5">
                <div>
                  <Label className="text-xs">Detail level</Label>
                  <p className="text-[11px] text-muted-foreground">
                    {detailed ? "Detailed" : "Concise"}
                  </p>
                </div>
                <Switch checked={detailed} onCheckedChange={setDetailed} />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {prompt.inputs.length === 0 ? (
                <p className="text-sm text-muted-foreground">This prompt has no variables.</p>
              ) : (
                prompt.inputs.map((key) => {
                  const isLong = [
                    "code",
                    "schema",
                    "architecture",
                    "experience",
                    "query",
                    "error",
                    "requirements",
                  ].includes(key);
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
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [key]: e.target.value }))
                          }
                          placeholder={`Enter ${key}...`}
                          className="font-mono text-sm"
                        />
                      ) : (
                        <Input
                          id={key}
                          value={values[key]}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [key]: e.target.value }))
                          }
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
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">Final Prompt Output</h2>
                <p className="text-[11px] text-muted-foreground">
                  {mode} · {detailed ? "Detailed" : "Concise"}
                </p>
              </div>
              <Button size="sm" onClick={onCopy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
              {renderHighlighted(finalTemplate, values, prompt.inputs)}
            </pre>
          </section>
        </div>

        {/* Prompt Chain */}
        {prompt.chain && prompt.chain.length > 0 && (
          <section className="mt-8 rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-[var(--brand)]" />
                <h2 className="text-sm font-semibold">Prompt Chain</h2>
                <span className="text-xs text-muted-foreground">
                  Multi-step sequence — run each step in order.
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={onCopyChain}>
                {copiedChain ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedChain ? "Copied" : "Copy chain"}
              </Button>
            </div>

            <ol className="mt-4 space-y-3">
              {prompt.chain.map((s, i) => (
                <li
                  key={s.step}
                  className="rounded-lg border border-border bg-background/40 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand)]">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{s.step}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/90">
                    {renderHighlighted(s.template, values, prompt.inputs)}
                  </pre>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </div>
  );
}
