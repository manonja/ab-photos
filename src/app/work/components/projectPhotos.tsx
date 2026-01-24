import type React from 'react'
import { getPhotoDetails } from '@/actions/getPhotoDetails'

export const runtime = 'edge'

interface ProjectPhotosProps {
  slug: string
}

/**
 * A component that displays a grid of photos for a specific project.
 * Photos are displayed in a single column on large screens with padding.
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

    return (
      <div className="grid text-center lg:p-6 gap-2 lg:mb-0 lg:grid-cols-1 lg:text-right self-end">
        {photoArray.map((photo) => (
          <div key={photo.id} className="w-full lg:p-12 pb-4">
            {/* biome-ignore lint/performance/noImgElement: External CDN images require img for referrer policy */}
            <img
              src={photo.desktop_blob}
              alt={photo.caption || ''}
              className="w-full h-auto object-cover lg:max-w-full lg:max-h-screen"
              referrerPolicy="no-referrer"
            />
            {/* TODO: Add captions to DATABASE and uncomment when ready */}
            {/* {photo.caption && (
                            <p className="mt-2 text-left italic text-sm text-gray-400">
                                {photo.caption}
                            </p>
                        )} */}
          </div>
        ))}
      </div>
    )
  } catch (error) {
    console.error('[Component] ProjectPhotos: Error occurred', error)
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
