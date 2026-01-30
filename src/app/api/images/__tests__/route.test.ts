import { getImage } from '@/db/r2-operations'

jest.mock('@/db/r2-operations', () => ({
  getImage: jest.fn(),
}))

const mockedGetImage = getImage as jest.MockedFunction<typeof getImage>

// Import after mocking
import { GET } from '../[...key]/route'

describe('GET /api/images/[...key]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 with image body and correct content-type', async () => {
    const mockObject = {
      body: 'image-binary-data',
      httpMetadata: { contentType: 'image/jpeg' },
      httpEtag: '"abc123"',
    } as unknown as R2ObjectBody
    mockedGetImage.mockResolvedValue(mockObject)

    const response = await GET(new Request('http://test.com/api/images/industry/photo.jpg'), {
      params: Promise.resolve({ key: ['industry', 'photo.jpg'] }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('image/jpeg')
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=31536000, immutable',
    )
    expect(response.headers.get('etag')).toBe('"abc123"')
    expect(mockedGetImage).toHaveBeenCalledWith('industry/photo.jpg')
  })

  it('returns 404 when image not found', async () => {
    mockedGetImage.mockResolvedValue(null)

    const response = await GET(new Request('http://test.com/api/images/nonexistent.jpg'), {
      params: Promise.resolve({ key: ['nonexistent.jpg'] }),
    })

    expect(response.status).toBe(404)
  })

  it('returns 400 when no key provided', async () => {
    const response = await GET(new Request('http://test.com/api/images/'), {
      params: Promise.resolve({ key: [] }),
    })

    expect(response.status).toBe(400)
  })

  it('defaults content-type to application/octet-stream', async () => {
    const mockObject = {
      body: 'binary-data',
      httpMetadata: {},
      httpEtag: '"def456"',
    } as unknown as R2ObjectBody
    mockedGetImage.mockResolvedValue(mockObject)

    const response = await GET(new Request('http://test.com/api/images/file.bin'), {
      params: Promise.resolve({ key: ['file.bin'] }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/octet-stream')
  })
})
