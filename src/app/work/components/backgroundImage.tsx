import React, { Suspense } from "react";
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
}

/**
 * A component that displays a full-screen background image.
 * By default, it shows the second photo (sequence=2) from the project.
 * 
 * @param slug - The unique identifier of the project
 * @param sequence - Optional sequence number of the photo to display (defaults to 2)
 */
const BackgroundImage: React.FC<BackgroundImageProps> = async ({ slug, sequence = 2 }) => {
    try {
        const photo = await getPhotoDetails(slug, sequence) as Photo;
        
        if (!photo) {
            console.warn(`No background image found for project: ${slug}, sequence: ${sequence}`);
            return <div data-testid="background-fallback" className="fixed inset-0 -z-10 bg-black" />;
        }

        // Debug the photo data
        console.log('[Component] BackgroundImage: Photo data', {
            id: photo.id,
            slug,
            sequence,
            desktop_blob: photo.desktop_blob?.substring(0, 100) + '...',
            apiUrl: process.env.NEXT_PUBLIC_API_URL
        });

        return (
            <Suspense fallback={<div data-testid="background-fallback" className="fixed inset-0 -z-10 bg-black" />}>
                <div className="fixed inset-0 -z-10">
                    <img
                        src={photo.desktop_blob}
                        alt={photo.caption || 'Background'}
                        className="object-cover w-full h-full"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </Suspense>
        );
    } catch (error) {
        console.error('Error in BackgroundImage:', error);
        return <div data-testid="background-fallback" className="fixed inset-0 -z-10 bg-black" />;
    }
}

export default BackgroundImage;