import { Photo } from "@/types/database";
import { cache } from 'react';

// Fallback photo data - use as emergency fallback when API fails
const FALLBACK_PHOTO: Photo = {
    id: 'fallback',
    projectId: 'fallback',
    sequence: 1,
    caption: 'Fallback image',
    desktop_blob: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // 1x1 transparent GIF
    mobile_blob: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    gallery_blob: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
};

/**
 * Server action to fetch photo details from the API.
 * Can fetch either all photos for a project or a specific photo by sequence.
 * Uses ISR with 1-hour revalidation.
 * Uses React cache to memoize results within a request lifecycle.
 * 
 * @param projectId - The unique identifier of the project
 * @param sequence - Optional sequence number to fetch a specific photo
 * @returns Promise<Photo | Photo[] | null> - Array of photos, single photo, or null if not found
 * @throws Will throw an error if the API request fails
 */
export const getPhotoDetails = cache(async (projectId: string, sequence?: number): Promise<Photo | Photo[] | null> => {
    // Get the base URL for the API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // If base URL is not available, return fallback immediately
    if (!baseUrl) {
        console.warn('[Action] getPhotoDetails: NEXT_PUBLIC_API_URL not defined, using fallback');
        return { ...FALLBACK_PHOTO, projectId, id: `${projectId}-fallback` };
    }
    
    try {
        if (typeof sequence === 'number') {
            // Fetch specific photo
            console.log('[Action] getPhotoDetails: Fetching specific photo', { projectId, sequence });
            
            try {
                const response = await fetch(`${baseUrl}/api/photos/${projectId}/${sequence}`, {
                    cache: 'force-cache',
                    next: { revalidate: 3600 } // Revalidate every hour
                });
                
                if (!response.ok) {
                    if (response.status === 404) return null;
                    throw new Error(`Failed to fetch photo: ${response.statusText}`);
                }
                
                const photo = await response.json() as Photo;
                return photo;
            } catch (error) {
                console.error('[Action] getPhotoDetails: Error fetching specific photo', error);
                // Return fallback photo with project ID for better context
                return { ...FALLBACK_PHOTO, projectId, id: `${projectId}-fallback` };
            }
        } else {
            // Fetch all photos for project
            console.log('[Action] getPhotoDetails: Fetching all project photos', { projectId });
            
            try {
                const response = await fetch(`${baseUrl}/api/photos/${projectId}`, {
                    cache: 'force-cache',
                    next: { revalidate: 3600 } // Revalidate every hour
                });
                
                if (!response.ok) {
                    if (response.status === 404) return null;
                    throw new Error(`Failed to fetch photos: ${response.statusText}`);
                }
                
                const photos = await response.json() as Photo[];
                return photos;
            } catch (error) {
                console.error('[Action] getPhotoDetails: Error fetching project photos', error);
                // Return array with a single fallback photo
                return [{ ...FALLBACK_PHOTO, projectId, id: `${projectId}-fallback` }];
            }
        }
    } catch (error) {
        console.error('[Action] getPhotoDetails: Unexpected error', error);
        // Final fallback
        return { ...FALLBACK_PHOTO, projectId, id: `${projectId}-fallback` };
    }
});

