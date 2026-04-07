/**
 * Transform PostgreSQL (Neon) rows to D1 (SQLite) format.
 *
 * Key differences:
 * - PG uses native booleans; D1 uses INTEGER (0/1)
 * - PG photos have "project_id" column but app uses "projectId" property
 *   (the Neon SQL used SELECT * which returns snake_case column names)
 */

// -- PostgreSQL row shapes (as returned by Neon) --

export interface PgProject {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  isPublished: boolean
}

export interface PgPhoto {
  id: string
  desktop_blob: string
  mobile_blob: string
  gallery_blob: string
  sequence: number
  caption: string | null
  project_id: string
}

// -- D1 row shapes (SQLite) --

export interface D1Project {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  isPublished: number // 0 or 1
}

export interface D1Photo {
  id: string
  desktop_blob: string
  mobile_blob: string
  gallery_blob: string
  sequence: number
  caption: string | null
  project_id: string
}

export function transformProject(pg: PgProject): D1Project {
  return {
    id: pg.id,
    title: pg.title,
    subtitle: pg.subtitle,
    description: pg.description,
    isPublished: pg.isPublished ? 1 : 0,
  }
}

export function transformPhoto(pg: PgPhoto): D1Photo {
  return {
    id: pg.id,
    desktop_blob: pg.desktop_blob,
    mobile_blob: pg.mobile_blob,
    gallery_blob: pg.gallery_blob,
    sequence: pg.sequence,
    caption: pg.caption,
    project_id: pg.project_id,
  }
}
