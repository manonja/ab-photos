import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getProjectsDetails } from '@/actions/getProjectsDetails'
import WorkListWrapper from '@/app/work/components/workListWrapper'
import RotatingBackground from '@/components/RotatingBackground'
import { CurrentProjectProvider } from '@/context/CurrentProjectContext'

/**
 * Generate metadata with proper preload hints for images
 */
export async function generateMetadata(): Promise<Metadata> {
  // Basic metadata that doesn't depend on data fetching
  return {
    title: 'Anton Bossenbroek Photography',
    description:
      'Explore the photography portfolio of Anton Bossenbroek featuring landscape and travel photography',
  }
}

/**
 * Home page with rotating background images that change every 4 seconds
 * Uses context to highlight the work list item corresponding to the current background
 */
export default async function Home() {
  // Prefetch projects for all components to share
  const projects = await getProjectsDetails({ useStatic: true })

  return (
    <CurrentProjectProvider>
      {/* Show loading state while background images load */}
      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-black" />}>
        <RotatingBackground interval={4000} projects={projects} />
      </Suspense>

      {/* Work list */}
      <WorkListWrapper projects={projects} />
    </CurrentProjectProvider>
  )
}
