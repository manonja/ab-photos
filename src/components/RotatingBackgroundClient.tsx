'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getPhotoDetails } from '@/actions/getPhotoDetails';
import { Photo } from '@/types/database';
import { useCurrentProject } from '@/context/CurrentProjectContext';

interface RotatingBackgroundClientProps {
  projectSlugs: string[];
  interval?: number;
}

/**
 * Client component that rotates through background images with a crossfade transition.
 * The projectSlugs parameter contains the IDs of projects to display as backgrounds.
 */
export function RotatingBackgroundClient({ projectSlugs, interval = 4000 }: RotatingBackgroundClientProps) {
  const [backgrounds, setBackgrounds] = useState<(Photo & { originalProjectId: string })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(-1);
  const [fading, setFading] = useState(false);
  
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadDone = useRef(false);
  const { setCurrentProjectId } = useCurrentProject();

  // Load images
  useEffect(() => {
    async function loadImages() {
      try {
        const loadedPhotos: (Photo & { originalProjectId: string })[] = [];
        
        // Fetch one photo for each project
        for (const projectId of projectSlugs) {
          try {
            const photoResult = await getPhotoDetails(projectId, 2);
            
            if (photoResult && typeof photoResult === 'object' && 'desktop_blob' in photoResult) {
              // Store the original project ID from our list to ensure consistency
              const photo = {
                ...(photoResult as Photo),
                originalProjectId: projectId
              };
              
              loadedPhotos.push(photo);
              console.log(`[RotatingBackgroundClient] Loaded photo for project ${projectId}:`, {
                photoProjectId: photo.projectId,
                originalProjectId: projectId
              });
            }
          } catch (err) {
            console.error(`Could not load photo for project ${projectId}`);
          }
        }
        
        if (loadedPhotos.length > 0) {
          setBackgrounds(loadedPhotos);
          
          // Set initial current project ID using the ORIGINAL project ID, not the photo's
          const initialProjectId = loadedPhotos[0].originalProjectId;
          setCurrentProjectId(initialProjectId);
          console.log(`[RotatingBackgroundClient] Setting initial project ID: ${initialProjectId}`);
          
          initialLoadDone.current = true;
        }
      } catch (error) {
        console.error('Error loading images:', error);
      }
    }
    
    loadImages();
    
    return () => {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
    };
  }, [projectSlugs, setCurrentProjectId]);

  // Manage image rotation
  useEffect(() => {
    // Don't start rotation if we don't have enough images or haven't finished initial load
    if (backgrounds.length <= 1 || !initialLoadDone.current) return;
    
    function rotateBackground() {
      // Get index of next image
      const next = (currentIndex + 1) % backgrounds.length;
      
      // First prep the next image (but keep it invisible)
      setNextIndex(next);
      
      // Short delay to ensure nextIndex is set before starting fade
      setTimeout(() => {
        // Start the fade transition
        setFading(true);
        
        // After transition completes, update current to next
        const transitionDuration = 1500;
        setTimeout(() => {
          setCurrentIndex(next);
          setFading(false);
          
          // Update current project ID - use the ORIGINAL project ID for consistency
          const nextProjectId = backgrounds[next].originalProjectId;
          setCurrentProjectId(nextProjectId);
          console.log(`[RotatingBackgroundClient] Rotating to project ID: ${nextProjectId}`);
          
          // Schedule next rotation
          rotationTimerRef.current = setTimeout(rotateBackground, interval);
        }, transitionDuration);
      }, 50);
    }
    
    // Start first rotation after interval
    rotationTimerRef.current = setTimeout(rotateBackground, interval);
    
    return () => {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
    };
  }, [backgrounds, currentIndex, interval, setCurrentProjectId]);

  // If no images loaded, show black background
  if (backgrounds.length === 0) {
    return <div className="fixed inset-0 -z-10 bg-black" aria-label="Loading background" />;
  }

  const currentPhoto = backgrounds[currentIndex];
  const nextPhoto = nextIndex !== -1 ? backgrounds[nextIndex] : null;
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base black background */}
      <div className="fixed inset-0 -z-50 bg-black" aria-hidden="true" />
      
      {/* Next image - positioned below current image */}
      {nextPhoto && (
        <div className="fixed inset-0 -z-20">
          <Image
            src={nextPhoto.desktop_blob}
            alt={nextPhoto.caption || `Project background`}
            fill
            sizes="100vw"
            className="object-cover"
            quality={90}
            referrerPolicy="no-referrer"
            unoptimized={!nextPhoto.desktop_blob.startsWith('https://')}
          />
        </div>
      )}
      
      {/* Current image - fades out during transition */}
      <div 
        className={`fixed inset-0 -z-10 transition-opacity duration-1500 ease-out-cubic ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={currentPhoto.desktop_blob}
          alt={currentPhoto.caption || `Project background`}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
          referrerPolicy="no-referrer"
          unoptimized={!currentPhoto.desktop_blob.startsWith('https://')}
        />
      </div>
    </div>
  );
} 