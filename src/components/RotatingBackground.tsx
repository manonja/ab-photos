import { getProjectsDetails } from '@/actions/getProjectsDetails';
import { RotatingBackgroundClient } from '@/components/RotatingBackgroundClient';
import { Project } from '@/types/database';

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

  // Pass project IDs to the client component
  return <RotatingBackgroundClient projectSlugs={projectIds} interval={interval} />;
} 