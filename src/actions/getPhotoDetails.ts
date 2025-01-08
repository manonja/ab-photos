import {Photo} from "@prisma/client";

export async function getPhotoDetails(slug: string): Promise<Photo[]> {
    if (!slug) {
        throw new Error('Slug is required');
    }

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/photos/${slug}`;
        console.log('Fetching from:', apiUrl); // Debug log
        
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`API Error (${res.status}):`, errorText);
            throw new Error(`Failed to fetch photo details for project ${slug}, status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
            console.error('Unexpected API response:', data);
            throw new Error('Invalid API response format');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching photo details:', error);
        throw error;
    }
}

