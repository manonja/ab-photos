import { putImage } from '@/db/r2-operations'

export const runtime = 'edge'

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const apiKey = process.env.IMAGE_UPLOAD_API_KEY

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

  const path = formData.get('path') as string | null
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
