import { Photo } from "@/types/database";

export async function getPhotoDetails(slug: string): Promise<Photo[]> {
    console.log('[API] getPhotoDetails: Starting request', { slug });
    
    if (!slug) {
        console.error('[API] getPhotoDetails: Missing slug parameter');
        throw new Error('Slug is required');
    }

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/photos/${slug}`;
        console.log('[API] getPhotoDetails: Fetching from', apiUrl);
        
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('[API] getPhotoDetails: Error response', {
                status: res.status,
                statusText: res.statusText,
                error: errorText,
                slug
            });
            throw new Error(`Failed to fetch photo details for project ${slug}, status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
            console.error('[API] getPhotoDetails: Invalid response format', {
                receivedData: data,
                slug
            });
            throw new Error('Invalid API response format: expected array');
        }
        
        const photos = data as Photo[];
        console.log('[API] getPhotoDetails: Successfully fetched', {
            photoCount: photos.length,
            slug
        });
        
        return photos;
    } catch (error) {
        console.error('[API] getPhotoDetails: Unexpected error', {
            error,
            slug,
            apiUrl: process.env.NEXT_PUBLIC_API_URL
        });
        throw error;
    }
}

