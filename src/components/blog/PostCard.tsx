import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GhostPost } from '../../lib/ghost/types';

interface PostCardProps {
  post: GhostPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Format date: "May 8, 2023"
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
      {/* Featured Image */}
      {post.feature_image && (
        <div className="relative h-48 w-full">
          <Image
            src={post.feature_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Tags */}
        {post.primary_tag && (
          <div className="mb-2">
            <Link 
              href={`/blog/tag/${post.primary_tag.slug}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {post.primary_tag.name}
            </Link>
          </div>
        )}

        {/* Title */}
        <h2 className="mb-2 text-xl font-bold leading-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="mb-4 flex-1 text-base text-gray-600">
          {post.excerpt.substring(0, 120)}
          {post.excerpt.length > 120 ? '...' : ''}
        </p>

        {/* Meta */}
        <div className="mt-auto flex items-center">
          {post.primary_author?.profile_image && (
            <div className="relative mr-4 h-10 w-10 overflow-hidden rounded-full">
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
              <p className="text-sm font-semibold">{post.primary_author.name}</p>
            )}
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 