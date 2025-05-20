'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { getPhotoDetails } from '@/actions/getPhotoDetails';
import { Photo } from '@/types/database';

interface RotatingBackgroundClientProps {
  projectSlugs: string[];
  interval?: number;
}

interface BackgroundImage {
  src: string;
  alt: string;
  brightness: 'light' | 'dark'; // Used to determine if we need an overlay
}

/**
 * Client component that handles rotating through background images
 * with smooth transitions for the homepage.
 */
export function RotatingBackgroundClient({ 
  projectSlugs, 
  interval = 3000 
}: RotatingBackgroundClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<BackgroundImage | null>(null);
  const [nextImage, setNextImage] = useState<BackgroundImage | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Use refs to track timers so we can properly clean them up
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const imageLoadedRef = useRef(false); // Track if initial images are loaded

  // Function to determine if an image is light or dark (for overlay purposes)
  const determineImageBrightness = (dataUrl: string): 'light' | 'dark' => {
    // For simplicity, we assume all images need an overlay by default
    // In a production app, you could implement an algorithm to analyze the image
    return 'light'; // We'll use light to ensure the overlay is applied
  };

  // Load images for each project
  const loadImages = useCallback(async () => {
    try {
      const loadedImageData: BackgroundImage[] = [];
      
      for (const slug of projectSlugs) {
        try {
          // Use sequence 2 as default or another specific photo from each project
          const photoResult = await getPhotoDetails(slug, 2);
          
          // Check if we have a valid photo object
          if (photoResult && typeof photoResult === 'object' && 'desktop_blob' in photoResult) {
            const photo = photoResult as Photo;
            const brightness = determineImageBrightness(photo.desktop_blob);
            
            loadedImageData.push({
              src: photo.desktop_blob,
              alt: photo.caption || `Background image for ${slug} project`,
              brightness
            });
          }
        } catch (err) {
          console.error(`Error loading photo for project ${slug}:`, err);
          // Continue with next project if one fails
        }
      }
      
      if (loadedImageData.length > 0) {
        setImages(loadedImageData);
        
        // Set initial images without any transition
        setCurrentImage(loadedImageData[0]);
        
        if (loadedImageData.length > 1) {
          // Preload the second image but don't show it yet
          preloadImage(loadedImageData[1].src);
          setNextImage(loadedImageData[1]);
        }
        
        // Mark that images are initially loaded
        imageLoadedRef.current = true;
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }, [projectSlugs]);

  // Handle image preloading to ensure smooth transitions
  const preloadImage = useCallback((src: string) => {
    if (loadedImages.includes(src)) return;
    
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setLoadedImages(prev => [...prev, src]);
    };
  }, [loadedImages]);

  // Effect to load initial images only once
  useEffect(() => {
    loadImages();
    
    // Clean up all timers on unmount
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
    };
  }, [loadImages]);

  // Start rotation timer only after images are loaded
  useEffect(() => {
    // Don't start rotation until we have at least 2 images and initial load is complete
    if (images.length <= 1 || !imageLoadedRef.current) return;
    
    const startRotation = () => {
      // Clear any existing timers
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
      
      // Set a new timer for the next rotation
      rotationTimerRef.current = setTimeout(() => {
        rotateToNextImage();
      }, interval);
    };
    
    // Start the initial rotation timer
    startRotation();
    
    // Clean up timers on unmount or when dependencies change
    return () => {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
    };
  }, [activeIndex, images, interval, imageLoadedRef.current]);

  // Function to handle the rotation to the next image
  const rotateToNextImage = useCallback(() => {
    if (images.length <= 1) return;
    
    const nextIndex = (activeIndex + 1) % images.length;
    
    // Start transition - fade out current image
    setIsTransitioning(true);
    
    // Set up next image immediately but it will be invisible until transition
    setNextImage(images[nextIndex]);
    
    // Wait for the current image to fade out before updating
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    
    transitionTimerRef.current = setTimeout(() => {
      // Update to the next image
      setCurrentImage(images[nextIndex]);
      setActiveIndex(nextIndex);
      
      // End transition - fade in new current image
      setIsTransitioning(false);
      
      // Preload the next-next image
      const nextNextIndex = (nextIndex + 1) % images.length;
      preloadImage(images[nextNextIndex].src);
      
      // Set up the next rotation
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
      rotationTimerRef.current = setTimeout(() => {
        rotateToNextImage();
      }, interval);
    }, 1000); // Match this with CSS transition duration
  }, [activeIndex, images, interval, preloadImage]);

  if (!currentImage) {
    return (
      <div className="fixed inset-0 -z-10 bg-black" aria-label="Loading background" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10">
      {/* Black background as base */}
      <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true" />
      
      {/* Current image */}
      <div 
        className={`fixed inset-0 -z-10 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          priority
          quality={90}
          className="object-cover"
          referrerPolicy="no-referrer"
          unoptimized={!currentImage.src.startsWith('https://')}
        />
        
        {/* Overlay for better text contrast if needed */}
        {currentImage.brightness === 'light' && (
          <div 
            className="absolute inset-0 bg-black/30" 
            aria-hidden="true"
          />
        )}
      </div>
      
      {/* Next image - positioned behind current but will be visible during transition */}
      {nextImage && (
        <div 
          className={`fixed inset-0 -z-11 transition-none`}
        >
          <Image
            src={nextImage.src}
            alt={nextImage.alt}
            fill
            quality={90}
            className="object-cover"
            referrerPolicy="no-referrer"
            unoptimized={!nextImage.src.startsWith('https://')}
          />
          
          {/* Overlay for better text contrast if needed */}
          {nextImage.brightness === 'light' && (
            <div 
              className="absolute inset-0 bg-black/30" 
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
} 