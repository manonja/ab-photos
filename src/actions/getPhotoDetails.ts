import { Photo } from "@/types/database";

/**
 * Server action to fetch photo details from the API.
 * Can fetch either all photos for a project or a specific photo by sequence.
 * 
 * @param projectId - The unique identifier of the project
 * @param sequence - Optional sequence number to fetch a specific photo
 * @returns Promise<Photo | null> - Array of photos, single photo, or null if not found
 * @throws Will throw an error if the API request fails
 */
export async function getPhotoDetails(projectId: string, sequence?: number): Promise<Photo | null> {
    console.log('[Action] getPhotoDetails: Starting request', { projectId, sequence });
    
    // Get the base URL for the API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8788';
    
    try {
        if (typeof sequence === 'number') {
            // Fetch specific photo
            console.log('[Action] getPhotoDetails: Fetching specific photo', { projectId, sequence });
            const response = await fetch(`${baseUrl}/api/photos/${projectId}/${sequence}`);
            
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
            const response = await fetch(`${baseUrl}/api/photos/${projectId}`);
            
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
}

