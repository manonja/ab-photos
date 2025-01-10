import { sql, pool } from './client';
import { Photo, Project } from './types';

export async function findPhotosByProjectId(projectId: string): Promise<Photo[]> {
    const result = await sql`
        SELECT * FROM photos 
        WHERE "projectId" = ${projectId}
        ORDER BY sequence ASC
    `;
    return result as Photo[];
}

export async function findAllProjects(): Promise<Project[]> {
    const result = await sql`
        SELECT * FROM projects
        WHERE "isPublished" = true
    `;
    return result as Project[];
}

export async function findProjectBySlug(slug: string): Promise<Project | null> {
    const result = await sql`
        SELECT * FROM projects
        WHERE id = ${slug}
        LIMIT 1
    `;
    const projects = result as Project[];
    return projects[0] || null;
}

// For transactions or complex queries, use the pool
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
} 