import ProjectDetails from "@/app/work/components/projectDetails";
import ProjectPhotos from "@/app/work/components/projectPhotos";
import BackgroundImage from "@/app/work/components/backgroundImage";
import BlockRenderer from "@/components/BlockRenderer";
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import React from "react";
import { getStaticProjectPaths } from "@/actions/getProjectsDetails";

export const dynamic = 'force-static';

export async function generateStaticParams() {
    // Get legacy project paths
    const legacyPaths = await getStaticProjectPaths();

    // Get Payload project paths
    try {
        const payload = await getPayload({ config })
        const projects = await payload.find({
            collection: 'projects',
            where: { isPublished: { equals: true } },
            limit: 100,
        })
        const payloadPaths = projects.docs.map((project) => ({
            slug: project.slug,
        }))

        // Merge and deduplicate
        const allSlugs = new Set([
            ...legacyPaths.map(p => p.slug),
            ...payloadPaths.map(p => p.slug)
        ])

        return Array.from(allSlugs).map(slug => ({ slug }))
    } catch {
        // If Payload is not available, return legacy paths only
        return legacyPaths;
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Try to fetch from Payload CMS first
    try {
        const payload = await getPayload({ config })
        const projects = await payload.find({
            collection: 'projects',
            where: {
                slug: { equals: slug },
                isPublished: { equals: true },
            },
            limit: 1,
        })

        const project = projects.docs[0]

        if (project && project.layout && project.layout.length > 0) {
            // Render with Payload blocks
            return (
                <main className="flex min-h-screen flex-col items-center">
                    <BlockRenderer blocks={project.layout as never[]} />
                </main>
            )
        }
    } catch {
        // Payload not available, fall back to legacy rendering
    }

    // Fall back to legacy rendering for existing projects
    return (
        <>
            <BackgroundImage slug={slug} random={true} />
            <main className="flex min-h-screen flex-col lg:w-[90%] justify-between items-center lg:p-6 p-2">
                <div className="mt-40 lg:pt-0 h-px bg-white w-full"/>
                <ProjectDetails slug={slug}/>
                <div className="lg:mt-32 mt-16 lg:pt-0 h-px w-full"/>
                <ProjectPhotos slug={slug}/>
            </main>
        </>
    )
}
