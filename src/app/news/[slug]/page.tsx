import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getSinglePost } from '../../../lib/ghost/client';
import PostContent from '../../../components/news/PostContent';

export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

// Generate metadata for this page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getSinglePost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Anton Bossenbroek Photography',
    };
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
  };
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
  const post = await getSinglePost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="w-full max-w-[75%] mx-auto py-8">
          <PostContent post={post} />
        </div>
      </main>
    </>
  );
} 