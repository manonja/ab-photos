'use client';

import Link from 'next/link';
import React, { useEffect } from "react";
import { useCurrentProject } from '@/context/CurrentProjectContext';

interface Project {
    title: string
    id: string
    slug: string
}

interface WorkListProps {
    projects: Partial<Project>[]
}

const WorkList = ({ projects }: WorkListProps) => {
    const { currentProjectId } = useCurrentProject();
    
    // Debug logging
    useEffect(() => {
        console.log('[Component] WorkList: Current project ID:', currentProjectId);
        console.log('[Component] WorkList: Available projects:', projects.map(p => ({
            id: p.id,
            title: p.title
        })));
    }, [currentProjectId, projects]);
    
    return (
        <div className="mb-32 grid text-center p-6 lg:max-w-7xl gap-2 lg:mb-0 lg:grid-cols-2 lg:text-right lg:self-end">
            {projects.map((project) => {
                const href = `/work/${project.id}`;
                const isCurrentProject = currentProjectId === project.id;
                
                return (
                    <div key={project.id} 
                         className={`transition-opacity duration-1000 ${isCurrentProject ? 'opacity-100' : 'opacity-60'}`}>
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