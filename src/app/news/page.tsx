import { Metadata } from 'next';
import Link from 'next/link';
// import { getPosts } from '../../lib/ghost/client';
import { getAllBlogPosts } from '@/lib/blog';
import { blogPostToGhostPost } from '@/lib/blog/adapter';
import PostCard from '../../components/news/PostCard';

// Removed edge runtime to allow filesystem access for MDX blog
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'News | Anton Bossenbroek Photography',
  description: 'Photography News, stories, and adventures from Anton Bossenbroek.',
};

export default async function NewsPage() {
  // Fetch posts from MDX
  const blogPosts = await getAllBlogPosts();
  // Convert to Ghost format for compatibility
  const posts = blogPosts.map(blogPostToGhostPost);

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>No posts found. Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="w-full max-w-[75%] mx-auto py-8">
          <div className="space-y-16">
            {posts.map(post => (
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
      </main>
    </>
  );
} 