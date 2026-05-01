# PromptVault

PromptVault is a curated, structured library of AI prompts built for software engineers. It lets users browse by category, fill in prompt variables, generate ready-to-paste prompts, and save favorites for quick access.

## Highlights

- Structured prompt library with categories like DSA, debugging, system design, SQL, web dev, and interviews.
- Prompt builder that fills placeholders and adds contextual preambles (Learning, Interview, Production).
- Detailed vs concise prompt variants with a copy-ready output.
- Favorites stored locally for quick recall.
- Fast client-side search and category filtering.

## Tech Stack

- React 19 + TypeScript
- TanStack Router + TanStack Start
- Vite
- Tailwind CSS (v4) + Radix UI primitives
- Cloudflare compatibility via wrangler config

## Getting Started

### Prerequisites

- Node.js (modern LTS recommended)
- Bun (recommended) or npm/pnpm/yarn

### Install

```bash
bun install
```

### Run Dev Server

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

### Lint and Format

```bash
bun run lint
bun run format
```

## Project Structure

```
src/
  components/        # App UI and prompt cards
  components/ui/     # Reusable UI primitives (Radix + Tailwind)
  data/prompts.ts    # Prompt catalog, templates, and categories
  hooks/             # Theme and favorites persistence
  routes/            # Route components (library, favorites, prompt detail)
  router.tsx         # Router configuration
  styles.css         # Tailwind theme and global styles
```

## Key Features

### Prompt Library
Browse all prompts, filter by category, or search by title/description. Each prompt has a description and a one-click copy action.

### Prompt Detail Builder
Each prompt can be customized with user inputs, a context mode, and detail level. The UI highlights filled placeholders and generates the final copyable prompt.

### Favorites
Favorites are stored in local storage, so they persist across sessions without a backend.

## Configuration Notes

- Global metadata and styles are set in the root route.
- Prompt data lives in `src/data/prompts.ts` and can be extended with new categories, templates, or prompt chains.
- Theme toggling is handled client-side via `localStorage`.

## Deployment

This project is compatible with Cloudflare Workers (see `wrangler.jsonc`). If you plan to deploy elsewhere, use the standard Vite build output and adjust hosting as needed.