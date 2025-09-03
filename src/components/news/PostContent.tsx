import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Using HTML content
import { BlogPostDisplay } from '../../lib/blog/types';

interface PostContentProps {
  post: BlogPostDisplay & { htmlContent?: string };
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  // Format date: "May 8, 2023"
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get the HTML content
  const HTMLContent = post.htmlContent;

  return (
    <article className="mx-auto lg:max-w-7xl max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Featured Image - Left Side Panel */}
        {post.feature_image && (
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="relative w-full overflow-hidden rounded-lg">
                <Image
                  src={post.feature_image}
                  alt={post.title}
                  width={500}
                  height={670}
                  priority
                  className="object-cover w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Title and meta */}
          <header className="mb-8">
            {/* Tags - uncomment when we have tags defined
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/news/tag/${tag.slug}`}
                    className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )} */}

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

            {/* Meta */}
            <div className="mb-8 flex items-center">
              {post.primary_author?.profile_image && (
                <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={post.primary_author.profile_image}
                    alt={post.primary_author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                {post.primary_author && (
                  <p className="font-medium">{post.primary_author.name}</p>
                )}
              </div>
            </div>
          </header>

          {/* HTML Content */}
          <div 
            className="blog-content prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: HTMLContent || '' }}
          />

          {/* Footer */}
          <footer className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-wrap items-center justify-between">
              <div className="mb-4">
                <h3 className="text-lg font-bold">Share this post</h3>
                <div className="mt-2 flex space-x-4">
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/news/${post.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-pink-600"
                  >
                    Twitter
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/news/${post.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-pink-600"
                  >
                    Facebook
                  </a>
                  <a 
                    href={`https://www.instagram.com/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/news/${post.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-pink-600"
                  >
                    Instagram
                  </a>
                </div>
              </div>
              <Link href="/news" className=" hover:text-pink-600">
                ← Back to all posts
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default PostContent;