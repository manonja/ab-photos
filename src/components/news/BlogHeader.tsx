import React from 'react';
import Image from 'next/image';
import { getPhotoDetails } from '@/actions/getPhotoDetails';
import { Photo } from '@/types/database';

// List of project IDs based on existing slugs in the application
// Adding duplicates to ensure we have enough photos
const PROJECT_IDS = [
  'pyrenees',
  '7-rad',
  'industry',
  'pyrenees', // Duplicate to get another photo from this project
  '7-rad'     // Duplicate to get another photo from this project
];

const BlogHeader: React.FC = async () => {
  // Fetch photos from each project with different sequence numbers
  const photoPromises = PROJECT_IDS.map(async (projectId, index) => {
    try {
      // Use a different sequence number for duplicates
      const sequence = index > 2 ? index : undefined;
      const projectPhotos = await getPhotoDetails(projectId, sequence);
      
      // If we get a single photo or an array, handle both cases
      if (projectPhotos) {
        if (Array.isArray(projectPhotos)) {
          // For arrays, take a different photo based on index to avoid duplicates
          const photoIndex = index % projectPhotos.length;
          return projectPhotos[photoIndex];
        } else {
          return projectPhotos; // Use the single photo
        }
      }
      return null;
    } catch (error) {
      console.error(`[BlogHeader] Error fetching photos for project ${projectId}:`, error);
      return null;
    }
  });

  // Wait for all photo fetches to complete
  const photos = (await Promise.all(photoPromises)).filter(Boolean) as Photo[];

  // Fallback gradient classes in case we don't get enough photos
  const fallbackGradients = [
    'from-blue-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-violet-600'
  ];

  return (
    <div className="w-full relative mb-10">
      {/* Photo grid - header title removed */}
      <div className="grid grid-cols-5 h-64 md:h-80 lg:h-96">
        {photos.length > 0 ? (
          // If we have photos, display them
          photos.slice(0, 5).map((photo, index) => (
            <div key={photo.id} className="relative overflow-hidden">
              <div className="relative w-full h-full">
                <img 
                  src={photo.desktop_blob}
                  alt={photo.caption || `Blog header image ${index + 1}`}
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Overlay to unify the look */}
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
          ))
        ) : (
          // If no photos were found, use gradient fallbacks
          fallbackGradients.map((gradient, index) => (
            <div key={index} className="relative overflow-hidden">
              <div className={`w-full h-full bg-gradient-to-br ${gradient}`}></div>
              {/* Overlay to unify the look */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          ))
        )}

        {/* Fill in with gradients if we don't have enough photos */}
        {photos.length > 0 && photos.length < 5 && 
          fallbackGradients.slice(0, 5 - photos.length).map((gradient, index) => (
            <div key={`fallback-${index}`} className="relative overflow-hidden">
              <div className={`w-full h-full bg-gradient-to-br ${gradient}`}></div>
              {/* Overlay to unify the look */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default BlogHeader; 