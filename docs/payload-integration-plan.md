# Payload CMS Integration Implementation Plan

> Final plan with 2025 documentation updates

---

## Overview

Migrate AB Photos from Cloudflare Pages (edge runtime) to Cloudflare Workers (OpenNext) and integrate Payload CMS for content management.

**Key Decisions:**
- **Database**: HYBRID - D1 for Payload CMS (new content), Neon for legacy photos (read-only)
- **Photo Data**: HYBRID - Keep existing photos in Neon, new projects use Payload Media + D1
- **Content Migration**: MANUAL - Recreate content through /admin UI
- **Future Migration**: Eventually migrate all data to D1 (not in this phase)

**Key Sources Validated:**
- [OpenNext Cloudflare Get Started](https://opennext.js.org/cloudflare/get-started)
- [Payload CMS Installation](https://payloadcms.com/docs/getting-started/installation)
- [Payload on Cloudflare Workers](https://blog.cloudflare.com/payload-cms-workers/)
- [Payload Blocks Field](https://payloadcms.com/docs/fields/blocks)
- [Cloudflare D1 SQLite](https://developers.cloudflare.com/d1/)

---

## Phase 1: Foundation Migration (OpenNext)

### Step 1.1: Remove Old Tooling & Install OpenNext
```bash
npm uninstall @cloudflare/next-on-pages eslint-plugin-next-on-pages
npm install @opennextjs/cloudflare@latest
npm install -D wrangler@latest  # Ensure v3.99.0+
```

**Files to modify:**
- `package.json` - Update dependencies and scripts

### Step 1.2: Update package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  }
}
```

### Step 1.3: Create D1 Database
```bash
# Create D1 database for Payload CMS
wrangler d1 create ab-photos-cms
# Note the database_id returned (e.g., "abc123...")
```

### Step 1.4: Create wrangler.jsonc (Replaces wrangler.toml)
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "ab-photos",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "ab-photos-cms",
      "database_id": "<database-id-from-step-1.3>"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA_BUCKET",
      "bucket_name": "ab-photos-media"
    }
  ]
}
```

**Note:** Neon connection string still needed in `.dev.vars` for legacy photos table access.

### Step 1.5: Create open-next.config.ts
```typescript
import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
    },
  },
};

export default config;
```

### Step 1.6: Update next.config.mjs
- Remove `setupDevPlatform` import and call
- Remove `@cloudflare/next-on-pages` related code
- Keep existing image patterns, headers, etc.

### Step 1.7: Remove Edge Runtime Declarations
Remove `export const runtime = 'edge'` from:
- `src/app/layout.tsx`
- `src/app/api/hello/route.ts`
- `src/app/api/projects/route.ts`
- `src/app/api/photos/[slug]/route.ts`
- `src/app/api/photos/[slug]/[photo_seq_id]/route.ts`

### Step 1.8: Keep Neon Client for Legacy Photos
**File:** `src/db/client.ts`
- Keep existing Neon connection for legacy photos table (read-only access)
- Payload CMS will use D1 (separate database)
- No changes needed to existing database client

**Database Architecture:**
```
┌─────────────────┐     ┌─────────────────┐
│ Cloudflare D1   │     │ Neon PostgreSQL │
│ (ab-photos-cms) │     │ (existing)      │
├─────────────────┤     ├─────────────────┤
│ Payload tables: │     │ Legacy tables:  │
│ - projects      │     │ - photos        │
│ - posts         │     │ - projects (old)│
│ - exhibits      │     │                 │
│ - media         │     │                 │
│ - users         │     │                 │
└─────────────────┘     └─────────────────┘
       ▲                       ▲
       │                       │
   New content           Existing photos
   (via /admin)          (Gallery blocks)
```

### Step 1.9: Update .gitignore
Add:
```
.open-next
.dev.vars
```

### Step 1.10: Create R2 Bucket
```bash
wrangler r2 bucket create ab-photos-media
```

---

## CHECKPOINT 1: Verify OpenNext Migration
```bash
npm run preview
# Visit http://localhost:8787
# Test: Homepage loads, /work/7-rad works, API routes respond
```

**Commit:** "Migrate from Cloudflare Pages to Workers via OpenNext"

---

## Phase 2: Payload CMS Setup

### Step 2.1: Install Payload Dependencies
```bash
npm install payload @payloadcms/next @payloadcms/richtext-lexical @payloadcms/db-sqlite sharp graphql
npm install @payloadcms/storage-r2
```

### Step 2.2: Create payload.config.ts
**File:** `src/payload.config.ts`

Key config points:
- Use `@payloadcms/db-sqlite` with D1 binding
- Configure `lexicalEditor`
- Set up Live Preview URLs
- Define admin breakpoints

```typescript
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  db: sqliteAdapter({
    client: {
      // D1 binding from Cloudflare environment
      url: process.env.DB, // D1 binding name
    },
  }),
  // ... rest of config
})
```

### Step 2.3: Create Payload Admin Routes
**Files to create:**
- `src/app/(payload)/admin/[[...segments]]/page.tsx`
- `src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- `src/app/(payload)/layout.tsx`

### Step 2.4: Create Payload API Route
**File:** `src/app/(payload)/api/[...segments]/route.ts`

### Step 2.5: Add Environment Variables
Create `.dev.vars`:
```
# For Payload CMS
PAYLOAD_SECRET=your-32-char-secret
NEXT_PUBLIC_URL=http://localhost:3000

# For legacy photos (Neon - read-only access)
DATABASE_URL=postgres://...
```

### Step 2.6: Run Payload Migrations
```bash
npx payload migrate:create
npx payload migrate
```

---

## CHECKPOINT 2: Verify Payload Admin
```bash
npm run dev
# Visit http://localhost:3000/admin
# Create first admin user
# Verify admin panel loads
```

**Commit:** "Add Payload CMS core configuration and admin routes"

---

## Phase 3: Collections & Blocks

### Step 3.1: Create Media Collection
**File:** `src/collections/Media.ts`

### Step 3.2: Create Block Configs
**Files to create:**
- `src/blocks/Hero/config.ts`
- `src/blocks/Gallery/config.ts` - **HYBRID APPROACH**:
  - Support BOTH existing photos (via projectId reference) AND new Payload Media uploads
  - Add `photoSource` field: "existing" | "payload"
  - When "existing": use projectId to fetch from photos table
  - When "payload": use Media collection uploads
- `src/blocks/Text/config.ts`
- `src/blocks/ImageText/config.ts`
- `src/blocks/Quote/config.ts`
- `src/blocks/Spacer/config.ts`

### Step 3.3: Create Projects Collection
**File:** `src/collections/Projects.ts`
- Uses blocks field with all block types
- Includes slug, title, dateRange, isPublished, order

### Step 3.4: Create Posts Collection
**File:** `src/collections/Posts.ts`
- Type field (essay/short)
- Rich text content
- Tags array

### Step 3.5: Create Exhibits Collection
**File:** `src/collections/Exhibits.ts`
- Date range, location
- Relationship to projects

### Step 3.6: Create Users Collection
**File:** `src/collections/Users.ts`

### Step 3.7: Generate Payload Types
```bash
npx payload generate:types
```

---

## CHECKPOINT 3: Verify Collections
```bash
npm run dev
# Visit /admin
# Create a test project with blocks
# Create a test post
# Create a test exhibit
# Verify all collections work in admin
```

**Commit:** "Add Payload collections: Media, Projects, Posts, Exhibits, Users"

---

## Phase 4: Frontend Block Components

### Step 4.1: Create Block Frontend Components
**Files to create:**
- `src/blocks/Hero/Component.tsx`
- `src/blocks/Gallery/Component.tsx`
- `src/blocks/Text/Component.tsx`
- `src/blocks/ImageText/Component.tsx`
- `src/blocks/Quote/Component.tsx`
- `src/blocks/Spacer/Component.tsx`

### Step 4.2: Create BlockRenderer
**File:** `src/components/BlockRenderer.tsx`

### Step 4.3: Update /work/[slug] Page
**File:** `src/app/work/[slug]/page.tsx`
- Import `getPayload` from payload
- Query projects collection
- Use BlockRenderer for layout

### Step 4.4: Update /news Pages
**Files:**
- `src/app/news/page.tsx`
- `src/app/news/[slug]/page.tsx`
- Query posts collection instead of compiled JSON

### Step 4.5: Update /exhibitions Page
**File:** `src/app/exhibitions/page.tsx`
- Query exhibits collection

---

## CHECKPOINT 4: Verify Frontend Integration
```bash
npm run dev
# Create content in /admin
# Visit /work/[slug] - verify blocks render
# Visit /news - verify posts list
# Visit /exhibitions - verify exhibits
```

**Commit:** "Integrate Payload content into frontend pages"

---

## Phase 5: Data Migration

### Step 5.1: Migrate Projects
- Create 7-rad, pyrenees, industry in admin
- Build layouts using blocks
- Copy descriptions from utility files

### Step 5.2: Migrate Blog Posts
- Create posts from compiled HTML
- Convert to rich text

### Step 5.3: Migrate Exhibits
- Create from src/data/exhibits.ts data

---

## CHECKPOINT 5: Verify Content Migration
```bash
npm run dev
# Verify all migrated content displays correctly
# Test all URLs still work
```

**Commit:** "Migrate existing content to Payload CMS"

---

## Phase 6: Cleanup

### Step 6.1: Delete Old Files
```bash
rm src/utils/getSubtitle.ts
rm src/utils/getDescription.ts
rm src/utils/getComplementaryText.ts
rm src/data/exhibits.ts
rm src/data/exhibits.json
rm -rf src/lib/blog/
rm -rf content/blog/
rm scripts/blog-cli.js
rm scripts/compile-html.js
```

### Step 6.2: Remove Old Dependencies
- Remove blog-related imports
- Clean up unused types

### Step 6.3: Delete wrangler.toml
```bash
rm wrangler.toml
```

---

## CHECKPOINT 6: Final Verification
```bash
npm run preview
# Full site test on Workers runtime
# All pages work
# All content renders
# Live Preview works in admin
```

**Commit:** "Remove deprecated static content files and old blog system"

---

## Deployment

### Step 7.1: Set Production Secrets
```bash
wrangler secret put DATABASE_URL
wrangler secret put PAYLOAD_SECRET
```

### Step 7.2: Deploy
```bash
npm run deploy
```

---

## Critical Files Summary

**New Files:**
- `src/payload.config.ts`
- `src/payload-types.ts` (generated)
- `wrangler.jsonc`
- `open-next.config.ts`
- `src/app/(payload)/admin/[[...segments]]/page.tsx`
- `src/app/(payload)/api/[...segments]/route.ts`
- `src/collections/*.ts` (5 files)
- `src/blocks/*/config.ts` (6 files)
- `src/blocks/*/Component.tsx` (5 files)
- `src/components/BlockRenderer.tsx`

**Modified Files:**
- `package.json`
- `next.config.mjs`
- `src/app/layout.tsx` (remove edge runtime)
- `src/app/work/[slug]/page.tsx`
- `src/app/news/page.tsx`
- `src/app/news/[slug]/page.tsx`
- `src/app/exhibitions/page.tsx`
- All API routes (remove edge runtime)

**Kept As-Is:**
- `src/db/client.ts` (Neon connection for legacy photos - no changes needed)

**Deleted Files:**
- `wrangler.toml`
- `src/utils/getSubtitle.ts`
- `src/utils/getDescription.ts`
- `src/utils/getComplementaryText.ts`
- `src/data/exhibits.ts`
- `src/lib/blog/` (entire directory)
- `content/blog/` (entire directory)
- `scripts/blog-cli.js`
- `scripts/compile-html.js`

---

## Key Documentation Updates Applied

1. **OpenNext**: Using `wrangler.jsonc` with `compatibility_date: "2024-12-30"` and `global_fetch_strictly_public` flag
2. **Build Commands**: Using `opennextjs-cloudflare build` instead of `npx @opennextjs/cloudflare`
3. **Payload**: Latest installation with `@payloadcms/db-sqlite` for D1 + `@payloadcms/storage-r2` for R2
4. **Blocks**: Each block config in its own file for reusability
5. **Database**: D1 for Payload CMS, Neon kept for legacy photos (read-only)
6. **Hybrid Photos**: Gallery block supports both existing Neon photos AND new Payload Media uploads

---

## Prerequisites Checklist

- [ ] Cloudflare account (D1 free tier is sufficient)
- [ ] Neon PostgreSQL connection string (for legacy photos access)
- [ ] Wrangler CLI v3.99.0+
- [ ] Node.js 16.17.0+
