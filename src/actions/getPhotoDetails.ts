import {Photo} from "@prisma/client";

export async function getPhotoDetails(slug: string): Promise<Photo[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos/${slug}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch photo details for project ${slug}, status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching photo details:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

