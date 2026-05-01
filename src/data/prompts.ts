export type Prompt = {
  id: string;
  title: string;
  category: "DSA" | "Debugging" | "System Design" | "Web Dev" | "SQL" | "Interview";
  description: string;
  /** Detailed, expert-level template (default). */
  template: string;
  /** Concise variant of the same prompt. */
  conciseTemplate?: string;
  inputs: string[];
  /** Optional multi-step prompt chain (understand → optimize → implement style). */
  chain?: { step: string; template: string }[];
};

export type ContextMode = "Learning" | "Interview" | "Production";

export const contextModes: ContextMode[] = ["Learning", "Interview", "Production"];

export const contextPreambles: Record<ContextMode, string> = {
  Learning:
    "CONTEXT: Learning mode. The reader is studying this topic. Optimize for clarity, intuition, and worked examples. Define jargon on first use. Prefer step-by-step derivations over terse expert shorthand.",
  Interview:
    "CONTEXT: Interview mode. The reader is preparing for a technical interview at a top-tier company. Optimize for structured thinking out loud, brute-force → optimal progression, complexity analysis, and signals interviewers look for (clarifying questions, edge cases, trade-offs).",
  Production:
    "CONTEXT: Production mode. The reader is shipping this to a real codebase. Optimize for correctness, observability, security, failure modes, performance under realistic load, and maintainability. Call out anything that should be tested, monitored, or feature-flagged.",
};

const STRUCTURED_OUTPUT_FOOTER = `
Respond using this exact structure:
1. **Summary** — one-paragraph TL;DR.
2. **Reasoning** — step-by-step thought process.
3. **Solution** — the concrete answer (code, design, query, etc.).
4. **Edge Cases** — non-obvious inputs and failure modes.
5. **Trade-offs** — what you optimized for and what you gave up.
6. **Next Steps** — what to verify, test, or improve next.`;

