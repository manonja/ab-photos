import React, { Suspense } from "react";
import {getPhotoDetails} from "@/actions/getPhotoDetails";
import Image from 'next/image';

export const runtime = "edge"

interface BackgroundImageProps {
    slug: string
}

const ImageLoader = async ({src}: {src: string}) => {
    return (
        <div className="fixed inset-0 -z-10">
            <Image
                src={src}
                alt="Background"
                fill
                className="object-cover"
                priority
                sizes="100vw"
            />
        </div>
    );
}

const BackgroundImage: React.FC<BackgroundImageProps> = async ({slug}) => {
    try {
        const photos = await getPhotoDetails(slug);
        
        if (!photos || photos.length < 2) {
            console.warn(`No background image found for slug: ${slug}`);
            return null;
        }

        const src = photos[1].desktop_blob;
        
        return (
            <Suspense fallback={<div className="fixed inset-0 -z-10 bg-black" />}>
                <ImageLoader src={src} />
            </Suspense>
        );
    } catch (error) {
        console.error('Error in BackgroundImage:', error);
        return <div className="fixed inset-0 -z-10 bg-black" />;
    }
}

export default BackgroundImage;