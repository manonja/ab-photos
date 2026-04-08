import { findNewsBySlug } from '@/db/operations'
import { GET } from '../route'

const mockNewsPost = {
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

jest.mock('@/db/operations', () => ({
  findNewsBySlug: jest.fn(),
}))

const mockedFindNewsBySlug = findNewsBySlug as jest.MockedFunction<typeof findNewsBySlug>

describe('GET /api/news/[slug]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 with single news post', async () => {
    mockedFindNewsBySlug.mockResolvedValue(mockNewsPost)

    const response = await GET(new Request('http://test.com'), {
      params: { slug: 'sunsetting-64-megatons-artist-feature-der-greif' },
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual(mockNewsPost)
    expect(mockedFindNewsBySlug).toHaveBeenCalledWith(
      'sunsetting-64-megatons-artist-feature-der-greif',
    )
  })

  it('returns 404 when not found', async () => {
    mockedFindNewsBySlug.mockResolvedValue(null)

    const response = await GET(new Request('http://test.com'), {
      params: { slug: 'nonexistent-post' },
    })

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data).toEqual({ error: 'News post not found' })
  })

  it('returns 500 on database error', async () => {
    const error = new Error('Database error') as Error & { code: string }
    error.code = 'D1_ERROR'
    mockedFindNewsBySlug.mockRejectedValue(error)

    const response = await GET(new Request('http://test.com'), {
      params: { slug: 'some-post' },
    })

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: 'Failed to fetch news post', code: 'D1_ERROR' })
  })
})
