#!/usr/bin/env node

/**
 * CLI script to migrate data from Neon PostgreSQL to Cloudflare D1.
 *
 * Usage:
 *   node scripts/migrate-neon-to-d1.js
 *
 * Reads DIRECT_URL from .env file, extracts data from Neon,
 * and writes D1-compatible SQL to src/db/migrate-data.sql.
 *
 * Then apply with:
 *   npx wrangler d1 execute ab-photos --remote --file=src/db/migrate-data.sql
 */

const fs = require('node:fs')
const path = require('node:path')
const { Client } = require('pg')

const ROOT = path.resolve(__dirname, '..')
const OUTPUT_FILE = path.join(ROOT, 'src', 'db', 'migrate-data.sql')

function loadEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found at', envPath)
    process.exit(1)
  }
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx)
    let value = trimmed.slice(eqIdx + 1)
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

function escapeSql(value) {
  if (value === null || value === undefined) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

async function main() {
  loadEnv()

  const connectionString = process.env.DIRECT_URL
  if (!connectionString) {
    console.error('Error: DIRECT_URL not found in .env')
    process.exit(1)
  }

  console.log('[Migration] Connecting to Neon PostgreSQL...')
  const client = new Client({ connectionString })
  await client.connect()

  try {
    // Extract projects
    const projectsResult = await client.query(
      'SELECT id, title, subtitle, description, "isPublished" FROM projects',
    )
    const projects = projectsResult.rows
    console.log(`[Migration] Extracted ${projects.length} projects`)

    // Extract photos
    const photosResult = await client.query(
      'SELECT id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id FROM photos',
    )
    const photos = photosResult.rows
    console.log(`[Migration] Extracted ${photos.length} photos`)

    // Generate SQL
    const lines = [
      '-- Auto-generated migration data from Neon PostgreSQL',
      `-- Generated at: ${new Date().toISOString()}`,
      `-- Projects: ${projects.length}, Photos: ${photos.length}`,
      '',
      '-- Projects',
    ]

    for (const p of projects) {
      const isPublished = p.isPublished ? 1 : 0
      lines.push(
        `INSERT OR REPLACE INTO projects (id, title, subtitle, description, isPublished) VALUES (${escapeSql(p.id)}, ${escapeSql(p.title)}, ${escapeSql(p.subtitle)}, ${escapeSql(p.description)}, ${isPublished});`,
      )
    }

    lines.push('')
    lines.push('-- Photos')

    for (const ph of photos) {
      lines.push(
        `INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES (${escapeSql(ph.id)}, ${escapeSql(ph.desktop_blob)}, ${escapeSql(ph.mobile_blob)}, ${escapeSql(ph.gallery_blob)}, ${ph.sequence}, ${escapeSql(ph.caption)}, ${escapeSql(ph.project_id)});`,
      )
    }

    lines.push('')
    const sql = lines.join('\n')

    fs.writeFileSync(OUTPUT_FILE, sql, 'utf-8')
    console.log(`[Migration] SQL written to ${OUTPUT_FILE}`)
    console.log('')
    console.log('Next steps:')
    console.log('  1. Review the generated SQL:  cat src/db/migrate-data.sql')
    console.log(
      '  2. Apply to D1:               npx wrangler d1 execute ab-photos --remote --file=src/db/migrate-data.sql',
    )
    console.log(
      '  3. Verify:                    npx wrangler d1 execute ab-photos --remote --command="SELECT count(*) FROM projects"',
    )
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('[Migration] Fatal error:', err.message)
  process.exit(1)
})
