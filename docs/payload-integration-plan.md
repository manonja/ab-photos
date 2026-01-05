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

- [ ] Cloudflare account with Workers paid plan (for D1)
- [ ] Wrangler CLI v4+ installed
- [ ] R2 bucket created for media storage

### Step 1: Create D1 Database

```bash
# Create the production database
wrangler d1 create ab-photos-payload

# Note the database_id returned
```

### Step 2: Update wrangler.jsonc

Add the D1 database ID to `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "ab-photos-payload",
      "database_id": "<YOUR_DATABASE_ID>"
    }
  ]
}
```

### Step 3: Create R2 Bucket

```bash
wrangler r2 bucket create ab-photos-media
```

### Step 4: Set Production Secrets

```bash
# Payload secret (generate a secure 32+ char string)
wrangler secret put PAYLOAD_SECRET

# Neon database URL (for legacy photos)
wrangler secret put DATABASE_URL

# R2 credentials (if using R2 storage adapter)
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
wrangler secret put R2_ENDPOINT
wrangler secret put R2_BUCKET
```

### Step 5: Update payload.config.ts for D1

For production, the SQLite adapter needs to use D1 binding:

```typescript
// In production, use D1 binding from Cloudflare environment
db: sqliteAdapter({
  client: {
    url: process.env.PAYLOAD_DATABASE_URL || 'file:./payload.db',
    // D1 uses the DB binding from wrangler.jsonc
  },
}),
```

### Step 6: Run Migrations on D1

```bash
# Apply migrations to production D1
wrangler d1 execute ab-photos-payload --file=./migrations/0001_initial.sql
```

### Step 7: Deploy

```bash
npm run deploy
```

### Step 8: Create First Admin User

1. Visit `https://yourdomain.com/admin`
2. Create the first admin user
3. Start adding content

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
