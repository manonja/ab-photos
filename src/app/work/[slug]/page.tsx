import ProjectDetails from "@/app/work/components/projectDetails";
import ProjectPhotos from "@/app/work/components/projectPhotos";
import React from "react";

export const runtime = 'edge';

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return (
        <main className="flex min-h-screen flex-col w-[90%] justify-between items-center lg:p-6 p-2">
            <div className="mt-40 lg:mt-16 lg:pt-0 h-px bg-white w-full"/>
            <ProjectDetails slug={params.slug}/>
            <ProjectPhotos slug={params.slug}/>
        </main>
    )
}