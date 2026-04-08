import { findAllNews } from '@/db/operations'
import { GET } from '../route'

const mockNewsPosts = [
  {
    id: 'sunsetting-64-megatons-artist-feature-der-greif',
    title: 'Sunsetting 64 Megatons - Artist Feature on Der Greif',
    date: '2026-02-20',
    author: 'Anton Bossenbroek',
    excerpt: 'Artist Feature on Der Greif...',
    featuredImage: null,
    tags: ['exhibition', 'der-greif'],
    published: true,
    layout: 'single',
    content: '',
  },
  {
    id: 'notes-from-the-field',
    title: 'Notes from the field',
    date: '2025-09-03',
    author: 'Guest Post - Manon Jacquin',
    excerpt: 'A glimpse into the first few days...',
    featuredImage: null,
    tags: [],
    published: true,
    layout: 'two-column',
    content: '',
  },
]

jest.mock('@/db/operations', () => ({
  findAllNews: jest.fn(),
}))

const mockedFindAllNews = findAllNews as jest.MockedFunction<typeof findAllNews>

describe('GET /api/news', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 with array of news posts on success', async () => {
    mockedFindAllNews.mockResolvedValue(mockNewsPosts)

    const response = await GET()

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual(mockNewsPosts)
    expect(data).toHaveLength(2)
  })

  it('returns 500 on database error', async () => {
    const error = new Error('Database error') as Error & { code: string }
    error.code = 'D1_ERROR'
    mockedFindAllNews.mockRejectedValue(error)

    const response = await GET()

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toEqual({ error: 'Failed to fetch news', code: 'D1_ERROR' })
  })
})
