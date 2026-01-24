import { sql } from './client'
import type { DatabaseError, Photo, Project } from './types'

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
    console.log('[DB] findPhotosByProjectId: Starting request', { projectId })

    const result = await sql`
            SELECT * FROM photos 
            WHERE photos.project_id = ${projectId}
        `

    const photos = result as Photo[]
    console.log('[DB] findPhotosByProjectId: Successfully fetched photos', {
      projectId,
      photoCount: photos.length,
    })

    return photos
  } catch (error) {
    console.error('[DB] findPhotosByProjectId: Error occurred', {
      error,
      code: (error as DatabaseError).code,
      projectId,
    })
    throw error
  }
}

/**
 * Retrieves all published projects from the database.
 *
 * @returns Promise<Project[]> - Array of published project objects
 * @throws Will throw an error if the database query fails
 */
export async function findAllProjects(): Promise<Project[]> {
  try {
    console.log('[DB] findAllProjects: Starting request')

    const result = await sql`
            SELECT * FROM projects
            WHERE "isPublished" = true
        `

    const projects = result as Project[]
    console.log('[DB] findAllProjects: Successfully fetched projects', {
      projectCount: projects.length,
    })

    return projects
  } catch (error) {
    console.error('[DB] findAllProjects: Error occurred', {
      error,
      code: (error as DatabaseError).code,
    })
    throw error
  }
}

/**
 * Finds a single project by its slug identifier.
 *
 * @param slug - The unique slug identifier for the project
 * @returns Promise<Project | null> - Project object if found, null otherwise
 * @throws Will throw an error if the database query fails
 */
export async function findProjectBySlug(slug: string): Promise<Project | null> {
  try {
    console.log('[DB] findProjectBySlug: Starting request', { slug })

    const result = await sql`
            SELECT * FROM projects
            WHERE id = ${slug}
            LIMIT 1
        `

    const projects = result as Project[]
    const project = projects[0] || null

    if (!project) {
      console.warn('[DB] findProjectBySlug: Project not found', { slug })
    } else {
      console.log('[DB] findProjectBySlug: Successfully fetched project', {
        slug,
        projectId: project.id,
      })
    }

    return project
  } catch (error) {
    console.error('[DB] findProjectBySlug: Error occurred', {
      error,
      code: (error as DatabaseError).code,
      slug,
    })
    throw error
  }
}

/**
 * Retrieves a specific photo by project ID and sequence number.
 *
 * @param projectId - The unique identifier of the project
 * @param sequence - The sequence number of the photo within the project
 * @returns Promise<Photo | null> - Photo object if found, null otherwise
 * @throws Will throw an error if the database query fails
 */
export async function findPhotoByProjectIdAndSeq(
  projectId: string,
  sequence: number,
): Promise<Photo | null> {
  try {
    console.log('[DB] findPhotoByProjectIdAndSeq: Starting request', {
      projectId,
      sequence,
    })

    const result = await sql`
            SELECT * FROM photos 
            WHERE project_id = ${projectId}
            AND sequence = ${sequence}
            LIMIT 1
        `

    const photos = result as Photo[]
    const photo = photos[0] || null

    if (!photo) {
      console.warn('[DB] findPhotoByProjectIdAndSeq: Photo not found', {
        projectId,
        sequence,
      })
    } else {
      console.log('[DB] findPhotoByProjectIdAndSeq: Successfully fetched photo', {
        projectId,
        sequence,
        photoId: photo.id,
      })
    }

    return photo
  } catch (error) {
    console.error('[DB] findPhotoByProjectIdAndSeq: Error occurred', {
      error,
      code: (error as DatabaseError).code,
      projectId,
      sequence,
    })
    throw error
  }
}
