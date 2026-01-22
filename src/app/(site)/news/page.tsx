import { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getAllBlogPosts } from '@/lib/blog';
import { prepareBlogPostForDisplay } from '@/lib/blog/adapter';
import PostCard from '@/components/news/PostCard';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'News | Anton Bossenbroek Photography',
  description: 'Photography News, stories, and adventures from Anton Bossenbroek.',
};

interface PayloadPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  featuredImage?: { url?: string } | null;
  type: 'essay' | 'short';
}

export default async function NewsPage() {
  let payloadPosts: PayloadPost[] = [];
  let legacyPosts: ReturnType<typeof prepareBlogPostForDisplay>[] = [];

  // Try to fetch from Payload CMS
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 20,
    });
    payloadPosts = result.docs as unknown as PayloadPost[];
  } catch {
    // Payload not available
  }

  // Fetch legacy posts
  try {
    const blogPosts = await getAllBlogPosts();
    legacyPosts = blogPosts.map(prepareBlogPostForDisplay);
  } catch {
    // Legacy blog not available
  }

  // Transform Payload posts to match the expected format
  const transformedPayloadPosts = payloadPosts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    published_at: post.publishedAt || new Date().toISOString(),
    feature_image: post.featuredImage?.url || null,
    primary_author: null,
    tags: [],
    html: '',
    source: 'payload' as const,
  }));

  // Combine and sort by date
  const allPosts = [...transformedPayloadPosts, ...legacyPosts.map(p => ({ ...p, source: 'legacy' as const }))];
  allPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  if (allPosts.length === 0) {
    return (
      <main className="flex min-h-screen flex-col lg:w-[90%] lg:p-6 p-2">
        <div className="w-full max-w-[50%] lg:mx-0 mx-auto py-8">
          <p>No posts found. Check back soon for new content!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col lg:w-[90%] lg:p-6 p-2">
      <div className="w-full py-8">
        <div className="w-full max-w-4xl">
          <h1 className="uppercase text-2xl font-light mb-8">Articles</h1>
          <div className="my-8 h-px bg-white w-full"/>
          <div className="space-y-16">
            {allPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {allPosts.length >= 9 && (
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
  );
}
