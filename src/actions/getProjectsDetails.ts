import { Project } from "@/types/database";

export async function getProjectsDetails(): Promise<Project[]> {
    console.log('[API] getProjectsDetails: Starting request');
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;
        console.log('[API] getProjectsDetails: Fetching from', apiUrl);
        
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('[API] getProjectsDetails: Error response', {
                status: res.status,
                statusText: res.statusText,
                error: errorText
            });
            throw new Error('Failed to fetch projects');
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
            console.error('[API] getProjectsDetails: Invalid response format', data);
            throw new Error('Invalid API response format: expected array');
        }
        
        const projects = data as Project[];
        console.log('[API] getProjectsDetails: Successfully fetched', { projectCount: projects.length });
        return projects;
    } catch (error) {
        console.error('[API] getProjectsDetails: Unexpected error', error);
        throw error;
    }
}