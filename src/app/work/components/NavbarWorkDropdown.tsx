import { getProjectsDetails } from "@/actions/getProjectsDetails";
import WorkDropdown from "./WorkDropdown";
import Link from "next/link";

export default async function NavbarWorkDropdown() {
  try {
    const projects = await getProjectsDetails();

    // Filter published projects and provide only necessary data
    const projectsData = projects
      .filter(project => project.isPublished)
      .map(project => ({
        id: project.id,
        title: project.title
      }));

    // If there are projects, show the first one as default on mobile
    const defaultProjectId = projectsData.length > 0 ? projectsData[0].id : '';

    return (
      <>
        {/* For mobile screens - make the Work link go to the first project instead of /work */}
        <div className="lg:hidden">
          {defaultProjectId ? (
            <Link
              className="flex place-items-center gap-2 pr-1 p-2 pointer-events-auto hover:border-b uppercase"
              href={`/work/${defaultProjectId}`}
              rel="noopener noreferrer"
            >
              Work
            </Link>
          ) : (
            <span className="flex place-items-center gap-2 pr-1 p-2 pointer-events-auto cursor-default uppercase">
              Work
            </span>
          )}
        </div>

        {/* For desktop screens */}
        <div className="hidden lg:block">
          <WorkDropdown projects={projectsData} />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading projects for dropdown:', error);
    // If we fail to load projects, show non-clickable Work
    return (
      <span
        className="flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 cursor-default uppercase"
      >
        Work
      </span>
    );
  }
} 