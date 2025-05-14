import { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getTags } from '../../lib/ghost/client';
import PostCard from '../../components/blog/PostCard';
import BlogHeader from '../../components/blog/BlogHeader';
import { GhostTag } from '../../lib/ghost/types';

export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Blog | Anton Bossenbroek Photography',
  description: 'Photography insights, stories, and adventures from Anton Bossenbroek.',
};

export default async function BlogPage() {
  // Fetch posts
  const posts = await getPosts({ limit: 9 });

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>No posts found. Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <>
      <BlogHeader />
      
      <div className="container mx-auto px-4 py-6">
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
    </>
  );
} 