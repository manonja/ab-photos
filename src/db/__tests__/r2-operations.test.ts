const mockGet = jest.fn()
const mockPut = jest.fn()
const mockDelete = jest.fn()
const mockList = jest.fn()

const mockR2Bucket = {
  get: mockGet,
  put: mockPut,
  delete: mockDelete,
  list: mockList,
} as unknown as R2Bucket

jest.mock('../r2-client', () => ({
  getR2: () => mockR2Bucket,
}))

import { deleteImage, getImage, listImages, putImage } from '../r2-operations'

describe('R2 Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getImage', () => {
    it('returns R2ObjectBody when image is found', async () => {
      const mockObject = {
        body: 'image-stream',
        httpMetadata: { contentType: 'image/jpeg' },
        httpEtag: '"abc123"',
      }
      mockGet.mockResolvedValue(mockObject)

      const result = await getImage('industry/photo.jpg')

      expect(mockGet).toHaveBeenCalledWith('industry/photo.jpg')
      expect(result).toBe(mockObject)
    })

    it('returns null when image is not found', async () => {
      mockGet.mockResolvedValue(null)

      const result = await getImage('nonexistent.jpg')

      expect(mockGet).toHaveBeenCalledWith('nonexistent.jpg')
      expect(result).toBeNull()
    })
  })

  describe('putImage', () => {
    it('stores image with correct metadata', async () => {
      const mockResult = { key: 'photos/new.jpg' }
      mockPut.mockResolvedValue(mockResult)
      const body = new ArrayBuffer(8)

      const result = await putImage('photos/new.jpg', body, 'image/jpeg')

      expect(mockPut).toHaveBeenCalledWith('photos/new.jpg', body, {
        httpMetadata: { contentType: 'image/jpeg' },
      })
      expect(result).toBe(mockResult)
    })
  })

  describe('deleteImage', () => {
    it('removes the object by key', async () => {
      mockDelete.mockResolvedValue(undefined)

      await deleteImage('photos/old.jpg')

      expect(mockDelete).toHaveBeenCalledWith('photos/old.jpg')
    })
  })

  describe('listImages', () => {
    it('returns matching keys with prefix', async () => {
      const mockObjects = {
        objects: [{ key: 'industry/a.jpg' }, { key: 'industry/b.jpg' }],
        truncated: false,
      }
      mockList.mockResolvedValue(mockObjects)

      const result = await listImages('industry/')

      expect(mockList).toHaveBeenCalledWith({ prefix: 'industry/' })
      expect(result).toBe(mockObjects)
    })

    it('lists all images when no prefix given', async () => {
      const mockObjects = { objects: [], truncated: false }
      mockList.mockResolvedValue(mockObjects)

      const result = await listImages()

      expect(mockList).toHaveBeenCalledWith({ prefix: undefined })
      expect(result).toBe(mockObjects)
    })
  })
})
