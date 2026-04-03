import { putImage } from '@/db/r2-operations'

export const runtime = 'edge'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const VALID_PATH_PATTERN = /^[a-zA-Z0-9_-]+$/

export async function POST(request: Request) {
  const apiKey = process.env.IMAGE_UPLOAD_API_KEY
  if (!apiKey) {
    console.error('[API] POST /api/images: IMAGE_UPLOAD_API_KEY is not configured')
    return Response.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const authHeader = request.headers.get('Authorization')
  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || typeof file === 'string' || file.size === 0) {
    return Response.json({ error: 'Missing file' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` },
      { status: 413 },
    )
  }

  const path = formData.get('path') as string | null
  if (path && !VALID_PATH_PATTERN.test(path)) {
    return Response.json(
      { error: 'Invalid path: only alphanumeric, hyphens, and underscores allowed' },
      { status: 400 },
    )
  }

  const filename = file.name
  const key = path ? `${path}/${filename}` : `uploads/${filename}`
  const contentType = file.type || 'application/octet-stream'

  const body = await file.arrayBuffer()
  await putImage(key, body, contentType)

  return Response.json({
    key,
    url: `https://assets.bossenbroek.photo/${key}`,
  })
}
