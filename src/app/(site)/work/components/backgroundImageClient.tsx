'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';

interface BackgroundImageClientProps {
  src: string;
  alt: string;
  disableOverlay?: boolean;
}

/**
 * Client component that handles the scroll-based fade out effect for background images.
 * As the user scrolls down, the background image gradually fades to black.
 * Also applies a subtle blur effect during the transition for enhanced visual appeal.
 * Includes performance optimizations for smooth scrolling.
 * 
 * Added a semi-transparent overlay for better text contrast regardless of image color.
 * The overlay can be disabled with the disableOverlay prop.
 */
const BackgroundImageClient: React.FC<BackgroundImageClientProps> = ({ 
  src, 
  alt, 
  disableOverlay = false 
}) => {
  const [opacity, setOpacity] = useState(1);
  const [blurAmount, setBlurAmount] = useState(0);
  const [scaleAmount, setScaleAmount] = useState(100);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Use refs to track the last animation frame request
  const animationFrameRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  
  // Calculate visual effects based on scroll position
  const calculateEffects = useCallback((scrollY: number) => {
    // Store the current scroll position
    lastScrollY.current = scrollY;
    
    const viewportHeight = window.innerHeight;
    // Increase fade distance to 80% of viewport height for a slower, more gradual effect
    const fadeDistance = viewportHeight * 0.8;
    
    // Calculate opacity between 1 and 0 based on scroll position
    // Ensure transition starts immediately but progresses more slowly
    const newOpacity = Math.max(0, 1 - (scrollY / fadeDistance));
    
    // Apply non-linear easing for smoother transition at the beginning and end
    // This creates a more pleasing visual effect by slowing down at certain points
    const easedOpacity = easeOutCubic(newOpacity);
    
    // Only update state if there's a meaningful change (optimization)
    if (Math.abs(easedOpacity - opacity) > 0.005) {
      setOpacity(easedOpacity);
      
      // Calculate blur effect (0px to 10px) as the opacity decreases
      const newBlur = Math.min(10, (1 - easedOpacity) * 10);
      setBlurAmount(newBlur);
      
      // Calculate scale effect (100% to 105%) as opacity decreases
      const newScale = 100 + ((1 - easedOpacity) * 5);
      setScaleAmount(newScale);
    }
  }, [opacity]);
  
  // Easing function for smoother transitions
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };
  
  // Handle scroll using requestAnimationFrame for smoother performance
  const handleScroll = useCallback(() => {
    // Set scrolling state to true for smoother transitions
    if (!isScrolling) {
      setIsScrolling(true);
    }
    
    // Cancel any existing animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Use requestAnimationFrame for smoother visual updates
    // This syncs our updates with the browser's refresh rate
    animationFrameRef.current = requestAnimationFrame(() => {
      calculateEffects(window.scrollY);
      animationFrameRef.current = null;
    });
  }, [calculateEffects, isScrolling]);
  
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    calculateEffects(window.scrollY);
    
    // Create an interval to ensure smooth transitions during sustained scrolling
    // This helps with inertial scrolling on trackpads and mobile devices
    const smoothingInterval = setInterval(() => {
      if (isScrolling) {
        calculateEffects(lastScrollY.current);
      }
    }, 20);
    
    // Function to handle scroll end detection
    const handleScrollEnd = () => {
      // Clear previous timeout
      clearTimeout(scrollTimer);
      
      // Set a longer timeout to detect when scrolling has completely stopped
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
        // Final calculation to ensure we end at the right values
        calculateEffects(window.scrollY);
      }, 250);
    };
    
    // Add scroll end detection
    window.addEventListener('scroll', handleScrollEnd, { passive: true });
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollEnd);
      clearInterval(smoothingInterval);
      
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      
      // Cancel any pending animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll, isScrolling, calculateEffects]);
  
  // Determine transition classes based on scroll state
  // Use longer durations and custom cubic bezier curve for smoother transitions
  const transitionClass = isScrolling 
    ? 'transition-all duration-300 ease-out' 
    : 'transition-all duration-1000 ease-out-cubic';
  
  // Get the appropriate blur class based on blur amount
  const getBlurClass = () => {
    if (blurAmount <= 1) return '';
    if (blurAmount <= 3) return 'blur-xs';
    if (blurAmount <= 6) return 'blur-sm';
    if (blurAmount <= 9) return 'blur-md';
    return 'blur-lg';
  };
  
  // Get the appropriate scale class based on scale amount
  const getScaleClass = () => {
    if (scaleAmount <= 101) return '';
    if (scaleAmount <= 102) return 'scale-101';
    if (scaleAmount <= 103) return 'scale-102';
    if (scaleAmount <= 105) return 'scale-103';
    return 'scale-105';
  };
  
  return (
    <>
      {/* Black background that's always visible */}
      <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true" />
      
      {/* Image with dynamic opacity and blur based on scroll position */}
      <div 
        className={`fixed inset-0 -z-10 ${transitionClass} ${getBlurClass()} ${getScaleClass()}`}
        style={{ opacity }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
          referrerPolicy="no-referrer"
          unoptimized={true}
          fetchPriority="high"
        />

        {/* Semi-transparent dark overlay for better text contrast - can be disabled */}
        {!disableOverlay && (
          <div 
            className="absolute inset-0 bg-black/30" 
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
};

export default BackgroundImageClient; 