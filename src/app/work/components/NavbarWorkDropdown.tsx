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

    return (
      <>
        {/* For mobile screens */}
        <div className="lg:hidden">
          <Link
            className="flex place-items-center gap-2 pr-1 p-2 pointer-events-auto hover:border-b"
            href="/work"
            rel="noopener noreferrer"
          >
            Work
          </Link>
        </div>
        
        {/* For desktop screens */}
        <div className="hidden lg:block">
          <WorkDropdown projects={projectsData} />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading projects for dropdown:', error);
    // If we fail to load projects, just show a regular link
    return (
      <a 
        className="flex place-items-center gap-2 pr-1 p-2 pointer-events-auto lg:p-0 hover:border-b"
        href="/work"
        rel="noopener noreferrer"
      >
        Work
      </a>
    );
  }
} 