/**
 * Extract data from Neon PostgreSQL.
 */
import { Client } from 'pg'
import type { PgPhoto, PgProject } from './transform'

export async function extractProjects(connectionString: string): Promise<PgProject[]> {
  const client = new Client({ connectionString })
  try {
    await client.connect()
    console.log('[Migration] extractProjects: Connected to Neon')
    const result = await client.query('SELECT id, title, subtitle, description, "isPublished" FROM projects')
    console.log('[Migration] extractProjects: Fetched', { count: result.rows.length })
    return result.rows as PgProject[]
  } finally {
    await client.end()
  }
}

export async function extractPhotos(connectionString: string): Promise<PgPhoto[]> {
  const client = new Client({ connectionString })
  try {
    await client.connect()
    console.log('[Migration] extractPhotos: Connected to Neon')
    const result = await client.query('SELECT id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id FROM photos')
    console.log('[Migration] extractPhotos: Fetched', { count: result.rows.length })
    return result.rows as PgPhoto[]
  } finally {
    await client.end()
  }
}
