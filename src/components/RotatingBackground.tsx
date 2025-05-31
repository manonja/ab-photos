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

  // Pre-fetch ALL images server-side to eliminate client-side fetching
  const prefetchedPhotos: (Photo & { originalProjectId: string })[] = [];
  
  for (const projectId of projectIds) {
    try {
      const photo = await getPhotoDetails(projectId, 2) as Photo;
      if (photo) {
        prefetchedPhotos.push({
          ...photo,
          originalProjectId: projectId
        });
        console.log(`[RotatingBackground] Pre-fetched photo for ${projectId}`);
      }
    } catch (error) {
      console.error(`[RotatingBackground] Failed to pre-fetch photo for ${projectId}:`, error);
    }
  }

  // Pass all pre-fetched photos to the client component - no more client-side fetching needed
  return <RotatingBackgroundClient 
    projectSlugs={projectIds} 
    interval={interval} 
    prefetchedPhotos={prefetchedPhotos}
  />;
} 