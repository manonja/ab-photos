import React from "react";
import { getPhotoDetails } from "@/actions/getPhotoDetails";
import { Photo } from "@/db/types";

export const runtime = "edge"

interface ProjectPhotosProps {
    slug: string;
}

/**
 * A component that displays a grid of photos for a specific project.
 * Photos are displayed in a single column on large screens with padding.
 * 
 * @param slug - The unique identifier of the project
 */
const ProjectPhotos: React.FC<ProjectPhotosProps> = async ({ slug }) => {
    try {
        const photos = await getPhotoDetails(slug) as Photo[];

        if (!photos.length) {
            return (
                <div className="text-center p-6">
                    <p>No photos available for this project.</p>
                </div>
            );
        }

        return (
            <div className="grid text-center lg:p-6 gap-2 lg:mb-0 lg:grid-cols-1 lg:text-right self-end">
                {photos.map((photo) => (
                    <div key={photo.id} className="w-full lg:p-12 pb-4">
                        <img
                            src={photo.desktop_blob}
                            alt={photo.caption || ''}
                            className="w-full h-auto object-cover lg:max-w-full lg:max-h-screen"
                        />
                        {photo.caption && (
                            <p className="mt-2 text-left italic text-sm text-gray-400">
                                {photo.caption}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        );
    } catch (error) {
        console.error('Error in ProjectPhotos:', error);
        return (
            <div className="text-center p-6">
                <p>Error loading photos. Please try again later.</p>
            </div>
        );
    }
}

export default ProjectPhotos;