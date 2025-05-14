import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GhostPost } from '../../lib/ghost/types';

interface PostContentProps {
  post: GhostPost;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  // Format date: "May 8, 2023"
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mx-auto max-w-4xl">
      {/* Post Header */}
      <header className="mb-8">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

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
            <p className="text-sm text-gray-600">
              {formattedDate} • {post.reading_time} min read
            </p>
          </div>
        </div>

        {/* Featured Image */}
        {post.feature_image && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={post.feature_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </header>

      {/* Post Content */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }} 
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 pt-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Share this post</h3>
            <div className="mt-2 flex space-x-4">
              {/* Share buttons could go here */}
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${post.slug}`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500"
              >
                Twitter
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${post.slug}`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500"
              >
                Facebook
              </a>
            </div>
          </div>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to all posts
          </Link>
        </div>
      </footer>
    </article>
  );
};

export default PostContent; 