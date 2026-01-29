import { describe, expect, it, jest } from '@jest/globals'

// Mock @opennextjs/cloudflare
const mockDb = {} as D1Database

jest.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => ({
    env: { DB: mockDb },
  }),
}))

describe('Database Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  it('should return the D1 database binding', async () => {
    const { getDb } = await import('../client')
    const db = getDb()
    expect(db).toBe(mockDb)
  })
})
