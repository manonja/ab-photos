import {Project} from "@prisma/client";


export async function getProjectsDetails(): Promise<Project[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
    if (!res.ok) {
        throw new Error('Failed to fetch projects');
    }
    return res.json();
}