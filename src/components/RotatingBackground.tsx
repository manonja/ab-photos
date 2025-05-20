import { getProjectsDetails } from '@/actions/getProjectsDetails';
import { RotatingBackgroundClient } from '@/components/RotatingBackgroundClient';

interface RotatingBackgroundProps {
  interval?: number;
}

/**
 * Server component that fetches project data and feeds it to the client component
 * for rotating background images.
 */
export default async function RotatingBackground({ interval = 4000 }: RotatingBackgroundProps) {
  // Fetch projects and extract only what we need - the slugs of published projects
  const projects = await getProjectsDetails();
  const projectSlugs = projects
    .filter(project => project.isPublished)
    .map(project => project.id);
  
  // If no projects, show a black background
  if (projectSlugs.length === 0) {
    return <div className="fixed inset-0 -z-10 bg-black" aria-label="Background image" />;
  }

  // Pass project slugs to the client component
  return <RotatingBackgroundClient projectSlugs={projectSlugs} interval={interval} />;
} 