import { getProjectsDetails } from "@/actions/getProjectsDetails";
import { getPhotoDetails } from "@/actions/getPhotoDetails";
import { Suspense } from "react";
import RotatingBackground from "@/components/RotatingBackground";
import { CurrentProjectProvider } from "@/context/CurrentProjectContext";
import WorkListWrapper from "@/app/(site)/work/components/workListWrapper";
import type { Metadata } from "next";

/**
 * Generate metadata with proper preload hints for images
 */
export async function generateMetadata(): Promise<Metadata> {
  // Basic metadata that doesn't depend on data fetching
  return {
    title: "Anton Bossenbroek Photography",
    description: "Explore the photography portfolio of Anton Bossenbroek featuring landscape and travel photography",
  };
}

/**
 * Home page with rotating background images that change every 4 seconds
 * Uses context to highlight the work list item corresponding to the current background
 */
export const dynamic = 'force-static';

export default async function Home() {
  // Prefetch projects for all components to share
  const projects = await getProjectsDetails({ useStatic: true });
  
  return (
    <CurrentProjectProvider>
      {/* Show loading state while background images load */}
      <Suspense fallback={
        <div className="fixed inset-0 -z-10 bg-black" aria-label="Loading background" />
      }>
        <RotatingBackground interval={4000} projects={projects} />
      </Suspense>
      
      {/* Work list */}
      <WorkListWrapper projects={projects} />
    </CurrentProjectProvider>
  );
}
