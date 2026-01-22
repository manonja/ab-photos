# Payload CMS Integration - Implementation Complete

> Last updated: January 2026

---

## Status: Phases 1-4 Complete

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | OpenNext migration |
| Phase 2 | ✅ Complete | Payload CMS setup |
| Phase 3 | ✅ Complete | Collections & Blocks |
| Phase 4 | ✅ Complete | Frontend components |
| Phase 5 | 🔄 Ready | Data migration (manual via /admin) |
| Phase 6 | ⏳ Pending | Cleanup legacy files |
| Phase 7 | ⏳ Pending | Production deployment |

---

## Overview

AB Photos now uses Payload CMS for content management, deployed on Cloudflare Workers via OpenNext.

**Architecture:**
- **Database**: SQLite (local) / D1 (production) for Payload, Neon PostgreSQL for legacy photos
- **Storage**: Local filesystem (dev) / R2 (production) for media
- **Runtime**: Cloudflare Workers via OpenNext

---

## What Was Implemented

### Collections
- **Users** - Admin authentication with email/password
- **Media** - Image uploads with auto-resizing (thumbnail, medium, large)
- **Projects** - Photography projects with block-based layouts
- **Posts** - Blog articles (essays and shorts) with rich text
- **Exhibits** - Exhibition listings with dates, locations, related projects

### Blocks (for Projects)
- **Hero** - Full-width hero with image and title
- **Gallery** - Image grid (supports both existing photos and new uploads)
- **Text** - Rich text content
- **ImageText** - Side-by-side layout
- **Quote** - Styled quotation
- **Spacer** - Vertical spacing

### Route Structure
```
src/app/
├── (payload)/           # Payload admin (independent layout)
│   ├── admin/[[...segments]]/
│   ├── api/[...slug]/
│   └── layout.tsx
├── (site)/              # Main website (with Navbar)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── work/
│   ├── news/
│   └── ...
└── api/                 # Legacy API routes
```

---

## Production Deployment Checklist

### Prerequisites

- [x] Cloudflare account with Workers paid plan (for D1)
- [x] Wrangler CLI v4+ installed
- [x] D1 database created (`ab-photos-cms`)
- [x] R2 bucket created (`ab-photos-media`)
- [x] `@payloadcms/db-d1-sqlite` package installed

### Current Infrastructure

**wrangler.jsonc is already configured with:**
- D1 Database: `ab-photos-cms` (binding: `DB`)
- R2 Bucket: `ab-photos-media` (binding: `MEDIA_BUCKET`)

### Step 1: Set Production Secrets

```bash
# Payload secret (generate a secure 32+ char string)
wrangler secret put PAYLOAD_SECRET

# Neon database URL (for legacy photos)
wrangler secret put DATABASE_URL

# R2 credentials (for storage adapter)
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
wrangler secret put R2_ENDPOINT
wrangler secret put R2_BUCKET
```

### Step 2: Update payload.config.ts for D1

**Important:** For production deployment to Cloudflare Workers, you must update `payload.config.ts` to use the D1 adapter:

```typescript
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// Get D1 binding from Cloudflare context
const ctx = await getCloudflareContext({ async: true })

export default buildConfig({
  // ...
  db: sqliteD1Adapter({
    binding: ctx.env.DB, // D1 binding from wrangler.jsonc
  }),
  // ...
})
```

**Note:** The current setup uses file-based SQLite for local development. For production deployment, you'll need to either:
1. Update the config to conditionally use D1 (recommended for advanced users)
2. Create a separate production config
3. Use `npm run preview` (wrangler) for local development which provides D1 bindings

### Step 3: Run Migrations on D1

```bash
# Push schema to production D1
npm run payload:migrate

# Or manually execute migration files
wrangler d1 execute ab-photos-cms --remote --file=./src/migrations/XXXX_migration.sql
```

### Step 4: Deploy

```bash
npm run deploy
```

### Step 5: Create First Admin User

1. Visit `https://bossenbroek.photo/admin`
2. Create the first admin user
3. Start adding content

---

## Database Strategy

### Local Development (`npm run dev`)
- Uses file-based SQLite (`payload.db`)
- No Cloudflare bindings required
- Faster iteration for development

### Wrangler Preview (`npm run preview`)
- Uses D1 via wrangler's local proxy
- Simulates production environment
- Useful for testing before deployment

### Production (Cloudflare Workers)
- Uses D1 database via bindings
- Uses R2 for media storage
- Full production environment

---

## Environment Variables Reference

### Local Development (.env.local)

```bash
# Payload CMS
PAYLOAD_SECRET=your-local-dev-secret-32-chars
PAYLOAD_DATABASE_URL=file:./payload.db
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Legacy database (Neon)
DATABASE_URL=postgres://...

# Optional: R2 (for testing uploads)
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
R2_BUCKET=ab-photos-media
```

### Production (Cloudflare Secrets)

```bash
PAYLOAD_SECRET=<secure-production-secret>
DATABASE_URL=<neon-connection-string>
R2_ACCESS_KEY_ID=<r2-access-key>
R2_SECRET_ACCESS_KEY=<r2-secret-key>
R2_ENDPOINT=<r2-endpoint>
R2_BUCKET=ab-photos-media
```

---

## Known Issues / Warnings

### Critical Dependency Warning
The following warning appears during build and is **safe to ignore**:
```
Critical dependency: the request of a dependency is an expression
```
This comes from Payload's dynamic import handler for job queues and doesn't affect functionality.

### Sharp Warning
If you see "sharp not installed" warning, ensure `sharp` is in dependencies and passed to config:
```typescript
import sharp from 'sharp'
export default buildConfig({
  sharp,
  // ...
})
```

---

## File Structure

```
src/
├── payload.config.ts       # Main Payload configuration
├── payload-types.ts        # Generated types (npm run generate:types)
├── collections/
│   ├── Users/index.ts
│   ├── Media/index.ts
│   ├── Projects/index.ts
│   ├── Posts/index.ts
│   └── Exhibits/index.ts
├── blocks/
│   ├── Hero/config.ts
│   ├── Gallery/config.ts
│   ├── Text/config.ts
│   ├── ImageText/config.ts
│   ├── Quote/config.ts
│   └── Spacer/config.ts
└── app/
    ├── (payload)/
    │   ├── admin/
    │   │   ├── [[...segments]]/
    │   │   │   ├── page.tsx
    │   │   │   └── not-found.tsx
    │   │   └── importMap.js
    │   ├── api/[...slug]/route.ts
    │   └── layout.tsx
    └── (site)/
        └── ...
```

---

## Next Steps

### Phase 5: Data Migration
1. Access `/admin` panel
2. Create Projects with block-based layouts
3. Create Posts from existing blog content
4. Add Exhibits data

### Phase 6: Cleanup
After content is migrated, remove:
- `src/utils/getSubtitle.ts`
- `src/utils/getDescription.ts`
- `src/data/exhibits.ts`
- `content/blog/` directory
- Old blog CLI scripts

### Phase 7: Deploy
1. Complete production checklist above
2. Run `npm run deploy`
3. Verify `/admin` works in production
4. Verify frontend renders Payload content
