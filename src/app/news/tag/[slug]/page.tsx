import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostsByTag, getBlogTags } from '@/lib/blog';
import { prepareBlogPostForDisplay } from '@/lib/blog/adapter';
import PostCard from '../../../../components/news/PostCard';

// Edge runtime for HTML blog
export const revalidate = 3600; // Revalidate every hour

// Generate metadata for this page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blogPosts = await getBlogPostsByTag(params.slug);
  
  if (!blogPosts || blogPosts.length === 0) {
    return {
      title: 'Tag Not Found | Anton Bossenbroek Photography',
    };
  }
  
  // Format tag name for display
  const tagName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${tagName} | Anton Bossenbroek Photography`,
    description: `Photography articles and stories about ${tagName.toLowerCase()}`,
  };
}

// Generate static paths for all tags
export async function generateStaticParams() {
  const tags = await getBlogTags();
  
  return tags.map(tag => ({
    slug: tag.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// Required for Cloudflare Pages with dynamic routes
export const dynamicParams = false;

export default async function TagPage({ params }: { params: { slug: string } }) {
  const blogPosts = await getBlogPostsByTag(params.slug);
  
  if (!blogPosts || blogPosts.length === 0) {
    notFound();
  }
  
  // Prepare posts for display
  const posts = blogPosts.map(prepareBlogPostForDisplay);
  
  // Format tag name for display
  const tagName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="w-full max-w-[75%] mx-auto py-8">
          <div className="mb-12">
            <Link href="/news" className="mb-4 inline-block text-gray-400 hover:text-white">
              ← Back to all posts
            </Link>
            <h1 className="mb-2 text-4xl font-bold">
              Tag: {tagName}
            </h1>
            <p className="text-lg text-gray-500">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with &ldquo;{tagName}&rdquo;
            </p>
          </div>

          <div className="space-y-16">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
} 