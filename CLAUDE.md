# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AB Photos is a Next.js 14 photography portfolio website deployed on Cloudflare Pages. It features server-side rendering, edge runtime optimization, and integrates with PostgreSQL (Neon), Ghost CMS, and Cloudflare Workers.

## Key Commands

### Development
```bash
npm run dev              # NextJS dev server (localhost:3000)
npm run dev:wrangler     # Build + Cloudflare dev (localhost:8788)
npm run test             # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Run Next.js linter
```

### Production Build & Deploy
```bash
npm run pages:build      # Build for Cloudflare Pages
npm run deploy           # Deploy to Cloudflare Pages
npm run deploy:preview   # Deploy preview branch
```

### Environment & Secrets
```bash
npm run secrets:local    # Get local env from 1Password
npm run secrets:cf       # Get Cloudflare env from 1Password
npm run cf-typegen       # Generate TypeScript types for CF bindings
```

## Architecture & Patterns

### Edge Runtime
All API routes use `export const runtime = 'edge'` for Cloudflare Workers compatibility. Avoid Node.js-specific APIs.

### Database (Neon PostgreSQL)
- Connection: `src/db/client.ts` exports `sql` (single queries) and `pool` (concurrent)
- Operations: `src/db/operations.ts` contains all database queries
- Error handling: Always catch `DatabaseError` with proper logging

### Routing Structure
- `/api/photos/[slug]/[photo_seq_id]` - Individual photo data
- `/api/photos/[slug]` - Project photos listing
- `/api/projects` - All projects
- `/work/[slug]` - Project detail pages with SSR

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Build errors temporarily ignored for mailchimp types (see tsconfig.json:87)

### Logging Convention
```typescript
console.log('[Source] functionName: message', { contextObject });
console.warn('[Source] functionName: Non-OK response', { status, statusText });
console.error('[Source] functionName: Error occurred', { error, params });
```

### Testing Requirements
- Place tests in `__tests__` directories
- Use `.test.ts` or `.test.tsx` extension
- Mock at top of file, reset in `beforeEach`
- Test async operations with `async/await`

### Image Optimization
- Remote patterns configured for Ghost CMS and assets.bossenbroek.photo
- Unoptimized in development for faster builds
- Background images use custom caching strategy

### Environment Variables
Critical variables loaded from 1Password:
- `DATABASE_URL` - Neon PostgreSQL connection
- `DIRECT_URL` - Direct PostgreSQL connection
- `NEXT_PUBLIC_API_URL` - API endpoint (auto-configured)
- `NEXT_PUBLIC_MAILCHIMP_*` - Mailchimp integration
- Ghost CMS credentials

### Deployment Notes
- Main branch deploys to production
- Preview deploys available via `npm run deploy:preview`
- CORS configured for bossenbroek.photo domain
- Assets served from separate Cloudflare Worker

### Common Tasks

1. **Adding a new API route**: Create in `src/app/api/`, add `export const runtime = 'edge'`
2. **Database queries**: Add to `src/db/operations.ts`, use proper error handling
3. **New project page**: Update `src/app/work/[slug]/page.tsx` and related components
4. **Running tests**: Use `npm test` before commits, ensure all pass
5. **Debugging locally**: Use `npm run dev` for quick iteration, `npm run dev:wrangler` for CF testing

## Coding Best Practices

### Version Control
- **Commit frequently**: Make small, atomic commits that represent single logical changes
- **Clear commit messages**: Use present tense, imperative mood (e.g., "Add photo carousel component", "Fix navigation menu overflow")
- **Branch strategy**: Create feature branches from main, use descriptive names (e.g., `feature/gallery-zoom`, `fix/mobile-navigation`)

### Code Organization
- **Separation of concerns**: Keep business logic in `/src/db/operations.ts`, UI components in their respective directories
- **Single responsibility**: Each function/component should do one thing well
- **Data fetching**: Server components for SSR data, client components only for interactivity
- **Shared logic**: Extract to `/src/utils/` or `/src/lib/` directories

### Testing Requirements
- **Write tests first**: For critical features and bug fixes
- **Test coverage**: Maintain minimum 80% coverage on business logic
- **Test structure**: Use describe blocks, test both success and error cases
- **Mock external dependencies**: Database, API calls, and third-party services
- **Run before commit**: Always execute `npm test` before pushing code

### Code Quality
- **Linting**: Run `npm run lint` before commits, fix all warnings
- **No eslint-disable**: Address linting issues properly, don't suppress them
- **Format consistently**: Follow existing code style in the repository

### TypeScript Strictness
- **No `any` type**: Always define proper types, use `unknown` if type is truly unknown
- **Explicit return types**: Define return types for all functions
- **Null safety**: Handle null/undefined cases explicitly
- **Type imports**: Use `import type` for type-only imports
- **Interface over type**: Prefer interfaces for object shapes, types for unions/primitives