// Edge-compatible blog functions that use pre-compiled JSON data

import compiledPosts from './compiled/posts.json'
import type { BlogPost } from './types'

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  console.log('[Blog] getAllBlogPosts: Fetching from pre-compiled data')

  // Return pre-compiled posts with HTML content
  const posts = compiledPosts.posts.map((post) => ({
    ...post,
    // Content is now HTML string from JSON, not a React component
    content: post.content as unknown as BlogPost['content'], // We'll render this as HTML
  }))

  // Filter published posts and sort by date
  return posts
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log('[Blog] getBlogPostBySlug: Fetching post by slug:', slug)

  const postData = compiledPosts.posts.find((p) => p.slug === slug)
  if (!postData || postData.published === false) {
    console.log('[Blog] Post not found or unpublished:', slug)
    return null
  }

  return {
    ...postData,
    content: postData.content as unknown as BlogPost['content'], // We'll render this as HTML
  } as BlogPost
}

export async function getBlogTags(): Promise<string[]> {
  const tagSet = new Set<string>()

  for (const post of compiledPosts.posts.filter((post) => post.published !== false)) {
    for (const tag of post.tags) {
      tagSet.add(tag)
    }
  }

  return Array.from(tagSet).sort()
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.filter((post) => post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
}
