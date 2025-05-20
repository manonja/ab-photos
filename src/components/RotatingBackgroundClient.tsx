'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getPhotoDetails } from '@/actions/getPhotoDetails';
import { Photo } from '@/types/database';

interface RotatingBackgroundClientProps {
  projectSlugs: string[];
  interval?: number;
}

/**
 * Client component that rotates through background images with a crossfade transition.
 */
export function RotatingBackgroundClient({ projectSlugs, interval = 3000 }: RotatingBackgroundClientProps) {
  const [backgrounds, setBackgrounds] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(-1);
  const [fading, setFading] = useState(false);
  
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadDone = useRef(false);

  // Load images
  useEffect(() => {
    async function loadImages() {
      try {
        const loadedPhotos: Photo[] = [];
        
        // Fetch one photo for each project
        for (const slug of projectSlugs) {
          try {
            const photoResult = await getPhotoDetails(slug, 2);
            
            if (photoResult && typeof photoResult === 'object' && 'desktop_blob' in photoResult) {
              loadedPhotos.push(photoResult as Photo);
            }
          } catch (err) {
            console.error(`Could not load photo for project ${slug}`);
          }
        }
        
        if (loadedPhotos.length > 0) {
          setBackgrounds(loadedPhotos);
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
  }, [projectSlugs]);

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
  }, [backgrounds, currentIndex, interval]);

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