'use client';
import React from 'react';
import Image from 'next/image';

interface PhotoCardProps {
  title: string;
  imageUrl: string;
  description?: string;
  onView?: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ 
  title, 
  imageUrl, 
  description, 
  onView 
}) => {
  return (
    <article className="relative rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-64 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 bg-white">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}
        {onView && (
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-800"
            aria-label={`View ${title}`}
          >
            View Photo
          </button>
        )}
      </div>
    </article>
  );
}; 