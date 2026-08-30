import type React from 'react'
import { getPhotoDetails } from '@/actions/getPhotoDetails'
import PhotoScroller from './photoScroller'

interface ProjectPhotosProps {
  slug: string
}

/**
 * A component that displays the photos of a project as a full-window,
 * snap-scrolling sequence (one photo per screen, caption at the bottom).
 *
 * @param slug - The unique identifier of the project
 */
const ProjectPhotos: React.FC<ProjectPhotosProps> = async ({ slug }) => {
  try {
    const photos = await getPhotoDetails(slug)
    const photoArray = Array.isArray(photos) ? photos : photos ? [photos] : []

    console.log('[Component] ProjectPhotos: Retrieved photos', {
      slug,
      count: photoArray.length,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      samplePhotoUrls: photoArray.slice(0, 2).map((p) => `${p.desktop_blob?.substring(0, 50)}...`),
    })

    if (!photoArray.length) {
      return (
        <div className="text-center p-6 mt-10">
          <p className="text-xl mb-2">Coming soon</p>
          <p className="text-sm text-gray-400">
            Photos for this project are currently being prepared. Please check back later to view
            the complete collection.
          </p>
        </div>
      )
    }

    const sortedPhotos = [...photoArray].sort((a, b) => a.sequence - b.sequence)

    return <PhotoScroller photos={sortedPhotos} />
  } catch (error) {
    console.warn('[Component] ProjectPhotos: Error occurred', error)
    return (
      <div className="text-center p-6 mt-10">
        <p className="text-xl mb-2">Unable to load photos</p>
        <p className="text-sm text-gray-400">
          There was an issue retrieving photos for this project. Please try again later.
        </p>
      </div>
    )
  }
}

export default ProjectPhotos
