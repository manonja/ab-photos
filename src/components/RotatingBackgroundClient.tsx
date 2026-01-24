'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useCurrentProject } from '@/context/CurrentProjectContext'
import type { Photo } from '@/types/database'

interface RotatingBackgroundClientProps {
  projectSlugs: string[]
  interval?: number
  prefetchedPhotos: (Photo & { originalProjectId: string })[]
}

/**
 * Client component that rotates through background images with a crossfade transition.
 * The projectSlugs parameter contains the IDs of projects to display as backgrounds.
 * All photos are pre-fetched server-side to avoid client-side data fetching.
 */
export function RotatingBackgroundClient({
  projectSlugs,
  interval = 4000,
  prefetchedPhotos,
}: RotatingBackgroundClientProps) {
  const [backgrounds] = useState<(Photo & { originalProjectId: string })[]>(prefetchedPhotos)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(-1)
  const [fading, setFading] = useState(false)
  const [loadError, setLoadError] = useState<Record<string, boolean>>({})

  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { setCurrentProjectId } = useCurrentProject()

  // Set initial project ID
  useEffect(() => {
    if (prefetchedPhotos.length > 0) {
      const initialProjectId = prefetchedPhotos[0].originalProjectId
      setCurrentProjectId(initialProjectId)
    }
  }, [prefetchedPhotos, setCurrentProjectId])

  // Manage image rotation
  useEffect(() => {
    // Don't start rotation if we don't have enough images
    if (backgrounds.length <= 1) return

    function rotateBackground() {
      // Get index of next image
      let next = (currentIndex + 1) % backgrounds.length

      // If this image previously had a load error, skip to the next one
      let attempts = 0
      while (loadError[backgrounds[next].id] && attempts < backgrounds.length) {
        next = (next + 1) % backgrounds.length
        attempts++
      }

      // If all images have load errors, just use the current one
      if (attempts >= backgrounds.length) {
        rotationTimerRef.current = setTimeout(rotateBackground, interval)
        return
      }

      // First prep the next image (but keep it invisible)
      setNextIndex(next)

      // Short delay to ensure nextIndex is set before starting fade
      setTimeout(() => {
        // Start the fade transition
        setFading(true)

        // Update current project ID right when the fade starts
        const nextProjectId = backgrounds[next].originalProjectId
        setCurrentProjectId(nextProjectId)

        // After transition completes, update current to next
        const transitionDuration = 1500
        setTimeout(() => {
          setCurrentIndex(next)
          setFading(false)

          // Schedule next rotation
          rotationTimerRef.current = setTimeout(rotateBackground, interval)
        }, transitionDuration)
      }, 50)
    }

    // Start first rotation after interval
    rotationTimerRef.current = setTimeout(rotateBackground, interval)

    return () => {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current)
    }
  }, [backgrounds, currentIndex, interval, setCurrentProjectId, loadError])

  // Handle image load errors
  const handleImageError = (photoId: string) => {
    setLoadError((prev) => ({
      ...prev,
      [photoId]: true,
    }))
  }

  // If no images loaded, show black background
  if (backgrounds.length === 0) {
    return <div className="fixed inset-0 -z-10 bg-black" aria-label="Loading background" />
  }

  const currentPhoto = backgrounds[currentIndex]
  const nextPhoto = nextIndex !== -1 ? backgrounds[nextIndex] : null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base black background */}
      <div className="fixed inset-0 -z-50 bg-black" aria-hidden="true" />

      {/* Next image - positioned below current image */}
      {nextPhoto && !loadError[nextPhoto.id] && (
        <div className="fixed inset-0 -z-20">
          <Image
            src={nextPhoto.desktop_blob}
            alt={nextPhoto.caption || `Project background`}
            fill
            sizes="100vw"
            className="object-cover"
            quality={90}
            referrerPolicy="no-referrer"
            unoptimized={true}
            loading="eager"
            onError={() => handleImageError(nextPhoto.id)}
          />
        </div>
      )}

      {/* Current image - fades out during transition */}
      {!loadError[currentPhoto.id] ? (
        <div
          className={`fixed inset-0 -z-10 transition-opacity duration-1500 ease-out-cubic ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Image
            src={currentPhoto.desktop_blob}
            alt={currentPhoto.caption || `Project background`}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
            referrerPolicy="no-referrer"
            unoptimized={true}
            fetchPriority="high"
            onError={() => handleImageError(currentPhoto.id)}
          />
        </div>
      ) : (
        <div className="fixed inset-0 -z-10 bg-black" aria-label="Fallback background" />
      )}
    </div>
  )
}
