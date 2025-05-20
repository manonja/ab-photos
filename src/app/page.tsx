import { getProjectsDetails } from "@/actions/getProjectsDetails";
import RotatingBackground from "@/components/RotatingBackground";
import { CurrentProjectProvider } from "@/context/CurrentProjectContext";
import WorkListWrapper from "@/app/work/components/workListWrapper";

/**
 * Home page with rotating background images that change every 4 seconds
 * Uses context to highlight the work list item corresponding to the current background
 */
export default async function Home() {
  // Fetch projects to ensure we're working with consistent data
  const projects = await getProjectsDetails();
  
  return (
    <CurrentProjectProvider>
      <RotatingBackground interval={4000} projects={projects} />
      <WorkListWrapper />
    </CurrentProjectProvider>
  );
}
