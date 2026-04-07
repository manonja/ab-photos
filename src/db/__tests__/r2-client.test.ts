import { describe, expect, it, jest } from '@jest/globals'

// Mock R2Bucket
const mockR2Bucket = {} as R2Bucket

jest.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => ({
    env: { R2_IMAGES: mockR2Bucket },
  }),
}))

describe('R2 Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  it('should return the R2 bucket binding', async () => {
    const { getR2 } = await import('../r2-client')
    const bucket = getR2()
    expect(bucket).toBe(mockR2Bucket)
  })
})
