import Link from 'next/link';
import {getProjectsDetails} from "@/actions/getProjectsDetails";
import React from "react";
import {getPhotoDetails} from "@/actions/getPhotoDetails";
import {Photo} from "@prisma/client";
export const runtime = "edge"

interface BackgroundImageProps {
    slug: string
}

const BackgroundImage: React.FC<BackgroundImageProps> = async ({slug}) => {
    const photos = await getPhotoDetails(slug)

    const src = photos.map((photo) => photo.desktop_blob)[0]
    return (
        <div className="fixed inset-0 -z-10">
            <img
                src={src}
                alt="Background"
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
        </div>
    );
}
export default BackgroundImage