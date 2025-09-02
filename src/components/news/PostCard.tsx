import React from 'react';
import Image from 'next/image';
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

  console.log('[PostCard] Rendering post card with image:', post.feature_image);

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
      {/* Featured Image or Placeholder - Left Side */}
      <div className="lg:w-[30%] flex-shrink-0">
        <Link href={`/news/${post.slug}`}>
          {post.feature_image ? (
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
              <Image
                src={post.feature_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
                priority
                quality={90}
              />
            </div>
          ) : (
            // Gray placeholder rectangle when no image is available
            <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </Link>
      </div>
      
      {/* Content - Right Side */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h2 className="mb-2 text-2xl font-bold leading-tight">
          <Link href={`/news/${post.slug}`} className="hover:text-gray-400">
            {post.title}
          </Link>
        </h2>

        {/* Date and Meta */}
        <div className="mb-3 text-sm text-gray-500">
          {formattedDate}
          {post.primary_tag && (
            <>
              <br />
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
        
        <Link 
          href={`/news/${post.slug}`} 
          className="mt-auto inline-block text-gray-400 hover:text-white hover:underline"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard; 