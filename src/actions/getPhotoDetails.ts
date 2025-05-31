import { Photo } from "@/types/database";
import { cache } from 'react';

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
    console.log('[Action] getPhotoDetails: Starting request', { projectId, sequence });
    
    // Get the base URL for the API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
        if (typeof sequence === 'number') {
            // Fetch specific photo
            console.log('[Action] getPhotoDetails: Fetching specific photo', { projectId, sequence });
            console.log('[Action] getPhotoDetails: Fetching from', `${baseUrl}/api/photos/${projectId}/${sequence}`);
            const response = await fetch(`${baseUrl}/api/photos/${projectId}/${sequence}`, {
                cache: 'force-cache',
                next: { revalidate: 3600 } // Revalidate every hour
            });
            
            if (!response.ok) {
                console.warn('[Action] getPhotoDetails: Non-OK response', {
                    status: response.status,
                    statusText: response.statusText,
                    projectId,
                    sequence
                });
                
                if (response.status === 404) return null;
                throw new Error(`Failed to fetch photo: ${response.statusText}`);
            }
            
            const photo = await response.json() as Photo;
            console.log('[Action] getPhotoDetails: Successfully fetched photo', {
                projectId,
                sequence,
                photoId: photo.id
            });
            return photo;
        } else {
            // Fetch all photos for project
            console.log('[Action] getPhotoDetails: Fetching all project photos', { projectId });
            const response = await fetch(`${baseUrl}/api/photos/${projectId}`, {
                cache: 'force-cache',
                next: { revalidate: 3600 } // Revalidate every hour
            });
            
            if (!response.ok) {
                console.warn('[Action] getPhotoDetails: Non-OK response', {
                    status: response.status,
                    statusText: response.statusText,
                    projectId
                });
                
                if (response.status === 404) return null;
                throw new Error(`Failed to fetch photos: ${response.statusText}`);
            }
            
            const photos = await response.json() as Photo[];
            console.log('[Action] getPhotoDetails: Successfully fetched photos', {
                projectId,
                photoCount: photos.length
            });
            return photos;
        }
    } catch (error) {
        console.error('[Action] getPhotoDetails: Error occurred', {
            error,
            projectId,
            sequence
        });
        throw error;
    }
});

