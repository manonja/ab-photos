import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNewsBySlug } from '@/actions/getNewsDetails'
import PostContent from '../../../components/news/PostContent'

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getNewsBySlug(slug)

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
      description: post.excerpt ?? undefined,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export const dynamicParams = true

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  console.log('[NewsPostPage] Rendering with slug:', slug)
  const post = await getNewsBySlug(slug)

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
