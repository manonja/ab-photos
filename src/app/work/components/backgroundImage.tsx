import React, { Suspense } from "react";
import Image from "next/image";
import { getPhotoDetails } from "@/actions/getPhotoDetails";
import { Photo } from "@/db/types";

// Only use edge runtime when not in development
export const runtime = process.env.NODE_ENV === 'development' ? 'nodejs' : 'edge';

console.log('[Component] BackgroundImage: Runtime environment', {
    environment: process.env.NODE_ENV,
    runtime: runtime
});

interface BackgroundImageProps {
    slug: string;
    sequence?: number;
    random?: boolean;
}

/**
 * A component that displays a full-screen background image.
 * Can display a specific photo by sequence number or a random photo from the project.
 * Uses next/image for optimization when possible, falling back to img when needed.
 * 
 * @param slug - The unique identifier of the project
 * @param sequence - Optional sequence number of the photo to display (defaults to 2)
 * @param random - If true, selects a random photo from the project instead of using sequence
 */
const BackgroundImage: React.FC<BackgroundImageProps> = async ({ slug, sequence = 2, random = false }) => {
    let photo: Photo | null = null;
    
    try {
        if (random) {
            // Fetch all photos for the project with caching
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8788';
            const url = `${baseUrl}/api/photos/${slug}`;
            
            // Using only revalidate option for proper ISR (Incremental Static Regeneration)
            const response = await fetch(url, { 
                next: { revalidate: 3600 } // Revalidate every hour
            });
            
            if (response.ok) {
                const photos = await response.json() as Photo[];
                if (Array.isArray(photos) && photos.length > 0) {
                    // For static builds, use the same "random" photo each time for consistency
                    // We use the project slug to generate a consistent index
                    const index = getConsistentRandomIndex(slug, photos.length);
                    photo = photos[index];
                } else {
                    console.warn(`[Component] BackgroundImage: No photos found for project: ${slug}`);
                }
            } else {
                console.warn(`[Component] BackgroundImage: Failed to fetch photos for project: ${slug}`, response.status);
            }
        } else {
            // Fetch a specific photo by sequence
            photo = await getPhotoDetails(slug, sequence) as Photo;
        }
        
        if (!photo) {
            console.warn(`[Component] BackgroundImage: No background image found for project: ${slug}`);
            return (
                <div 
                    data-testid="background-fallback" 
                    className="fixed inset-0 -z-10 bg-black"
                    aria-label={`Background for ${slug} project`}
                />
            );
        }

        // Debug the photo data
        console.log('[Component] BackgroundImage: Photo data', {
            id: photo.id,
            slug,
            sequence,
            desktop_blob: photo.desktop_blob?.substring(0, 100) + '...',
            apiUrl: process.env.NEXT_PUBLIC_API_URL
        });

        const ImageFallback = (
            <div data-testid="background-fallback" className="fixed inset-0 -z-10 bg-black" />
        );

        // Dynamic URLs require next/image configuration in next.config.js
        // or we need to use unoptimized mode
        return (
            <Suspense fallback={ImageFallback}>
                <div className="fixed inset-0 -z-10">
                    <Image
                        src={photo.desktop_blob}
                        alt={photo.caption || `Background image for ${slug} project`}
                        fill
                        priority
                        quality={90}
                        className="object-cover"
                        referrerPolicy="no-referrer"
                        unoptimized={!photo.desktop_blob.startsWith('https://')} // Use unoptimized for data URLs
                    />
                </div>
            </Suspense>
        );
    } catch (error) {
        console.error('[Component] BackgroundImage: Error occurred', error);
        return (
            <div 
                data-testid="background-fallback" 
                className="fixed inset-0 -z-10 bg-black"
                aria-label={`Background for ${slug} project`}
            />
        );
    }
}

/**
 * Generates a consistent "random" index based on a string seed.
 * This ensures the same project always gets the same background image
 * which is better for static site generation.
 */
function getConsistentRandomIndex(seed: string, max: number): number {
    // Simple hash function for the string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Use absolute value and modulo to get index in range
    return Math.abs(hash) % max;
}

export default BackgroundImage;