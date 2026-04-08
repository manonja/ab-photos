import type { NewsPost } from '@/db/types'

const MOCK_NEWS_POST: NewsPost = {
  id: 'sunsetting-64-megatons-artist-feature-der-greif',
  title: 'Sunsetting 64 Megatons - Artist Feature on Der Greif',
  date: '2026-02-20',
  author: 'Anton Bossenbroek',
  excerpt: 'Artist Feature on Der Greif...',
  featuredImage: null,
  tags: ['exhibition', 'der-greif'],
  published: true,
  layout: 'single',
  content: '<p>Full content here</p>',
}

const MOCK_NEWS_POSTS: NewsPost[] = [
  MOCK_NEWS_POST,
  {
    id: 'notes-from-the-field',
    title: 'Notes from the field',
    date: '2025-09-03',
    author: 'Guest Post - Manon Jacquin',
    excerpt: 'A glimpse into the first few days...',
    featuredImage: null,
    tags: ['travel'],
    published: true,
    layout: 'two-column',
    content: '',
  },
]

describe('getAllNews', () => {
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

  it('returns posts from DB when Cloudflare context is available', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: { DB: {} },
      }),
    }))

    jest.doMock('@/db/operations', () => ({
      findAllNews: jest.fn().mockResolvedValue(MOCK_NEWS_POSTS),
    }))

    const { getAllNews } = await import('../getNewsDetails')
    const result = await getAllNews()

    expect(result).toEqual(MOCK_NEWS_POSTS)
    expect(result).toHaveLength(2)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('falls back to HTTP /api/news when DB throws', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available at build time')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findAllNews: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_NEWS_POSTS,
    })

    const { getAllNews } = await import('../getNewsDetails')
    const result = await getAllNews()

    expect(result).toEqual(MOCK_NEWS_POSTS)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://bossenbroek.photo/api/news',
      expect.objectContaining({ next: { revalidate: 3600 } }),
    )
  })

  it('returns static fallback when both DB and HTTP fail', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findAllNews: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockRejectedValue(new Error('Network error'))

    const { getAllNews } = await import('../getNewsDetails')
    const result = await getAllNews()

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].id).toBeDefined()
    expect(result[0].title).toBeDefined()
  })
})

describe('getNewsBySlug', () => {
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

  it('returns post from DB', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: { DB: {} },
      }),
    }))

    jest.doMock('@/db/operations', () => ({
      findNewsBySlug: jest.fn().mockResolvedValue(MOCK_NEWS_POST),
    }))

    const { getNewsBySlug } = await import('../getNewsDetails')
    const result = await getNewsBySlug('sunsetting-64-megatons-artist-feature-der-greif')

    expect(result).toEqual(MOCK_NEWS_POST)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('falls back to HTTP /api/news/:slug when DB throws', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available at build time')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findNewsBySlug: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_NEWS_POST,
    })

    const { getNewsBySlug } = await import('../getNewsDetails')
    const result = await getNewsBySlug('sunsetting-64-megatons-artist-feature-der-greif')

    expect(result).toEqual(MOCK_NEWS_POST)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://bossenbroek.photo/api/news/sunsetting-64-megatons-artist-feature-der-greif',
      expect.objectContaining({ next: { revalidate: 3600 } }),
    )
  })

  it('returns fallback post when both DB and HTTP fail for known slug', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findNewsBySlug: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockRejectedValue(new Error('Network error'))

    const { getNewsBySlug } = await import('../getNewsDetails')
    const result = await getNewsBySlug('sunsetting-64-megatons-artist-feature-der-greif')

    expect(result).not.toBeNull()
    expect(result?.id).toBe('sunsetting-64-megatons-artist-feature-der-greif')
  })

  it('returns null when both DB and HTTP fail for unknown slug', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findNewsBySlug: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockRejectedValue(new Error('Network error'))

    const { getNewsBySlug } = await import('../getNewsDetails')
    const result = await getNewsBySlug('nonexistent')

    expect(result).toBeNull()
  })
})

describe('getNewsByTag', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('returns posts filtered by tag', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: { DB: {} },
      }),
    }))

    jest.doMock('@/db/operations', () => ({
      findNewsByTag: jest.fn().mockResolvedValue([MOCK_NEWS_POST]),
    }))

    const { getNewsByTag } = await import('../getNewsDetails')
    const result = await getNewsByTag('exhibition')

    expect(result).toEqual([MOCK_NEWS_POST])
  })

  it('returns empty array on error', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findNewsByTag: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    const { getNewsByTag } = await import('../getNewsDetails')
    const result = await getNewsByTag('exhibition')

    expect(result).toEqual([])
  })
})

describe('getNewsTags', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('returns all unique tags', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: { DB: {} },
      }),
    }))

    jest.doMock('@/db/operations', () => ({
      findAllNewsTags: jest.fn().mockResolvedValue(['der-greif', 'exhibition', 'travel']),
    }))

    const { getNewsTags } = await import('../getNewsDetails')
    const result = await getNewsTags()

    expect(result).toEqual(['der-greif', 'exhibition', 'travel'])
  })

  it('returns empty array on error', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findAllNewsTags: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    const { getNewsTags } = await import('../getNewsDetails')
    const result = await getNewsTags()

    expect(result).toEqual([])
  })
})
