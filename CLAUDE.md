# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (builds env types + Next.js dev in parallel)
npm run build        # Production build
npm run build:ts     # Type-check only (no emit)
npm run lint         # ESLint (flat config, v9)
npm run format       # Prettier with import sorting + Tailwind class ordering
npm run storybook:dev   # Storybook dev server
npm run storybook:build # Build Storybook
```

Pre-commit hooks (Husky + lint-staged) run Prettier and ESLint on staged `.ts`/`.tsx` files automatically.

## Architecture

**Framework**: Next.js (Pages Router) with React 19 and TypeScript 5 strict mode.

### Directory Structure

```
src/
├── pages/                  # Next.js routes (thin wrappers — re-export from features/)
├── features/pages/         # Actual page implementations (page-specific, not reusable)
├── components/layout/      # Shared layout: MainLayout, Header, Footer, Page (SEO wrapper)
├── lib/
│   ├── @diegofrayo-pkg/    # Generic utilities (FP, browser, server, types, validation, hooks)
│   └── @diegofrayo-features/  # Domain features (auth, mdx, logger, routing, analytics, components)
├── data/                   # Static JSON data (resume, blog posts, site metadata)
├── constants/              # Routes, env vars, asset paths
├── styles/                 # Global CSS + Tailwind utilities
└── types/                  # Shared type definitions
```

### Path Aliases

- `~/*` → `src/*`
- `@diegofrayo-pkg/*` → `src/lib/@diegofrayo-pkg/*`
- `@diegofrayo-features/*` → `src/lib/@diegofrayo-features/*`

### Page Pattern

Pages follow a two-layer pattern:
1. `src/pages/foo.ts` — minimal Next.js entry, re-exports the component and `getStaticProps` from `features/pages/`
2. `src/features/pages/foo/` — contains the actual page component, styles, and page-specific logic

Every page wraps content in `<Page>` (SEO/meta) → `<MainLayout>` (header/footer).

### Data Flow

All data is static — no API routes. Data is loaded at build time via `getStaticProps`:
- `src/data/metadata.json` — site-wide SEO and author info
- `src/data/resume.json` — bilingual (ES/EN) resume content
- `src/data/blog/posts.json` — blog post index
- `src/data/blog/posts/*.json` — individual post content (MDX as a string field)

### Blog / MDX

Blog posts are stored as JSON files with MDX content as a string. `mdx-bundler` compiles MDX server-side in `getStaticProps`; the result is rendered client-side with a dynamic component map. Syntax highlighting uses `sugar-high`.

### Components

- **Primitives** (`@diegofrayo-features/components/primitive`): Box, Button, Icon, Text, Link, Title — the base building blocks
- **Shared** (`@diegofrayo-features/components/shared`): TypingTextEffect, Callout, Toast, Tooltip, Popover
- Radix UI and Base UI back accessible primitives; Lucide React for icons; Sonner for toasts

### Styling

Tailwind CSS v4 with PostCSS. Use `cn()` utility for class merging. CVA (`class-variance-authority`) for component variants. Prettier is configured to auto-sort Tailwind classes — let it handle ordering.

### Authentication

Simple token-based auth: `?auth_token=<token>` on `/sign-in` validates against `NEXT_PUBLIC_AUTH_TOKEN`, stores session in browser storage. `_app.tsx` blocks rendering until session is checked. This is intentionally minimal.

### Resume Bilingual Context

The resume page uses a React Context (`resume.context.ts`) to switch between ES/EN without a page reload. Language state lives client-side.

### External Images

Remote images are served from Tigris CDN (`https://dfrz-public.t3.storage.dev/**`), configured as an allowed remote pattern in `next.config.ts`.

### TypeScript

Strict mode with `exactOptionalPropertyTypes` and `noUncheckedSideEffectImports`. ESLint enforces no `console` usage and strict unused variable rules.
