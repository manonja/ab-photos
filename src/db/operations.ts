import type { Exhibit } from '@/types/exhibit'
import { getDb } from './client'
import type { NewsPost, Photo, Project } from './types'

export async function findPhotosByProjectId(projectId: string): Promise<Photo[]> {
  console.log('[DB] findPhotosByProjectId: Starting request', { projectId })
  const db = getDb()
  const { results } = await db
    .prepare(
      'SELECT id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id AS projectId FROM photos WHERE project_id = ?',
    )
    .bind(projectId)
    .all<Photo>()
  console.log('[DB] findPhotosByProjectId: Successfully fetched photos', {
    projectId,
    photoCount: results.length,
  })
  return results
}

export async function findAllProjects(): Promise<Project[]> {
  console.log('[DB] findAllProjects: Starting request')
  const db = getDb()
  const { results } = await db
    .prepare('SELECT * FROM projects WHERE isPublished = 1')
    .all<Project>()
  console.log('[DB] findAllProjects: Successfully fetched projects', {
    projectCount: results.length,
  })
  return results.map((p) => ({ ...p, isPublished: Boolean(p.isPublished) }))
}

export async function findProjectBySlug(slug: string): Promise<Project | null> {
  console.log('[DB] findProjectBySlug: Starting request', { slug })
  const db = getDb()
  const result = await db
    .prepare('SELECT * FROM projects WHERE id = ? LIMIT 1')
    .bind(slug)
    .first<Project>()
  if (!result) {
    console.warn('[DB] findProjectBySlug: Project not found', { slug })
    return null
  }
  console.log('[DB] findProjectBySlug: Successfully fetched project', {
    slug,
    projectId: result.id,
  })
  return { ...result, isPublished: Boolean(result.isPublished) }
}

export async function findPhotoByProjectIdAndSeq(
  projectId: string,
  sequence: number,
): Promise<Photo | null> {
  console.log('[DB] findPhotoByProjectIdAndSeq: Starting request', { projectId, sequence })
  const db = getDb()
  const result = await db
    .prepare(
      'SELECT id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id AS projectId FROM photos WHERE project_id = ? AND sequence = ? LIMIT 1',
    )
    .bind(projectId, sequence)
    .first<Photo>()
  if (!result) {
    console.warn('[DB] findPhotoByProjectIdAndSeq: Photo not found', { projectId, sequence })
    return null
  }
  console.log('[DB] findPhotoByProjectIdAndSeq: Successfully fetched photo', {
    projectId,
    sequence,
    photoId: result.id,
  })
  return result
}

interface NewsPostRow {
  id: string
  title: string
  date: string
  author: string
  excerpt: string | null
  featuredImage: string | null
  tags: string
  published: number
  layout: string
  content: string
}

function mapNewsRow(row: NewsPostRow): NewsPost {
  return {
    ...row,
    tags: JSON.parse(row.tags),
    published: Boolean(row.published),
  }
}

export async function findAllNews(): Promise<NewsPost[]> {
  console.log('[DB] findAllNews: Starting request')
  const db = getDb()
  const { results } = await db
    .prepare('SELECT * FROM news WHERE published = 1 ORDER BY date DESC')
    .all<NewsPostRow>()
  console.log('[DB] findAllNews: Successfully fetched news', {
    postCount: results.length,
  })
  return results.map(mapNewsRow)
}

export async function findNewsBySlug(slug: string): Promise<NewsPost | null> {
  console.log('[DB] findNewsBySlug: Starting request', { slug })
  const db = getDb()
  const result = await db
    .prepare('SELECT * FROM news WHERE id = ? LIMIT 1')
    .bind(slug)
    .first<NewsPostRow>()
  if (!result) {
    console.warn('[DB] findNewsBySlug: Post not found', { slug })
    return null
  }
  console.log('[DB] findNewsBySlug: Successfully fetched post', { slug })
  return mapNewsRow(result)
}

export async function findNewsByTag(tag: string): Promise<NewsPost[]> {
  console.log('[DB] findNewsByTag: Starting request', { tag })
  const posts = await findAllNews()
  return posts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
}

export async function findAllNewsTags(): Promise<string[]> {
  console.log('[DB] findAllNewsTags: Starting request')
  const posts = await findAllNews()
  const tagSet = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

export async function findAllExhibits(): Promise<Exhibit[]> {
  console.log('[DB] findAllExhibits: Starting request')
  const db = getDb()
  const { results } = await db
    .prepare('SELECT * FROM exhibits ORDER BY startDate DESC')
    .all<Exhibit>()
  console.log('[DB] findAllExhibits: Successfully fetched exhibits', {
    exhibitCount: results.length,
  })
  return results.map((e) => ({
    ...e,
    isActive: Boolean(e.isActive),
    isUpcoming: Boolean(e.isUpcoming),
  }))
}
