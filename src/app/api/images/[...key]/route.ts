import { getImage } from '@/db/r2-operations'

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params

  if (!key || key.length === 0) {
    return new Response('Bad Request: missing image key', { status: 400 })
  }

  const imageKey = key.join('/')
  const object = await getImage(imageKey)

  if (!object) {
    return new Response('Not Found', { status: 404 })
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: object.httpEtag,
    },
  })
}
