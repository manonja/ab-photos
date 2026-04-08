import { findAllExhibits } from '@/db/operations'
import type { Exhibit } from '@/types/exhibit'

jest.mock('@/db/operations', () => ({
  findAllExhibits: jest.fn(),
}))

const mockedFindAllExhibits = findAllExhibits as jest.MockedFunction<typeof findAllExhibits>

// Import after mocking
import { GET } from '../route'

const MOCK_EXHIBITS: Exhibit[] = [
  {
    id: 'exhibit-1',
    title: 'Test Exhibition',
    date: 'July 5 – August 17, 2025',
    location: 'Test Location',
    description: 'Test description',
    featuredImage: '/images/exhibits/test.jpg',
    startDate: '2025-07-05',
    endDate: '2025-08-17',
    isActive: false,
    link: 'https://example.com',
    isUpcoming: false,
  },
]

describe('GET /api/exhibitions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 with array of exhibits on success', async () => {
    mockedFindAllExhibits.mockResolvedValue(MOCK_EXHIBITS)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(MOCK_EXHIBITS)
    expect(mockedFindAllExhibits).toHaveBeenCalledTimes(1)
  })

  it('returns 500 on database error', async () => {
    const dbError = new Error('Database connection failed')
    ;(dbError as unknown as { code: string }).code = 'CONNECTION_ERROR'
    mockedFindAllExhibits.mockRejectedValue(dbError)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      error: 'Failed to fetch exhibits',
      code: 'CONNECTION_ERROR',
    })
  })
})
