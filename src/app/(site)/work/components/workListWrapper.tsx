import { getProjectsDetails } from "@/actions/getProjectsDetails";
import WorkList from "./workList";
import { Project } from "@/types/database";

export const runtime = "edge";

interface WorkListWrapperProps {
  projects?: Project[];
}

/**
 * Server component wrapper for WorkList
 * Fetches project data and passes it to the client component
 * If projects are provided as prop, uses those instead of fetching
 */
export default async function WorkListWrapper({ projects: providedProjects }: WorkListWrapperProps = {}) {
  let projects: Project[];

  if (providedProjects) {
    console.log('[Component] WorkListWrapper: Using provided projects', {
      projectCount: providedProjects.length
    });
    projects = providedProjects;
  } else {
    console.log('[Component] WorkListWrapper: Fetching project details');
    projects = await getProjectsDetails();

    console.log('[Component] WorkListWrapper: Projects fetched', {
      projectCount: projects.length,
      projects: projects.map(p => ({
        id: p.id,
        hasId: !!p.id
      }))
    });
  }

  return <WorkList projects={projects} />;
} 