import { cache } from 'react'
import { findPhotoByProjectIdAndSeq, findPhotosByProjectId } from '@/db/operations'
import type { Photo } from '@/types/database'

// Fallback photo data - use as emergency fallback when API fails
const FALLBACK_PHOTO: Photo = {
  id: 'fallback',
  projectId: 'fallback',
  sequence: 1,
  caption: 'Fallback image',
  desktop_blob: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // 1x1 transparent GIF
  mobile_blob: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  gallery_blob: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
}

/**
 * Server action to fetch photo details.
 * Uses direct D1 database access on Cloudflare Workers runtime.
 * Falls back to HTTP API during next build (when D1 is unavailable).
 * Uses React cache to memoize results within a request lifecycle.
 *
 * @param projectId - The unique identifier of the project
 * @param sequence - Optional sequence number to fetch a specific photo
 * @returns Promise<Photo | Photo[] | null> - Array of photos, single photo, or null if not found
 */
export const getPhotoDetails = cache(
  async (projectId: string, sequence?: number): Promise<Photo | Photo[] | null> => {
    // Strategy 1: Direct DB access (works on Cloudflare Workers runtime)
    try {
      if (typeof sequence === 'number') {
        console.log('[Action] getPhotoDetails: Direct DB fetch for specific photo', {
          projectId,
          sequence,
        })
        const photo = await findPhotoByProjectIdAndSeq(projectId, sequence)
        if (photo) return photo
        return null
      }
      console.log('[Action] getPhotoDetails: Direct DB fetch for all project photos', { projectId })
      const photos = await findPhotosByProjectId(projectId)
      return photos
    } catch (dbError) {
      console.warn(
        '[Action] getPhotoDetails: Direct DB access failed (expected during build)',
        dbError,
      )
    }

    // Strategy 2: HTTP fetch fallback (works during next build)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    if (!baseUrl) {
      console.warn('[Action] getPhotoDetails: NEXT_PUBLIC_API_URL not defined, using fallback')
      return typeof sequence === 'number'
        ? { ...FALLBACK_PHOTO, projectId, id: `${projectId}-fallback` }
        : [{ ...FALLBACK_PHOTO, projectId, id: `${projectId}-fallback` }]
    }

    try {
      if (typeof sequence === 'number') {
        console.log('[Action] getPhotoDetails: HTTP fetch for specific photo', {
          projectId,
          sequence,
        })
        const response = await fetch(`${baseUrl}/api/photos/${projectId}/${sequence}`, {
          next: { revalidate: 3600 },
        })
        if (!response.ok) {
          if (response.status === 404) return null
          throw new Error(`Failed to fetch photo: ${response.statusText}`)
        }
        return (await response.json()) as Photo
      }
      console.log('[Action] getPhotoDetails: HTTP fetch for all project photos', { projectId })
      const response = await fetch(`${baseUrl}/api/photos/${projectId}`, {
        next: { revalidate: 3600 },
      })
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`Failed to fetch photos: ${response.statusText}`)
      }
      return (await response.json()) as Photo[]
    } catch (fetchError) {
      console.error('[Action] getPhotoDetails: HTTP fetch also failed', fetchError)
    }

    // Strategy 3: Static fallback
    console.warn('[Action] getPhotoDetails: All strategies failed, returning fallback')
    return typeof sequence === 'number'
      ? { ...FALLBACK_PHOTO, projectId, id: `${projectId}-fallback` }
      : [{ ...FALLBACK_PHOTO, projectId, id: `${projectId}-fallback` }]
  },
)
