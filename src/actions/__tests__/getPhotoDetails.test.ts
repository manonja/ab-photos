import type { Photo } from '@/types/database'

const MOCK_PHOTO: Photo = {
  id: '87eeba57-e334-4159-9858-53ba8f234719',
  desktop_blob: 'https://assets.bossenbroek.photo/7rad/fullscreen/sample.jpg',
  mobile_blob: '',
  gallery_blob: '',
  sequence: 2,
  caption: '7 Rad',
  projectId: '7-rad',
}

const MOCK_PHOTOS: Photo[] = [
  MOCK_PHOTO,
  {
    ...MOCK_PHOTO,
    id: 'second-photo-id',
    sequence: 3,
    desktop_blob: 'https://assets.bossenbroek.photo/7rad/fullscreen/sample2.jpg',
  },
]

describe('getPhotoDetails', () => {
  let originalFetch: typeof global.fetch
  let mockFetch: jest.Mock

  beforeEach(() => {
    jest.resetModules()
    originalFetch = global.fetch
    mockFetch = jest.fn()
    global.fetch = mockFetch
    process.env.NEXT_PUBLIC_API_URL = 'https://bossenbroek.photo'
  })

  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('should use direct DB access when Cloudflare context is available', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: { DB: {} },
      }),
    }))

    jest.doMock('@/db/operations', () => ({
      findPhotoByProjectIdAndSeq: jest.fn().mockResolvedValue(MOCK_PHOTO),
      findPhotosByProjectId: jest.fn(),
    }))

    const { getPhotoDetails } = await import('../getPhotoDetails')
    const result = await getPhotoDetails('7-rad', 2)

    const photo = result as Photo
    expect(photo.desktop_blob).toMatch(/^https:\/\//)
    expect(photo.desktop_blob).not.toMatch(/^data:/)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should return photo array via direct DB when no sequence given', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: { DB: {} },
      }),
    }))

    jest.doMock('@/db/operations', () => ({
      findPhotosByProjectId: jest.fn().mockResolvedValue(MOCK_PHOTOS),
      findPhotoByProjectIdAndSeq: jest.fn(),
    }))

    const { getPhotoDetails } = await import('../getPhotoDetails')
    const result = await getPhotoDetails('7-rad')

    const photos = result as Photo[]
    expect(Array.isArray(photos)).toBe(true)
    expect(photos.length).toBe(2)
    expect(photos[0].desktop_blob).toMatch(/^https:\/\//)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should fall back to HTTP fetch when DB access fails', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available at build time')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findPhotoByProjectIdAndSeq: jest.fn().mockRejectedValue(new Error('DB unavailable')),
      findPhotosByProjectId: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_PHOTO,
    })

    const { getPhotoDetails } = await import('../getPhotoDetails')
    const result = await getPhotoDetails('7-rad', 2)

    const photo = result as Photo
    expect(photo.id).toBe(MOCK_PHOTO.id)
    expect(photo.desktop_blob).toMatch(/^https:\/\//)
    expect(mockFetch).toHaveBeenCalled()
  })

  it('should return fallback when both DB and HTTP fail', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findPhotoByProjectIdAndSeq: jest.fn().mockRejectedValue(new Error('DB unavailable')),
      findPhotosByProjectId: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockRejectedValue(new Error('Network error'))

    const { getPhotoDetails } = await import('../getPhotoDetails')
    const result = await getPhotoDetails('7-rad', 2)

    const photo = result as Photo
    expect(photo.id).toContain('fallback')
    expect(photo.desktop_blob).toMatch(/^data:/)
  })
})
