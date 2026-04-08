import { findAllNews, findAllNewsTags, findNewsBySlug, findNewsByTag } from '@/db/operations'
import type { NewsPost } from '@/db/types'

const FALLBACK_NEWS: NewsPost[] = [
  {
    id: 'sunsetting-64-megatons-artist-feature-der-greif',
    title: 'Sunsetting 64 Megatons - Artist Feature on Der Greif',
    date: '2026-02-20',
    author: 'Anton Bossenbroek',
    excerpt: 'Artist Feature on Der Greif...',
    featuredImage: null,
    tags: [],
    published: true,
    layout: 'single',
    content: '',
  },
  {
    id: 'notes-from-the-field-johannesburg-and-east-mpumalanga-south-africa',
    title: 'Notes from the field - Johannesburg and East Mpumalanga, South Africa',
    date: '2025-09-03',
    author: 'Guest Post - Manon Jacquin',
    excerpt: 'A glimpse into the first few days of a two months scouting trip...',
    featuredImage: null,
    tags: [],
    published: true,
    layout: 'two-column',
    content: '',
  },
]

export async function getAllNews(): Promise<NewsPost[]> {
  // Strategy 1: Direct DB access (works on Cloudflare Workers runtime)
  try {
    console.log('[Action] getAllNews: Direct DB fetch')
    const posts = await findAllNews()
    console.log('[Action] getAllNews: DB success', { postCount: posts.length })
    return posts
  } catch (dbError) {
    console.warn('[Action] getAllNews: Direct DB access failed (expected during build)', dbError)
  }

  // Strategy 2: HTTP fetch fallback (works during next build)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (baseUrl) {
    try {
      console.log('[Action] getAllNews: HTTP fetch fallback')
      const response = await fetch(`${baseUrl}/api/news`, {
        next: { revalidate: 3600 },
      })
      if (response.ok) {
        const data = (await response.json()) as NewsPost[]
        console.log('[Action] getAllNews: HTTP success', { postCount: data.length })
        return data
      }
    } catch (fetchError) {
      console.error('[Action] getAllNews: HTTP fetch also failed', fetchError)
    }
  }

  // Strategy 3: Static fallback
  console.warn('[Action] getAllNews: All strategies failed, returning fallback')
  return FALLBACK_NEWS
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  // Strategy 1: Direct DB access
  try {
    console.log('[Action] getNewsBySlug: Direct DB fetch', { slug })
    const post = await findNewsBySlug(slug)
    if (post) return post
    return null
  } catch (dbError) {
    console.warn('[Action] getNewsBySlug: Direct DB access failed (expected during build)', dbError)
  }

  // Strategy 2: HTTP fetch fallback
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (baseUrl) {
    try {
      console.log('[Action] getNewsBySlug: HTTP fetch fallback', { slug })
      const response = await fetch(`${baseUrl}/api/news/${slug}`, {
        next: { revalidate: 3600 },
      })
      if (response.ok) {
        return (await response.json()) as NewsPost
      }
      if (response.status === 404) return null
    } catch (fetchError) {
      console.error('[Action] getNewsBySlug: HTTP fetch also failed', fetchError)
    }
  }

  // Strategy 3: Return null
  console.warn('[Action] getNewsBySlug: All strategies failed, returning null')
  return null
}

export async function getNewsByTag(tag: string): Promise<NewsPost[]> {
  try {
    console.log('[Action] getNewsByTag: Fetching posts by tag', { tag })
    return await findNewsByTag(tag)
  } catch (error) {
    console.error('[Action] getNewsByTag: Failed', error)
    return []
  }
}

export async function getNewsTags(): Promise<string[]> {
  try {
    console.log('[Action] getNewsTags: Fetching all tags')
    return await findAllNewsTags()
  } catch (error) {
    console.error('[Action] getNewsTags: Failed', error)
    return []
  }
}
