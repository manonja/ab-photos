import { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getTags } from '../../lib/ghost/client';
import PostCard from '../../components/blog/PostCard';
import { GhostTag } from '../../lib/ghost/types';

export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Blog | Anton Bossenbroek Photography',
  description: 'Photography insights, stories, and adventures from Anton Bossenbroek.',
};

export default async function BlogPage() {
  // Fetch posts and tags
  const [posts, tags] = await Promise.all([
    getPosts({ limit: 9 }),
    getTags(),
  ]);

  // Filter to show only tags that have posts
  const popularTags = tags
    .filter((tag: GhostTag) => tag.name !== 'portfolio' && tag.name !== 'work')
    .slice(0, 10);

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold">Blog</h1>
        <p>No posts found. Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Blog</h1>
          <p className="text-lg text-gray-600">Photography insights, stories, and adventures.</p>
        </div>
        {popularTags.length > 0 && (
          <div className="mt-4 md:mt-0">
            <h2 className="mb-2 text-sm font-medium uppercase text-gray-500">Browse by tag</h2>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag: GhostTag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length >= 9 && (
        <div className="mt-12 text-center">
          <Link
            href="/blog/page/2"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Load more posts
          </Link>
        </div>
      )}
    </div>
  );
} 