import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug } from '@/lib/blog'
import { prepareBlogPostForDisplay } from '@/lib/blog/adapter'
import PostContent from '../../../components/news/PostContent'

export const revalidate = 3600 // Revalidate every hour

// Generate metadata for this page
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const blogPost = await getBlogPostBySlug(params.slug)
  const post = blogPost ? prepareBlogPostForDisplay(blogPost) : null

  if (!post) {
    return {
      title: 'Post Not Found | Anton Bossenbroek Photography',
    }
  }

  return {
    title: `${post.title} | Anton Bossenbroek Photography`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.feature_image ? [post.feature_image] : [],
      type: 'article',
      publishedTime: post.published_at,
      authors: post.primary_author ? [post.primary_author.name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.feature_image ? [post.feature_image] : [],
    },
  }
}

// For Cloudflare Pages, we can't use generateStaticParams with edge runtime
// Instead, we'll handle dynamic routing at runtime
export const dynamicParams = true

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
  console.log('[NewsPostPage] Rendering with slug:', params.slug)
  const blogPost = await getBlogPostBySlug(params.slug)
  console.log('[NewsPostPage] Found blog post:', blogPost ? 'yes' : 'no')
  const post = blogPost ? prepareBlogPostForDisplay(blogPost) : null

  if (!post) {
    console.log('[NewsPostPage] Post not found, calling notFound()')
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-[75%] mx-auto py-8">
        <PostContent post={post} />
      </div>
    </div>
  )
}
