import type { Plugin } from 'payload'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { r2Storage } from '@payloadcms/storage-r2'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users/index.ts'
import { Media } from './collections/Media/index.ts'
import { Projects } from './collections/Projects/index.ts'
import { Posts } from './collections/Posts/index.ts'
import { Exhibits } from './collections/Exhibits/index.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Only enable R2 storage when credentials are configured
const plugins: Plugin[] = []
if (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_ENDPOINT) {
  plugins.push(
    r2Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET || 'ab-photos-media',
      config: {
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
        region: 'auto',
      },
    }),
  )
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [
    'http://localhost:3000',
    'https://bossenbroek.photo',
    'https://ab-photo.pages.dev',
  ],
  csrf: [
    'http://localhost:3000',
    'https://bossenbroek.photo',
    'https://ab-photo.pages.dev',
  ],
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- AB Photos Admin',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Projects, Posts, Exhibits],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'YOUR-SECRET-KEY',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Uses file-based SQLite for local dev.
  // For production D1, see docs/payload-integration-plan.md
  db: sqliteAdapter({
    client: {
      url: process.env.PAYLOAD_DATABASE_URL || 'file:./payload.db',
    },
  }),
  sharp,
  plugins,
})
