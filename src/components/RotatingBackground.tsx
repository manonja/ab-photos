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
  let projectsData: Project[];
  try {
    projectsData = projects || await getProjectsDetails({ useStatic: true });
  } catch (error) {
    console.error('[RotatingBackground] Failed to fetch projects:', error);
    // Use fallback static black background in case of error
    return <div className="fixed inset-0 -z-10 bg-black" aria-label="Background image - fallback" />;
  }
  
  // Extract only what we need - the IDs of published projects
  const projectIds = projectsData
    .filter(project => project.isPublished)
    .map(project => project.id);
  
  // If no projects, show a black background
  if (projectIds.length === 0) {
    return <div className="fixed inset-0 -z-10 bg-black" aria-label="Background image - no projects" />;
  }

  // Pre-fetch AT MOST 3 images server-side - no need to load them all
  const prefetchedPhotos: (Photo & { originalProjectId: string })[] = [];
  const MAX_PREFETCH = 3;
  
  // Use Promise.all to fetch the photos in parallel
  await Promise.all(
    projectIds.slice(0, MAX_PREFETCH).map(async (projectId) => {
      try {
        const photo = await getPhotoDetails(projectId, 2) as Photo;
        if (photo) {
          prefetchedPhotos.push({
            ...photo,
            originalProjectId: projectId
          });
        }
      } catch (error) {
        console.error(`[RotatingBackground] Failed to pre-fetch photo:`, error);
        // Continue trying other photos instead of failing completely
      }
    })
  );

  // If we couldn't fetch any photos, don't crash - just show black background
  if (prefetchedPhotos.length === 0) {
    return <div className="fixed inset-0 -z-10 bg-black" aria-label="Background image - no photos" />;
  }

  // Pass the pre-fetched photos to the client component
  return <RotatingBackgroundClient 
    projectSlugs={projectIds} 
    interval={interval} 
    prefetchedPhotos={prefetchedPhotos}
  />;
} 