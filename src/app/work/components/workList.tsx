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
    const projects: Partial<Project>[] = await getProjectsDetails()

    return (
        <div className="mb-32 grid text-center p-6 lg:max-w-7xl gap-2 lg:mb-0 lg:grid-cols-2 lg:text-right lg:self-end">
            {projects.map((project) => (
                <div key={project.id}>
                    <Link
                        href={`/work/${project.slug || ''}`}>
                        <h2 className={`group p-2 bg-black text-white px-5 relative transition-colors hover:bg-fuchsia-500 hover:text-black align-middle m-2 text-4xl font-semibold`}>{project.title}</h2> </Link>
                </div>
            ))}
        </div>


    );
}
export default WorkList