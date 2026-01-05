# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AB Photos is a Next.js 15 photography portfolio website deployed on Cloudflare Workers via OpenNext. It features:
- **Payload CMS** for content management (Projects, Posts, Media, Exhibits)
- **SQLite** database for Payload CMS data (local dev), **D1** for production
- **Neon PostgreSQL** for legacy photo data (read-only)
- **Cloudflare R2** for media storage (production)
- **Server-side rendering** with React Server Components

## Key Commands

### Development
```bash
npm run dev              # NextJS dev server (localhost:3000)
npm run preview          # Build + OpenNext preview (localhost:8787)
npm run test             # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Run Next.js linter
```

### Payload CMS
```bash
npm run payload                  # Run Payload CLI
npm run payload:migrate          # Run database migrations
npm run payload:migrate:create   # Create new migration
npm run generate:types           # Generate Payload TypeScript types
```

### Production Build & Deploy
```bash
npm run build            # Build Next.js
npm run deploy           # Build + deploy to Cloudflare Workers
npm run deploy:preview   # Deploy preview branch
```

### Environment & Secrets
```bash
npm run secrets:local    # Get local env from 1Password
npm run secrets:cf       # Get Cloudflare env from 1Password
npm run cf-typegen       # Generate TypeScript types for CF bindings
```

## Payload CMS

### Admin Panel
Access at `/admin` - requires user authentication.

### Collections
| Collection | Slug | Description |
|------------|------|-------------|
| Users | `users` | Admin users with email/password auth |
| Media | `media` | Uploaded images with auto-resizing |
| Projects | `projects` | Photography projects with block-based layouts |
| Posts | `posts` | Blog articles (essays and shorts) |
| Exhibits | `exhibits` | Exhibition listings with dates/locations |

### Blocks (for Projects)
- **Hero** - Full-width hero image with title overlay
- **Gallery** - Grid of images (supports existing photos or new uploads)
- **Text** - Rich text content block
- **ImageText** - Side-by-side image and text
- **Quote** - Styled quotation block
- **Spacer** - Vertical spacing

### File Structure
```
src/
├── payload.config.ts       # Main Payload configuration
├── payload-types.ts        # Generated types (do not edit)
├── collections/            # Collection definitions
│   ├── Users/
│   ├── Media/
│   ├── Projects/
│   ├── Posts/
│   └── Exhibits/
├── blocks/                 # Block definitions
│   ├── Hero/
│   ├── Gallery/
│   ├── Text/
│   ├── ImageText/
│   ├── Quote/
│   └── Spacer/
└── app/
    ├── (payload)/          # Payload admin routes
    │   ├── admin/
    │   ├── api/[...slug]/
    │   └── layout.tsx
    └── (site)/             # Main website routes
        ├── layout.tsx      # Site layout with Navbar
        └── ...
```

### Environment Variables (Payload)
```bash
PAYLOAD_SECRET=your-32-char-secret      # Required: JWT secret
PAYLOAD_DATABASE_URL=file:./payload.db  # SQLite path (local dev)
# For production (Cloudflare):
# D1 database binding configured in wrangler.jsonc
```

### Common Payload Tasks

1. **Create new collection**: Add to `src/collections/`, register in `payload.config.ts`
2. **Add new block**: Create in `src/blocks/`, add to Projects collection
3. **Generate types after schema change**: Run `npm run generate:types`
4. **Run migrations**: `npm run payload:migrate`
5. **Access admin**: Visit `/admin` (create first user on initial setup)

## Architecture & Patterns

### Route Groups
- `(site)` - Main website with Navbar layout
- `(payload)` - Payload admin panel (independent layout)

### Database Architecture
```
┌─────────────────┐     ┌─────────────────┐
│ SQLite/D1       │     │ Neon PostgreSQL │
│ (Payload CMS)   │     │ (Legacy)        │
├─────────────────┤     ├─────────────────┤
│ - users         │     │ - photos        │
│ - media         │     │ - projects (old)│
│ - projects      │     │                 │
│ - posts         │     │                 │
│ - exhibits      │     │                 │
└─────────────────┘     └─────────────────┘
```

### Legacy Database (Neon PostgreSQL)
- Connection: `src/db/client.ts` exports `sql` (single queries) and `pool` (concurrent)
- Operations: `src/db/operations.ts` contains all database queries
- Error handling: Always catch `DatabaseError` with proper logging
- **Note**: Read-only access for existing photo galleries

### Routing Structure
- `/admin/*` - Payload CMS admin panel
- `/api/[...slug]` - Payload REST API
- `/api/photos/[slug]` - Legacy photo API (Neon)
- `/work/[slug]` - Project detail pages
- `/news/*` - Blog posts
- `/exhibitions` - Exhibition listings

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Path alias: `@payload-config` maps to `./src/payload.config.ts`

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
- Remote patterns configured for assets.bossenbroek.photo
- Sharp installed for Payload image resizing
- R2 storage for production media files

### Environment Variables
Critical variables:
- `PAYLOAD_SECRET` - Payload CMS JWT secret
- `PAYLOAD_DATABASE_URL` - SQLite database path
- `DATABASE_URL` - Neon PostgreSQL connection (legacy)
- `R2_*` - Cloudflare R2 credentials (production)
- `NEXT_PUBLIC_MAILCHIMP_*` - Mailchimp integration

### Deployment Notes
- Main branch deploys to production
- Preview deploys available via `npm run deploy:preview`
- D1 database must be created before first deploy
- R2 bucket must be created for media storage

### Common Tasks

1. **Adding content**: Use `/admin` panel to create Projects, Posts, Exhibits
2. **Database queries**: Add to `src/db/operations.ts` for legacy data
3. **New Payload collection**: Create in `src/collections/`, add to config
4. **Running tests**: Use `npm test` before commits
5. **Debugging locally**: Use `npm run dev` for Next.js, check `/admin` for CMS

## Coding Best Practices

### Version Control
- **Commit frequently**: Make small, atomic commits that represent single logical changes
- **Clear commit messages**: Use present tense, imperative mood (e.g., "Add photo carousel component", "Fix navigation menu overflow")
- **Branch strategy**: Create feature branches from main, use descriptive names (e.g., `feature/gallery-zoom`, `fix/mobile-navigation`)

### Code Organization
- **Separation of concerns**: Keep Payload config in `/src/collections/` and `/src/blocks/`
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
