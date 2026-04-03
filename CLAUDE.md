# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js 14 photography portfolio on Cloudflare Workers via OpenNext with D1 (SQLite) and R2 (images).

## Commands

```bash
# Development
npm run dev              # Next.js dev (port 3000)
npm run preview          # Local preview with wrangler
npm run deploy           # Build and deploy to Cloudflare Workers
npm run deploy:preview   # Deploy to preview environment

# Testing
npm run test             # Jest tests
npm run test:watch       # Jest watch mode
npm run lint             # ESLint
npx jest path/to/file    # Single test file

# Blog
npm run blog:new "Title" # Create new HTML post
npm run blog:list        # List all posts
npm run blog:publish     # Commit and push

# Environment
npm run secrets:local    # Get local env from 1Password
npm run secrets:cf       # Get Cloudflare env from 1Password
```

## Architecture

- **Runtime**: Cloudflare Workers via OpenNext (`open-next.config.ts`)
- **Server Components** by default; `'use client'` only for interactivity
- **Database**: Cloudflare D1 (SQLite) via `src/db/client.ts`
- **Storage**: Cloudflare R2 via `src/db/r2-client.ts`
- **Path alias**: `@/` maps to `src/`

```
src/
├── app/           # Pages + API routes (edge)
├── components/    # React components + __tests__/
├── actions/       # Server actions
├── db/            # Database client + operations
├── utils/         # Utilities
└── types/         # TypeScript definitions
content/blog/      # HTML blog posts with Tailwind
```

## Code Style

- Logging: `console.log('[Source] functionName: message', { context })`
- Sources: `[API]`, `[Action]`, `[DB]`, `[Config]`
- TypeScript strict mode, ES5 target for Cloudflare
- No `any` type; use `unknown` if type is truly unknown

## Testing

- **Jest**: jsdom, 1s timeout, mocks in `jest.setup.ts`
- **Playwright**: E2E against wrangler at `localhost:8788`
- Use semantic queries: `getByRole()`, `getByLabelText()`
- Use `data-testid` for stable selectors

## Workflow

- Commit and push frequently to trigger CI and catch issues early
- Keep commits small and focused on single logical changes
- Always verify CI passes before moving on to the next task

## Environment

Required in `.env.local` (see `.env.example`):
- `NEXT_PUBLIC_API_URL` - Public API endpoint
- `IMAGE_UPLOAD_API_KEY` - Upload API authentication
- `NEXT_PUBLIC_MAILCHIMP_*` - Mailchimp integration
