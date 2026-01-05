import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { getBlogPostBySlug } from '@/lib/blog';
import { prepareBlogPostForDisplay } from '@/lib/blog/adapter';
import PostContent from '@/components/news/PostContent';

export const revalidate = 3600;
export const dynamicParams = true;

interface PayloadPost {
  id: string;
  title: string;
  slug: string;
  content: object;
  excerpt?: string;
  publishedAt?: string;
  featuredImage?: { url?: string; alt?: string } | null;
  type: 'essay' | 'short';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Try Payload first
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'posts',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
    });

    const post = result.docs[0] as unknown as PayloadPost | undefined;
    if (post) {
      return {
        title: `${post.title} | Anton Bossenbroek Photography`,
        description: post.excerpt,
        openGraph: {
          title: post.title,
          description: post.excerpt,
          images: post.featuredImage?.url ? [post.featuredImage.url] : [],
          type: 'article',
          publishedTime: post.publishedAt,
        },
      };
    }
  } catch {
    // Fall through to legacy
  }

  // Try legacy
  const blogPost = await getBlogPostBySlug(slug);
  const post = blogPost ? prepareBlogPostForDisplay(blogPost) : null;

  if (!post) {
    return { title: 'Post Not Found | Anton Bossenbroek Photography' };
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
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try Payload first
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'posts',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
    });

    const payloadPost = result.docs[0] as unknown as PayloadPost | undefined;
    if (payloadPost) {
      return (
        <div className="flex min-h-screen flex-col items-center p-6">
          <div className="w-full max-w-[75%] mx-auto py-8">
            <article className="prose prose-invert prose-lg max-w-none">
              <h1 className="text-3xl md:text-4xl font-light uppercase mb-4">
                {payloadPost.title}
              </h1>
              {payloadPost.publishedAt && (
                <time className="text-sm text-gray-400 block mb-8">
                  {new Date(payloadPost.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              <RichText data={payloadPost.content} />
            </article>
          </div>
        </div>
      );
    }
  } catch {
    // Fall through to legacy
  }

  // Try legacy blog
  const blogPost = await getBlogPostBySlug(slug);
  const post = blogPost ? prepareBlogPostForDisplay(blogPost) : null;

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-[75%] mx-auto py-8">
        <PostContent post={post} />
      </div>
    </div>
  );
}
