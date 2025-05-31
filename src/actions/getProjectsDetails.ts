import { Project } from "@/types/database";

// Static fallback data for projects
const FALLBACK_PROJECTS: Project[] = [
    { id: '7-rad', title: '7 Rad', description: '', isPublished: true },
    { id: 'pyrenees', title: 'Pyrenees', description: '', isPublished: true },
    { id: 'industry', title: 'Industry', description: '', isPublished: true }
    // Add more static project data as needed
];

/**
 * Fetches project details from the API or returns static data.
 * 
 * @param options - Configuration options
 * @param options.useStatic - Whether to use static fallback data instead of API
 * @returns Promise resolving to array of Project objects
 */
export async function getProjectsDetails({ useStatic = false } = {}): Promise<Project[]> {
    // Return static data immediately if requested
    if (useStatic) {
        return FALLBACK_PROJECTS;
    }
    
    console.log('[API] getProjectsDetails: Starting request');
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;
        console.log('[API] getProjectsDetails: Fetching from', apiUrl);
        
        // Using only revalidate option for proper ISR (Incremental Static Regeneration)
        const res = await fetch(apiUrl, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('[API] getProjectsDetails: Error response', {
                status: res.status,
                statusText: res.statusText,
                error: errorText
            });
            console.log('[API] getProjectsDetails: Falling back to static data');
            return FALLBACK_PROJECTS;
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
            console.error('[API] getProjectsDetails: Invalid response format', data);
            console.log('[API] getProjectsDetails: Falling back to static data');
            return FALLBACK_PROJECTS;
        }
        
        const projects = data as Project[];
        console.log('[API] getProjectsDetails: Successfully fetched', { projectCount: projects.length });
        return projects;
    } catch (error) {
        console.error('[API] getProjectsDetails: Unexpected error', error);
        console.log('[API] getProjectsDetails: Falling back to static data');
        return FALLBACK_PROJECTS;
    }
}

/**
 * Returns project slugs for static site generation.
 * 
 * @returns Array of objects with slug property for Next.js static paths
 */
export function getStaticProjectPaths(): { slug: string }[] {
    return FALLBACK_PROJECTS.map(project => ({ slug: project.id }));
}

/**
 * Checks if a given slug is a valid project slug against static project list.
 * 
 * @param slug - The slug to check
 * @returns Boolean indicating if the slug is valid
 */
export function isValidProjectSlug(slug: string): boolean {
    return FALLBACK_PROJECTS.some(project => project.id === slug);
}