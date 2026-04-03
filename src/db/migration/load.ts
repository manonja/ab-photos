/**
 * Generate D1-compatible SQL INSERT statements from transformed rows.
 */
import type { D1Photo, D1Project } from './transform'

function escapeSql(value: string | null): string {
  if (value === null) return 'NULL'
  return `'${value.replace(/'/g, "''")}'`
}

export function generateProjectInsert(project: D1Project): string {
  return `INSERT OR REPLACE INTO projects (id, title, subtitle, description, isPublished) VALUES (${escapeSql(project.id)}, ${escapeSql(project.title)}, ${escapeSql(project.subtitle)}, ${escapeSql(project.description)}, ${project.isPublished});`
}

export function generatePhotoInsert(photo: D1Photo): string {
  return `INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES (${escapeSql(photo.id)}, ${escapeSql(photo.desktop_blob)}, ${escapeSql(photo.mobile_blob)}, ${escapeSql(photo.gallery_blob)}, ${photo.sequence}, ${escapeSql(photo.caption)}, ${escapeSql(photo.project_id)});`
}

export function generateMigrationSql(
  projects: D1Project[],
  photos: D1Photo[],
): string {
  const lines: string[] = [
    '-- Auto-generated migration data from Neon PostgreSQL',
    `-- Generated at: ${new Date().toISOString()}`,
    `-- Projects: ${projects.length}, Photos: ${photos.length}`,
    '',
    '-- Projects',
  ]

  for (const project of projects) {
    lines.push(generateProjectInsert(project))
  }

  lines.push('')
  lines.push('-- Photos')

  for (const photo of photos) {
    lines.push(generatePhotoInsert(photo))
  }

  lines.push('')
  return lines.join('\n')
}
