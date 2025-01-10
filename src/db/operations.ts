import { sql, pool } from './client';
import { Photo, Project } from './types';

/**
 * Database Operations Module
 * 
 * This module provides database query operations for photos and projects using a SQL database.
 * It utilizes a connection pool and SQL template literals for safe query execution.
 * 
 * @module db/operations
 * 
 * TODO: Potential Issues
 * - Fix findProjectBySlug to use slug instead of id in WHERE clause
 * - Add input validation before query execution
 * 
 * TODO: Type Safety Improvements
 * - Add zod schemas for runtime type validation
 * - Create stricter types for database results
 * - Add type guards for null checks
 * 
 * TODO: General Improvements
 * - Implement input sanitization
 * - Add pagination for findAllProjects
 * - Create database indices for project_id, slug columns
 * - Implement caching layer for frequent queries
 * - Add rate limiting for database operations
 * - Set query timeouts
 * - Replace console.log with proper logging service
 */

/**
 * Retrieves all photos associated with a specific project.
 * 
 * @param projectId - The unique identifier of the project
 * @returns Promise<Photo[]> - Array of photo objects
 * @throws Will throw an error if the database query fails
 */
export async function findPhotosByProjectId(projectId: string): Promise<Photo[]> {
    try {
        console.log('Fetching photos for project:', projectId);
        const result = await sql`
            SELECT * FROM photos 
            WHERE photos.project_id = ${projectId}
        `;
        console.log('Found photos:', result);
        return result as Photo[];
    } catch (error) {
        console.error('Error fetching photos:', error);
        throw error;
    }
}

/**
 * Retrieves all published projects from the database.
 * Filters projects based on the "isPublished" flag.
 * 
 * @returns Promise<Project[]> - Array of published project objects
 * @throws Will throw an error if the database query fails
 */
export async function findAllProjects(): Promise<Project[]> {
    try {
        console.log('Fetching all published projects');
        const result = await sql`
            SELECT * FROM projects
            WHERE "isPublished" = true
        `;
        console.log('Found projects:', result);
        return result as Project[];
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

/**
 * Finds a single project by its slug identifier.
 * Note: The current implementation appears to be using 'id' instead of 'slug' in the WHERE clause,
 * which might need to be reviewed.
 * 
 * @param slug - The unique slug identifier for the project
 * @returns Promise<Project | null> - Project object if found, null otherwise
 * @throws Will throw an error if the database query fails
 */
export async function findProjectBySlug(slug: string): Promise<Project | null> {
    try {
        console.log('Fetching project by slug:', slug);
        const result = await sql`
            SELECT * FROM projects
            WHERE id = ${slug}
            LIMIT 1
        `;
        console.log('Found project:', result);
        const projects = result as Project[];
        return projects[0] || null;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
}
