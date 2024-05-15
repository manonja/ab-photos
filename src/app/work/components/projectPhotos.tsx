import React from "react";
import {getPhotoDetails} from "@/actions/getPhotoDetails";
export const runtime = "edge"

interface ProjectDetailsProps {
    slug: string
}

const ProjectDetails: React.FC<ProjectDetailsProps> = async ({slug}) => {
    // const photos = await getPhotoDetails(slug)

    return (
        <div className="mb-32 grid text-center p-6 lg:max-w-7xl gap-2 lg:mb-0 lg:grid-cols-2 lg:text-right self-end">

        </div>


    );
}
export default ProjectDetails