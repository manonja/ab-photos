/**
 * Migration orchestrator: extract from Neon → transform → generate D1 SQL.
 */
import { extractPhotos, extractProjects } from './extract'
import { generateMigrationSql } from './load'
import { transformPhoto, transformProject } from './transform'

export async function migrate(connectionString: string): Promise<string> {
  console.log('[Migration] Starting Neon → D1 migration')

  const pgProjects = await extractProjects(connectionString)
  const pgPhotos = await extractPhotos(connectionString)

  console.log('[Migration] Transforming data', {
    projects: pgProjects.length,
    photos: pgPhotos.length,
  })

  const d1Projects = pgProjects.map(transformProject)
  const d1Photos = pgPhotos.map(transformPhoto)

  const sql = generateMigrationSql(d1Projects, d1Photos)

  console.log('[Migration] SQL generated', { sqlLength: sql.length })
  return sql
}

export { extractPhotos, extractProjects } from './extract'
export { generateMigrationSql, generatePhotoInsert, generateProjectInsert } from './load'
export { transformPhoto, transformProject } from './transform'
export type { D1Photo, D1Project, PgPhoto, PgProject } from './transform'
