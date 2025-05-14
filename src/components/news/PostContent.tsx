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
    <article className="mx-auto max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Title and meta */}
          <header className="mb-8">
            {/* Tags */}
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
          </header>

          {/* Post Content */}
          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.html }} 
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
                    className="text-gray-500 hover:text-blue-500"
                  >
                    Twitter
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/news/${post.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-500"
                  >
                    Facebook
                  </a>
                </div>
              </div>
              <Link href="/news" className="text-blue-600 hover:text-blue-800">
                ← Back to all posts
              </Link>
            </div>
          </footer>
        </div>

        {/* Featured Image - Right Side Panel */}
        <div className="lg:w-1/3">
          {post.feature_image && (
            <div className="sticky top-8">
              <div className="relative mb-8 aspect-[3/4] w-full overflow-hidden rounded-lg">
                <Image
                  src={post.feature_image}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Author info */}
              {post.primary_author && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-bold mb-4">About the Author</h3>
                  <div className="flex items-center mb-4">
                    {post.primary_author.profile_image && (
                      <div className="relative mr-4 h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={post.primary_author.profile_image}
                          alt={post.primary_author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{post.primary_author.name}</p>
                      {post.primary_author.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">{post.primary_author.bio}</p>
                      )}
                    </div>
                  </div>
                  {post.primary_author.website && (
                    <a 
                      href={post.primary_author.website} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostContent; 