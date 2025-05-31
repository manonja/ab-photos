import { getProjectsDetails } from "@/actions/getProjectsDetails";
import { getPhotoDetails } from "@/actions/getPhotoDetails";
import { Suspense } from "react";
import RotatingBackground from "@/components/RotatingBackground";
import { CurrentProjectProvider } from "@/context/CurrentProjectContext";
import WorkListWrapper from "@/app/work/components/workListWrapper";
import type { Metadata } from "next";

/**
 * Generate metadata with preload hints for images
 */
export async function generateMetadata(): Promise<Metadata> {
  // Try to fetch the first project and its photo for preloading
  let preloadHints = [];
  
  try {
    const projects = await getProjectsDetails();
    const publishedProjects = projects.filter(project => project.isPublished);
    
    if (publishedProjects.length > 0) {
      const firstProject = publishedProjects[0];
      const photo = await getPhotoDetails(firstProject.id, 2);
      
      if (photo && typeof photo === 'object' && 'desktop_blob' in photo) {
        preloadHints.push({
          rel: 'preload',
          as: 'image',
          href: photo.desktop_blob,
          fetchPriority: 'high',
          imageSizes: '100vw', // Helps browser understand image importance
          type: 'image/jpeg', // Add proper MIME type
        });
      }
    }
  } catch (error) {
    console.error('Error preloading image:', error);
  }
  
  return {
    other: {
      // @ts-ignore - Next.js types might not include all valid link properties
      link: preloadHints,
    },
  };
}

/**
 * Home page with rotating background images that change every 4 seconds
 * Uses context to highlight the work list item corresponding to the current background
 */
export const dynamic = 'force-static';

export default async function Home() {
  // Fetch projects to ensure we're working with consistent data
  const projects = await getProjectsDetails();
  
  return (
    <CurrentProjectProvider>
      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-black" aria-label="Loading background" />}>
        <RotatingBackground interval={4000} projects={projects} />
      </Suspense>
      <WorkListWrapper />
    </CurrentProjectProvider>
  );
}
