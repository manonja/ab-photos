import type { Metadata } from 'next'
import Link from 'next/link'
import PostCard from '@/components/news/PostCard'
import { getAllBlogPosts } from '@/lib/blog'
import { prepareBlogPostForDisplay } from '@/lib/blog/adapter'

// Use edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge'
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'News | Anton Bossenbroek Photography',
  description: 'Photography News, stories, and adventures from Anton Bossenbroek.',
}

export default async function NewsPage() {
  // Fetch posts from HTML blog
  const blogPosts = await getAllBlogPosts()
  // Prepare posts for display
  const posts = blogPosts.map(prepareBlogPostForDisplay)

  if (!posts || posts.length === 0) {
    return (
      <main className="flex min-h-screen flex-col lg:w-[90%] lg:p-6 p-2">
        <div className="w-full max-w-[50%] lg:mx-0 mx-auto py-8">
          <p>No posts found. Check back soon for new content!</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col lg:w-[90%] lg:p-6 p-2">
      <div className="w-full py-8">
        <div className="w-full max-w-4xl">
          <h1 className="uppercase text-2xl font-light mb-8">Articles</h1>
          <div className="my-8 h-px bg-white w-full" />
          <div className="space-y-16">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {posts.length >= 9 && (
            <div className="mt-16 text-center">
              <Link
                href="/news/page/2"
                className="inline-block rounded-md bg-pink-600 px-6 py-3 text-white hover:bg-pink-600"
              >
                Load more posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
