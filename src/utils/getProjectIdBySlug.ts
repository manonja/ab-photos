import { findProjectBySlug } from '@/db/operations';

export async function getProjectIdBySlug(slug: string): Promise<string | null> {
    try {
        const project = await findProjectBySlug(slug);
        return project?.id || null;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}