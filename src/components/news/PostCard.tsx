import React from 'react';
import Link from 'next/link';
import { GhostPost } from '../../lib/ghost/types';

interface PostCardProps {
  post: GhostPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Format date in a compact format: "DD/MM/YYYY"
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col">
      {/* Title - not clickable */}
      <h2 className="mb-2 text-2xl font-bold leading-tight">
        {post.title}
      </h2>

      {/* Date and Meta */}
      <div className="mb-3 text-sm text-gray-500">
        {formattedDate}
        {post.primary_tag && (
          <>
            {' • '}
            <span className="uppercase text-gray-500">
              {post.primary_tag.name}
            </span>
          </>
        )}
      </div>

      {/* Excerpt */}
      <p className="mb-4 text-base text-gray-500">
        {post.excerpt?.substring(0, 200) || ''}
        {post.excerpt && post.excerpt.length > 200 ? '...' : ''}
      </p>
      
      {/* Read More - only clickable element */}
      <Link 
        href={`/news/${post.slug}`} 
        className="inline-block text-gray-400 hover:text-white hover:underline"
      >
        Read More
      </Link>
    </div>
  );
};

export default PostCard; 