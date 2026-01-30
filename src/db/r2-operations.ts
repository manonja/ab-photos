import { getR2 } from './r2-client'

export async function getImage(key: string): Promise<R2ObjectBody | null> {
  const bucket = getR2()
  return bucket.get(key)
}

export async function putImage(
  key: string,
  body: ReadableStream | ArrayBuffer,
  contentType: string,
): Promise<R2Object> {
  const bucket = getR2()
  return bucket.put(key, body, {
    httpMetadata: { contentType },
  })
}

export async function deleteImage(key: string): Promise<void> {
  const bucket = getR2()
  await bucket.delete(key)
}

export async function listImages(prefix?: string): Promise<R2Objects> {
  const bucket = getR2()
  return bucket.list({ prefix })
}
