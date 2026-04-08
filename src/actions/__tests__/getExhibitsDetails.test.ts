import type { Exhibit } from '@/types/exhibit'

const MOCK_EXHIBITS: Exhibit[] = [
  {
    id: 'exhibit-1',
    title: 'AFMP 2024-25 Exhibition',
    date: 'July 5 – August 17, 2025',
    location: '103-555 Prometheus Pl, Bowen Island, BC, Canada',
    description: 'Inaugural group exhibition',
    featuredImage: '/images/exhibits/Fotofilmic-FullResolution.jpg',
    startDate: '2025-07-05',
    endDate: '2025-08-17',
    isActive: false,
    link: 'https://fotofilmic.com/afmp-exhibition-2024-2025/',
    isUpcoming: false,
  },
  {
    id: 'exhibit-2',
    title: 'CRITICAL EYE',
    date: 'Sept. 6 – Sept 21, 2025',
    location: 'Hin Bus Depot, Kuala Lumpur, Malaysia',
    description: 'Finalists of the Critical Eye Photography Awards 2025',
    featuredImage: '/images/exhibits/exhibit_2.jpeg',
    startDate: '2025-09-06',
    endDate: '2025-09-21',
    isActive: false,
    link: 'https://www.klphotoawards.com/home-2023',
    isUpcoming: false,
  },
]

describe('getExhibitsDetails', () => {
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

  it('should return exhibits from DB when Cloudflare context is available', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => ({
        env: { DB: {} },
      }),
    }))

    jest.doMock('@/db/operations', () => ({
      findAllExhibits: jest.fn().mockResolvedValue(MOCK_EXHIBITS),
    }))

    const { getExhibitsDetails } = await import('../getExhibitsDetails')
    const result = await getExhibitsDetails()

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0].title).toBe('AFMP 2024-25 Exhibition')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should fall back to HTTP /api/exhibitions when DB throws', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available at build time')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findAllExhibits: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_EXHIBITS,
    })

    const { getExhibitsDetails } = await import('../getExhibitsDetails')
    const result = await getExhibitsDetails()

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0].id).toBe('exhibit-1')
    expect(mockFetch).toHaveBeenCalled()
  })

  it('should return static fallback when both DB and HTTP fail', async () => {
    jest.doMock('@opennextjs/cloudflare', () => ({
      getCloudflareContext: () => {
        throw new Error('D1 not available')
      },
    }))

    jest.doMock('@/db/operations', () => ({
      findAllExhibits: jest.fn().mockRejectedValue(new Error('DB unavailable')),
    }))

    mockFetch.mockRejectedValue(new Error('Network error'))

    const { getExhibitsDetails } = await import('../getExhibitsDetails')
    const result = await getExhibitsDetails()

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].id).toBe('exhibit-1')
    expect(result[0].title).toBe('AFMP 2024-25 Exhibition')
  })
})
