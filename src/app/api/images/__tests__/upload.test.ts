import { putImage } from '@/db/r2-operations'

jest.mock('@/db/r2-operations', () => ({
  putImage: jest.fn(),
}))

const mockedPutImage = putImage as jest.MockedFunction<typeof putImage>

import { POST } from '../route'

function createMockFile(name: string, type: string, size: number) {
  return {
    name,
    type,
    size,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(size)),
  }
}

function createMockRequest(options: {
  auth?: string
  file?: { name: string; type: string; size?: number }
  path?: string
  failFormData?: boolean
}) {
  const { auth, file, path, failFormData } = options

  const headers: Record<string, string> = {}
  if (auth) {
    headers.Authorization = auth
  }

  const request = new Request('http://test.com/api/images', {
    method: 'POST',
    headers,
  })

  if (failFormData) {
    request.formData = () => Promise.reject(new Error('No form data'))
  } else {
    const mockFile = file ? createMockFile(file.name, file.type, file.size ?? 100) : null
    const pathValue = path ?? null

    // Create a mock FormData that returns our mock file correctly
    request.formData = () =>
      Promise.resolve({
        get: (key: string) => {
          if (key === 'file') return mockFile
          if (key === 'path') return pathValue
          return null
        },
      } as unknown as FormData)
  }

  return request
}

describe('POST /api/images', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.IMAGE_UPLOAD_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    delete process.env.IMAGE_UPLOAD_API_KEY
  })

  it('returns 401 without auth header', async () => {
    const request = createMockRequest({})
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('returns 401 with invalid auth header', async () => {
    const request = createMockRequest({ auth: 'Bearer wrong-key' })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('returns 400 when no file provided', async () => {
    const request = createMockRequest({ auth: 'Bearer test-api-key' })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('returns 400 when form data is invalid', async () => {
    const request = createMockRequest({
      auth: 'Bearer test-api-key',
      failFormData: true,
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('uploads file to R2 and returns key and url', async () => {
    const mockResult = { key: 'uploads/photo.jpg' } as unknown as R2Object
    mockedPutImage.mockResolvedValue(mockResult)

    const request = createMockRequest({
      auth: 'Bearer test-api-key',
      file: { name: 'photo.jpg', type: 'image/jpeg', size: 1024 },
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.key).toBe('uploads/photo.jpg')
    expect(data.url).toBe('https://assets.bossenbroek.photo/uploads/photo.jpg')
    expect(mockedPutImage).toHaveBeenCalledWith(
      'uploads/photo.jpg',
      expect.any(ArrayBuffer),
      'image/jpeg',
    )
  })

  it('uploads file with custom key path', async () => {
    const mockResult = { key: 'industry/photo.jpg' } as unknown as R2Object
    mockedPutImage.mockResolvedValue(mockResult)

    const request = createMockRequest({
      auth: 'Bearer test-api-key',
      file: { name: 'photo.jpg', type: 'image/jpeg' },
      path: 'industry',
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.key).toBe('industry/photo.jpg')
    expect(data.url).toBe('https://assets.bossenbroek.photo/industry/photo.jpg')
  })

  it('returns 500 when IMAGE_UPLOAD_API_KEY is not configured', async () => {
    delete process.env.IMAGE_UPLOAD_API_KEY
    const request = createMockRequest({ auth: 'Bearer anything' })
    const response = await POST(request)
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Server misconfigured')
  })

  it('returns 413 when file exceeds 10MB', async () => {
    const mockResult = { key: 'uploads/huge.jpg' } as unknown as R2Object
    mockedPutImage.mockResolvedValue(mockResult)

    const request = createMockRequest({
      auth: 'Bearer test-api-key',
      file: { name: 'huge.jpg', type: 'image/jpeg', size: 11 * 1024 * 1024 },
    })
    const response = await POST(request)
    expect(response.status).toBe(413)
  })

  it('returns 400 when path contains invalid characters', async () => {
    const request = createMockRequest({
      auth: 'Bearer test-api-key',
      file: { name: 'photo.jpg', type: 'image/jpeg' },
      path: '../etc',
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('Invalid path')
  })

  it('defaults content type to application/octet-stream', async () => {
    const mockResult = { key: 'uploads/file.bin' } as unknown as R2Object
    mockedPutImage.mockResolvedValue(mockResult)

    const request = createMockRequest({
      auth: 'Bearer test-api-key',
      file: { name: 'file.bin', type: '' },
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mockedPutImage).toHaveBeenCalledWith(
      'uploads/file.bin',
      expect.any(ArrayBuffer),
      'application/octet-stream',
    )
  })
})
