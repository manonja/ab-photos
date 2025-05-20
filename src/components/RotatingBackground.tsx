import React from 'react';
import { getProjectsDetails } from '@/actions/getProjectsDetails';
import { RotatingBackgroundClient } from '@/components/RotatingBackgroundClient';

interface RotatingBackgroundProps {
  interval?: number; // Time in milliseconds between transitions
}

/**
 * Server component that fetches project data and renders a client component
 * that handles the rotation of background images.
 * 
 * @param interval - Optional time in milliseconds between image transitions (default: 3000ms)
 */
export default async function RotatingBackground({ interval = 3000 }: RotatingBackgroundProps) {
  // Fetch all published projects
  const projects = await getProjectsDetails();
  
  // Only include published projects
  const publishedProjects = projects.filter(project => project.isPublished);
  
  if (publishedProjects.length === 0) {
    // Fallback if no projects are available
    return (
      <div 
        className="fixed inset-0 -z-10 bg-black"
        aria-label="Background image"
      />
    );
  }

  // Collect project slugs to be used by the client component
  const projectSlugs = publishedProjects.map(project => project.id);
  
  return (
    <RotatingBackgroundClient 
      projectSlugs={projectSlugs} 
      interval={interval} 
    />
  );
} 