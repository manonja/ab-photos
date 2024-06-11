import React from "react";
import {getPhotoDetails} from "@/actions/getPhotoDetails";
export const runtime = "edge"

interface ProjectDetailsProps {
    slug: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = async ({slug}) => {
    const photos = await getPhotoDetails(slug)

    return (
        <div className="grid text-center p-6 gap-2 lg:mb-0 lg:grid-cols-1 lg:text-right self-end">
            {photos.map((photo) => (
                <div key={photo.id} className="w-full lg:p-12 pb-2">
                    <img
                        src={photo.desktop_blob}
                        alt={photo.caption || ''}
                        className="w-full h-auto object-cover lg:max-w-full lg:max-h-screen"
                    />
                    {/*<p className="mt-2 text-left italic text-sm text-gray-400">{photo.caption}</p>*/}
                </div>
            ))}
        </div>


    );
}
export default ProjectDetails