import Link from 'next/link';
import {getProjectsDetails} from "@/actions/getProjectsDetails";
import React from "react";
export const runtime = "edge"

interface Project {
    title: string
    id: string
    slug: string
}

const WorkList = async () => {
    console.log('[Component] WorkList: Fetching project details');
    const projects: Partial<Project>[] = await getProjectsDetails()
    
    console.log('[Component] WorkList: Projects fetched', {
        projectCount: projects.length,
        projects: projects.map(p => ({
            id: p.id,
            slug: p.slug,
            hasSlug: !!p.slug
        }))
    });

    return (
        <div className="mb-32 grid text-center p-6 lg:max-w-7xl gap-2 lg:mb-0 lg:grid-cols-2 lg:text-right lg:self-end">
            {projects.map((project) => {
                const href = `/work/${project.id}`;
                console.log('[Component] WorkList: Generating link', {
                    projectId: project.id,
                    projectTitle: project.title,
                    href
                });
                
                return (
                    <div key={project.id}>
                        <Link href={href}>
                            <h2 className={`group p-2 bg-black text-white px-5 relative transition-colors hover:bg-white hover:text-black align-middle m-2 text-4xl font-semibold`}>
                                {project.title}
                            </h2>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
export default WorkList