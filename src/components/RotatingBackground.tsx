import { getProjectsDetails } from '@/actions/getProjectsDetails';
import { getPhotoDetails } from '@/actions/getPhotoDetails';
import { RotatingBackgroundClient } from '@/components/RotatingBackgroundClient';
import { Project, Photo } from '@/types/database';

interface RotatingBackgroundProps {
  interval?: number;
  projects?: Project[];
}

/**
 * Server component that fetches project data and feeds it to the client component
 * for rotating background images.
 */
export default async function RotatingBackground({ interval = 4000, projects }: RotatingBackgroundProps) {
  // Fetch projects if not provided
  const projectsData = projects || await getProjectsDetails();
  
  // Extract only what we need - the IDs of published projects
  const projectIds = projectsData
    .filter(project => project.isPublished)
    .map(project => project.id);
  
  console.log('[RotatingBackground] Projects for backgrounds:', projectIds);
  
  // If no projects, show a black background
  if (projectIds.length === 0) {
    return <div className="fixed inset-0 -z-10 bg-black" aria-label="Background image" />;
  }

  // Pre-fetch the first image server-side to eliminate initial loading delay
  let initialPhoto = null;
  if (projectIds.length > 0) {
    try {
      initialPhoto = await getPhotoDetails(projectIds[0], 2) as Photo;
      console.log('[RotatingBackground] Pre-fetched initial photo for', projectIds[0]);
    } catch (error) {
      console.error('[RotatingBackground] Failed to pre-fetch initial photo:', error);
    }
  }

  // Pass project IDs and pre-fetched initial photo to the client component
  return <RotatingBackgroundClient 
    projectSlugs={projectIds} 
    interval={interval} 
    initialPhoto={initialPhoto ? {
      ...initialPhoto,
      originalProjectId: projectIds[0]
    } : undefined}
  />;
} 