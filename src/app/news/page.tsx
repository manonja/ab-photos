import { Metadata } from 'next';
import Link from 'next/link';
// import { getPosts } from '../../lib/ghost/client';
import { getAllBlogPosts } from '@/lib/blog';
import { blogPostToGhostPost } from '@/lib/blog/adapter';
import PostCard from '../../components/news/PostCard';

// Use edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'News | Anton Bossenbroek Photography',
  description: 'Photography News, stories, and adventures from Anton Bossenbroek.',
};

export default async function NewsPage() {
  // Fetch posts from HTML blog
  const blogPosts = await getAllBlogPosts();
  // Convert to Ghost format for compatibility
  const posts = blogPosts.map(blogPostToGhostPost);

  if (!posts || posts.length === 0) {
    return (
      <>
        {/* Background image with responsive classes */}
        <div className="fixed inset-0 -z-10 bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
            style={{ backgroundImage: "url('https://assets.bossenbroek.photo/industry/2.jpg')" }}
          />
          {/* Semi-transparent overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <main className="flex min-h-screen flex-col lg:w-[90%] justify-between items-center lg:p-6 p-2">
          <div className="mt-40 lg:pt-0 h-px bg-white w-full"/>
          <div className="w-full max-w-[75%] mx-auto py-8">
            <p>No posts found. Check back soon for new content!</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Background image with responsive classes */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 lg:opacity-80"
          style={{ backgroundImage: "url('https://assets.bossenbroek.photo/industry/2.jpg')" }}
        />
        {/* Semi-transparent overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <main className="flex min-h-screen flex-col lg:w-[90%] justify-between items-center lg:p-6 p-2">
        <div className="mt-40 lg:pt-0 h-px bg-white w-full"/>
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