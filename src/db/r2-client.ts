import { getCloudflareContext } from '@opennextjs/cloudflare'

export function getR2(): R2Bucket {
  const { env } = getCloudflareContext()
  return env.R2_IMAGES
}
