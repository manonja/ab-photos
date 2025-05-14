import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByTag, getTags } from '../../../../lib/ghost/client';
import PostCard from '../../../../components/blog/PostCard';
import { GhostTag } from '../../../../lib/ghost/types';

export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

// Generate metadata for this page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const posts = await getPostsByTag(params.slug);
  
  if (!posts || posts.length === 0) {
    return {
      title: 'Tag Not Found | Anton Bossenbroek Photography',
    };
  }
  
  // Get tag name from the first post's tags
  const tagName = posts[0].tags?.find((tag: GhostTag) => tag.slug === params.slug)?.name || params.slug;
  
  return {
    title: `${tagName} | Anton Bossenbroek Photography`,
    description: `Photography articles and stories about ${tagName.toLowerCase()}`,
  };
}

// Generate static paths for all tags
export async function generateStaticParams() {
  const tags = await getTags();
  
  return tags.map((tag: GhostTag) => ({
    slug: tag.slug,
  }));
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const posts = await getPostsByTag(params.slug);
  
  if (!posts || posts.length === 0) {
    notFound();
  }
  
  // Get tag name from the first post's tags
  const tagName = posts[0].tags?.find((tag: GhostTag) => tag.slug === params.slug)?.name || params.slug;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <Link href="/blog" className="mb-4 inline-block text-blue-600 hover:text-blue-800">
          ← Back to all posts
        </Link>
        <h1 className="mb-2 text-4xl font-bold">
          Tag: {tagName}
        </h1>
        <p className="text-lg text-gray-600">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with &ldquo;{tagName}&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
} 