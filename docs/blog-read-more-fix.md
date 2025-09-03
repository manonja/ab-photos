# Blog "Read More" Link Fix

## Issue
The "read more" links on the /news page were not working - clicking them did not navigate to the individual blog posts.

## Root Cause
The issue was caused by a conflict between Next.js static generation and Cloudflare Pages edge runtime requirements:

1. The blog system was using `generateStaticParams()` without edge runtime
2. Cloudflare Pages requires edge runtime for dynamic routes
3. This caused a `ChunkLoadError` when clicking links because the pages weren't being properly generated

## Solution
Added edge runtime to blog pages to ensure compatibility with Cloudflare Pages:

```typescript
// src/app/news/[slug]/page.tsx
export const runtime = 'edge';
export const dynamicParams = true;

// src/app/news/page.tsx  
export const runtime = 'edge';
```

## Key Changes

1. **Added edge runtime** to both `/news` and `/news/[slug]` pages
2. **Removed `generateStaticParams()`** as it's incompatible with edge runtime on Cloudflare Pages
3. **Set `dynamicParams = true`** to allow runtime routing

## How It Works Now

- Blog posts are compiled to JSON at build time
- Pages are rendered at runtime using edge functions
- Links work correctly because routes are handled dynamically
- No more ChunkLoadError issues

## Testing

To verify the fix works:

```bash
# Build the project
npm run build

# Start dev server
npm run dev

# Visit http://localhost:3000/news
# Click any "Read More" link - it should navigate correctly
```

## Note for Production

The blog system now works correctly on Cloudflare Pages with:
- Zero monthly cost (no external CMS fees)
- Dynamic routing for blog posts
- Fast edge runtime performance
- Simple content management via markdown files