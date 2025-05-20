import { getProjectsDetails } from "@/actions/getProjectsDetails";
import WorkList from "./workList";

export const runtime = "edge";

/**
 * Server component wrapper for WorkList
 * Fetches project data and passes it to the client component
 */
export default async function WorkListWrapper() {
  console.log('[Component] WorkListWrapper: Fetching project details');
  const projects = await getProjectsDetails();
  
  console.log('[Component] WorkListWrapper: Projects fetched', {
    projectCount: projects.length,
    projects: projects.map(p => ({
      id: p.id,
      hasId: !!p.id
    }))
  });

  return <WorkList projects={projects} />;
} 