export const prompts: Prompt[] = [
  {
    id: "dsa-explain",
    title: "Explain DSA Problem",
    category: "DSA",
    description:
      "Senior competitive-programmer breakdown of a DSA problem with intuition, complexity, and an optimized solution.",
    template:
      `You are a senior competitive programmer (Codeforces grandmaster level) and an expert technical mentor. Analyze this problem with rigor:

Problem:
{problem}
Target language: {language}

Deliver:
- Restated problem in your own words and assumed constraints.
- Intuition and key observations (why naive approaches fail).
- Brute-force baseline with complexity, then progressively optimized approaches.
- Final approach with annotated pseudocode, then clean idiomatic {language} code.
- Tight time/space complexity analysis (best, average, worst).
- Edge cases, overflow risks, and pitfalls.
- 2 follow-up variations an interviewer might ask.` + STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Senior competitive programmer mode. Problem: {problem}. Language: {language}. Give intuition, optimal approach, clean code, and time/space complexity. Be terse.",
    inputs: ["problem", "language"],
    chain: [
      {
        step: "Understand",
        template:
          "Restate this problem in your own words, list assumptions, constraints, and 5 illustrative test cases (including edge cases): {problem}",
      },
      {
        step: "Brute-force",
        template:
          "Give the most obvious brute-force solution to: {problem}\nIn {language}. Include complexity and why it is unacceptable.",
      },
      {
        step: "Optimize",
        template:
          "Optimize the brute-force for: {problem}\nIdentify the bottleneck, the data structure / algorithmic insight that removes it, and prove the new complexity.",
      },
      {
        step: "Implement",
        template:
          "Write production-quality {language} code for the optimized solution to: {problem}\nWith comments, edge-case handling, and 3 unit tests.",
      },
    ],
  },
  {
    id: "dsa-optimize",
    title: "Optimize Algorithm",
    category: "DSA",
    description: "Improve runtime or memory of an existing algorithm with a rigorous trade-off analysis.",
    template:
      `Act as a staff engineer reviewing an algorithm for performance.

Language: {language}
Code:
{code}

Do:
- Profile mentally: identify the dominant cost (CPU, memory, allocations, cache, I/O).
- Propose 2 optimizations: one safe refactor, one aggressive rewrite.
- Provide the optimized {language} code, fully runnable.
- New time/space complexity with proof sketch.
- Trade-offs: readability, memory, parallelism, numerical stability.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Optimize this {language} code. Give optimized version + new complexity + 1-line trade-off:\n{code}",
    inputs: ["language", "code"],
  },
  {
    id: "debug-stack",
    title: "Debug Stack Trace",
    category: "Debugging",
    description: "Root-cause an error from a stack trace and code, then propose a verified fix.",
    template:
      `Act as a senior debugger. Use first-principles root-cause analysis, not guesswork.

Error:
{error}

Code:
{code}

Do:
- Parse the stack trace and identify the exact failure site and call path.
- Hypothesize the top 3 root causes ranked by likelihood, with the evidence for each.
- Identify the actual root cause and explain the underlying mechanism.
- Provide a corrected version of the code with the minimal diff.
- Add a regression test that would have caught this.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Debug this. Error:\n{error}\nCode:\n{code}\nGive root cause in 1 sentence + corrected code.",
    inputs: ["error", "code"],
  },
  {
    id: "debug-flaky",
    title: "Fix Flaky Test",
    category: "Debugging",
    description: "Diagnose nondeterminism in tests and rewrite for reliability.",
    template:
      `You are a test-infrastructure expert. Eliminate nondeterminism in this test.

Framework: {framework}
Test:
{code}

Do:
- Enumerate likely sources of flakiness: timing, async ordering, shared state, network, fixtures, time/randomness.
- Rank causes by likelihood given the code.
- Rewrite the test to be deterministic (fake timers, explicit waits, hermetic fixtures, seeded randomness).
- Note any production code smells the test exposed.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Fix this flaky {framework} test. Top cause + deterministic rewrite:\n{code}",
    inputs: ["code", "framework"],
  },
  {
    id: "sysdesign-scale",
    title: "Design Scalable System",
    category: "System Design",
    description: "Senior-engineer system design with trade-offs, capacity math, and an ASCII diagram.",
    template:
      `Act as a principal engineer doing a system design interview / RFC.

Product: {product}
Expected scale: {scale}

Deliver:
- Functional and non-functional requirements (latency, availability, consistency, durability targets).
- Capacity estimates: QPS, storage, bandwidth, with arithmetic shown.
- High-level architecture with an ASCII diagram (clients, edges, services, datastores, async pipeline).
- Data model with key tables/collections and access patterns.
- API surface (top 5-10 endpoints).
- Caching, queues, sharding, replication strategy.
- Failure modes, back-pressure, and how the system degrades.
- Trade-offs vs alternatives explicitly considered.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Design {product} for {scale}. Give: requirements, capacity math, ASCII architecture, data model, top trade-offs.",
    inputs: ["product", "scale"],
    chain: [
      {
        step: "Clarify",
        template:
          "Before designing {product} for {scale}, list the clarifying questions you would ask a PM and your default assumptions for each.",
      },
      {
        step: "High-level design",
        template:
          "Sketch a high-level architecture for {product} at {scale}. ASCII diagram, components, request path, data flow.",
      },
      {
        step: "Deep dive",
        template:
          "Pick the 2 highest-risk components from the {product} design ({scale}) and deep-dive: data model, sharding, consistency, failure modes.",
      },
      {
        step: "Bottlenecks & evolution",
        template:
          "For {product} at {scale}: identify the first 3 bottlenecks you'll hit, how to detect them, and the next architectural step.",
      },
    ],
  },
  {
    id: "sysdesign-review",
    title: "Architecture Review",
    category: "System Design",
    description: "Critique an architecture and recommend prioritized improvements.",
    template:
      `Act as a principal engineer running an architecture review.

Architecture:
{architecture}

Deliver:
- Strengths worth preserving.
- Bottlenecks, single points of failure, and security risks (ranked by blast radius).
- Cost, operability, and on-call concerns.
- Concrete improvements as a prioritized backlog (P0 / P1 / P2) with rough effort.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Review this architecture. Top 3 risks + prioritized fixes:\n{architecture}",
    inputs: ["architecture"],
  },
  {
    id: "web-component",
    title: "Build React Component",
    category: "Web Dev",
    description: "Production-grade React + TypeScript + Tailwind component with accessibility baked in.",
    template:
      `Act as a senior frontend engineer. Build a production-quality component.

Component name: {name}
Requirements:
{requirements}

Stack: React 19 + TypeScript (strict) + Tailwind CSS. Use semantic HTML and ARIA. Forward refs where appropriate. No \`any\`. No inline color values.

Deliver:
- Public prop types with JSDoc.
- The component implementation.
- Keyboard interaction and focus management notes.
- A usage example.
- A short test plan (unit + a11y).` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Build a React+TS+Tailwind component {name}. Requirements:\n{requirements}\nReturn typed code + usage example.",
    inputs: ["name", "requirements"],
  },
  {
    id: "web-refactor",
    title: "Refactor Frontend Code",
    category: "Web Dev",
    description: "Refactor frontend code for clarity, performance, and maintainability.",
    template:
      `Act as a staff frontend engineer doing a focused refactor.

Stack: {tech_stack}
Code:
{code}

Do:
- Identify code smells, perf footguns (re-renders, unmemoized work, layout thrash), and a11y gaps.
- Refactor incrementally; preserve behavior.
- Explain each non-trivial change.
- Note follow-ups not done in this pass.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Refactor this {tech_stack} code for clarity & perf. Brief change log:\n{code}",
    inputs: ["tech_stack", "code"],
  },
  {
    id: "sql-query",
    title: "Write SQL Query",
    category: "SQL",
    description: "Optimized SQL query with a query-plan rationale and indexing advice.",
    template:
      `Act as a senior database engineer.

Dialect: {dialect}
Schema:
{schema}

Goal: {goal}

Deliver:
- A correct, optimized {dialect} query.
- The expected query plan in plain English (joins, scans, sorts).
- Indexes that would help, and why each one.
- Pitfalls: NULL handling, collation, time zones, large-result performance.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Write a {dialect} query.\nSchema:\n{schema}\nGoal: {goal}\nReturn query + recommended index.",
    inputs: ["dialect", "schema", "goal"],
  },
  {
    id: "sql-explain",
    title: "Explain SQL Query",
    category: "SQL",
    description: "Plain-English breakdown of a SQL query with performance recommendations.",
    template:
      `Act as a senior database engineer.

Query:
{query}

Do:
- Explain the query step-by-step in plain English (logical → physical execution order).
- Identify likely performance issues.
- Suggest rewrites and indexes with expected impact.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate: "Explain this SQL + perf advice:\n{query}",
    inputs: ["query"],
  },
  {
    id: "interview-mock",
    title: "Mock Technical Interview",
    category: "Interview",
    description: "Run an interactive mock interview round with detailed feedback.",
    template:
      `Act as a senior engineer interviewing me for a {role} role at a {company_type} company.

Topic: {topic}

Rules:
- Ask one question at a time. Wait for my answer before continuing.
- After each answer, give detailed feedback: what was strong, what was missing, hire-signal commentary, and a model answer outline.
- Progressively increase difficulty.
- After 4 questions, deliver a hire/no-hire summary with a leveling estimate.` +
      STRUCTURED_OUTPUT_FOOTER,
    conciseTemplate:
      "Mock interview: {role} @ {company_type}. Topic: {topic}. One question at a time, then feedback.",
    inputs: ["role", "company_type", "topic"],
  },
  {
    id: "interview-behavioral",
    title: "Behavioral STAR Answer",
    category: "Interview",
    description: "Polished STAR-format answer for a behavioral question.",
    template:
      `Act as an executive interview coach.

Question: "{question}"
My experience:
{experience}

Deliver a concise, high-signal STAR answer:
- **Situation** — context in 1-2 sentences.
- **Task** — your specific responsibility.
- **Action** — what *you* did, with concrete decisions and trade-offs.
- **Result** — quantified impact and what you learned.
Then list 2 likely follow-up questions and how to handle them.`,
    conciseTemplate:
      "STAR answer to: \"{question}\". My experience:\n{experience}\nKeep it tight (under 200 words).",
    inputs: ["question", "experience"],
  },
];

export const categories = [
  "DSA",
  "Debugging",
  "System Design",
  "Web Dev",
  "SQL",
  "Interview",
] as const;
