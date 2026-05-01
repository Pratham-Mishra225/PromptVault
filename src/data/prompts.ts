export type Prompt = {
  id: string;
  title: string;
  category: "DSA" | "Debugging" | "System Design" | "Web Dev" | "SQL" | "Interview";
  description: string;
  template: string;
  inputs: string[];
};

export const prompts: Prompt[] = [
  {
    id: "dsa-explain",
    title: "Explain DSA Problem",
    category: "DSA",
    description: "Get a clear breakdown of a data structures & algorithms problem with intuition and complexity.",
    template:
      "You are an expert competitive programmer. Explain the following problem step-by-step:\n\nProblem: {problem}\n\nProvide:\n1. Intuition\n2. Approach (with pseudocode)\n3. Time & Space complexity\n4. Edge cases\n5. Optimized solution in {language}",
    inputs: ["problem", "language"],
  },
  {
    id: "dsa-optimize",
    title: "Optimize Algorithm",
    category: "DSA",
    description: "Improve runtime or memory of an existing algorithm implementation.",
    template:
      "Analyze and optimize this {language} code:\n\n{code}\n\nReturn the optimized version, explain trade-offs, and give the new time/space complexity.",
    inputs: ["language", "code"],
  },
  {
    id: "debug-stack",
    title: "Debug Stack Trace",
    category: "Debugging",
    description: "Diagnose an error and propose a fix from a stack trace and code snippet.",
    template:
      "I'm getting this error:\n\n{error}\n\nIn the following code:\n\n{code}\n\nIdentify the root cause, explain why it happens, and provide a corrected version.",
    inputs: ["error", "code"],
  },
  {
    id: "debug-flaky",
    title: "Fix Flaky Test",
    category: "Debugging",
    description: "Identify causes of intermittent test failures and stabilize them.",
    template:
      "This test is flaky:\n\n{code}\n\nFramework: {framework}\n\nList likely causes (timing, isolation, async, shared state) and rewrite it to be deterministic.",
    inputs: ["code", "framework"],
  },
  {
    id: "sysdesign-scale",
    title: "Design Scalable System",
    category: "System Design",
    description: "Architect a scalable system for a specified product with trade-offs.",
    template:
      "Design a scalable system for: {product}\n\nExpected scale: {scale}\n\nCover: high-level architecture, data model, APIs, caching, queues, scaling strategy, and trade-offs. Include an ASCII diagram.",
    inputs: ["product", "scale"],
  },
  {
    id: "sysdesign-review",
    title: "Architecture Review",
    category: "System Design",
    description: "Critique an existing architecture and recommend improvements.",
    template:
      "Review this architecture:\n\n{architecture}\n\nIdentify bottlenecks, single points of failure, and security risks. Recommend concrete improvements.",
    inputs: ["architecture"],
  },
  {
    id: "web-component",
    title: "Build React Component",
    category: "Web Dev",
    description: "Generate a production-ready React component with TypeScript and Tailwind.",
    template:
      "Build a React + TypeScript component called {name}.\n\nRequirements:\n{requirements}\n\nUse Tailwind CSS, accessible markup (ARIA), and include prop types. Provide usage example.",
    inputs: ["name", "requirements"],
  },
  {
    id: "web-refactor",
    title: "Refactor Frontend Code",
    category: "Web Dev",
    description: "Refactor a frontend file for readability, performance, and best practices.",
    template:
      "Refactor this {tech_stack} code for clarity, performance, and maintainability:\n\n{code}\n\nExplain each change.",
    inputs: ["tech_stack", "code"],
  },
  {
    id: "sql-query",
    title: "Write SQL Query",
    category: "SQL",
    description: "Generate an optimized SQL query from a natural language description.",
    template:
      "Database: {dialect}\nSchema:\n{schema}\n\nWrite an optimized SQL query that: {goal}\n\nExplain the query plan and any indexes that would help.",
    inputs: ["dialect", "schema", "goal"],
  },
  {
    id: "sql-explain",
    title: "Explain SQL Query",
    category: "SQL",
    description: "Break down a complex SQL query in plain English with performance notes.",
    template:
      "Explain this SQL query in plain English, step-by-step:\n\n{query}\n\nThen suggest performance improvements.",
    inputs: ["query"],
  },
  {
    id: "interview-mock",
    title: "Mock Technical Interview",
    category: "Interview",
    description: "Run a mock interview round on a chosen topic with feedback.",
    template:
      "Act as a senior engineer interviewing me for a {role} position at a {company_type} company.\n\nTopic: {topic}\n\nAsk one question at a time, wait for my answer, then give detailed feedback before the next question.",
    inputs: ["role", "company_type", "topic"],
  },
  {
    id: "interview-behavioral",
    title: "Behavioral STAR Answer",
    category: "Interview",
    description: "Craft a structured STAR-format answer to a behavioral question.",
    template:
      "Help me craft a STAR-format answer to: \"{question}\"\n\nMy experience:\n{experience}\n\nReturn a concise, impactful answer (Situation, Task, Action, Result).",
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
