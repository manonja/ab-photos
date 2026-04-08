import {
  findAllExhibits,
  findAllNews,
  findAllNewsTags,
  findAllProjects,
  findNewsBySlug,
  findNewsByTag,
  findPhotoByProjectIdAndSeq,
  findPhotosByProjectId,
  findProjectBySlug,
} from '../operations'
import { mockNewsPosts, mockPhotos, mockProjects } from './mocks'

// Create mock D1 methods
const mockFirst = jest.fn()
const mockAll = jest.fn()
const mockBind = jest.fn(() => ({ all: mockAll, first: mockFirst }))
const mockPrepare = jest.fn(() => ({ bind: mockBind, all: mockAll, first: mockFirst }))

const mockDb = { prepare: mockPrepare } as unknown as D1Database

jest.mock('../client', () => ({
  getDb: () => mockDb,
}))

describe('Database Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findPhotosByProjectId', () => {
    it('should return photos for a given project ID', async () => {
      const projectId = 'nature'
      const expectedPhotos = mockPhotos.filter((p) => p.projectId === projectId)
      mockAll.mockResolvedValueOnce({ results: expectedPhotos })

      const result = await findPhotosByProjectId(projectId)

      expect(result).toEqual(expectedPhotos)
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('FROM photos'))
      expect(mockBind).toHaveBeenCalledWith(projectId)
    })
  })

  describe('findAllProjects', () => {
    it('should return all published projects', async () => {
      const publishedProjects = mockProjects
        .filter((p) => p.isPublished)
        .map((p) => ({ ...p, isPublished: 1 }))
      mockAll.mockResolvedValueOnce({ results: publishedProjects })

      const result = await findAllProjects()

      expect(result).toEqual(publishedProjects.map((p) => ({ ...p, isPublished: true })))
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('FROM projects'))
    })
  })

  describe('findProjectBySlug', () => {
    it('should return a project by slug', async () => {
      const slug = 'nature'
      const expectedProject = { ...mockProjects.find((p) => p.id === slug), isPublished: 1 }
      mockFirst.mockResolvedValueOnce(expectedProject)

      const result = await findProjectBySlug(slug)

      expect(result).toEqual({ ...expectedProject, isPublished: true })
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('FROM projects'))
      expect(mockBind).toHaveBeenCalledWith(slug)
    })

    it('should return null when project not found', async () => {
      mockFirst.mockResolvedValueOnce(null)

      const result = await findProjectBySlug('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('findPhotoByProjectIdAndSeq', () => {
    it('should return a photo by project ID and sequence', async () => {
      const projectId = 'nature'
      const sequence = 1
      const expectedPhoto = mockPhotos.find(
        (p) => p.projectId === projectId && p.sequence === sequence,
      )
      mockFirst.mockResolvedValueOnce(expectedPhoto)

      const result = await findPhotoByProjectIdAndSeq(projectId, sequence)

      expect(result).toEqual(expectedPhoto)
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('FROM photos'))
      expect(mockBind).toHaveBeenCalledWith(projectId, sequence)
    })

    it('should return null when photo not found', async () => {
      mockFirst.mockResolvedValueOnce(null)

      const result = await findPhotoByProjectIdAndSeq('nature', 999)

      expect(result).toBeNull()
    })
  })

  describe('findAllExhibits', () => {
    it('should return exhibits with boolean conversion', async () => {
      const dbExhibits = [{ id: 'exhibit-1', title: 'Test', isActive: 1, isUpcoming: 0 }]
      mockAll.mockResolvedValueOnce({ results: dbExhibits })

      const result = await findAllExhibits()

      expect(result[0].isActive).toBe(true)
      expect(result[0].isUpcoming).toBe(false)
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('FROM exhibits'))
    })
  })

  describe('findAllNews', () => {
    it('should return only published news sorted by date DESC with boolean and JSON parsing', async () => {
      const publishedPosts = mockNewsPosts.filter((p) => p.published === 1)
      mockAll.mockResolvedValueOnce({ results: publishedPosts })

      const result = await findAllNews()

      expect(result).toHaveLength(2)
      expect(result[0].published).toBe(true)
      expect(result[0].tags).toEqual(expect.arrayContaining(['photography']))
      expect(Array.isArray(result[0].tags)).toBe(true)
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('FROM news'))
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('published = 1'))
    })
  })

  describe('findNewsBySlug', () => {
    it('should return a news post by slug with boolean and JSON parsing', async () => {
      const post = mockNewsPosts[0]
      mockFirst.mockResolvedValueOnce(post)

      const result = await findNewsBySlug('first-post')

      expect(result).not.toBeNull()
      expect(result!.id).toBe('first-post')
      expect(result!.published).toBe(true)
      expect(result!.tags).toEqual(['photography', 'travel'])
      expect(mockBind).toHaveBeenCalledWith('first-post')
    })

    it('should return null when news post not found', async () => {
      mockFirst.mockResolvedValueOnce(null)

      const result = await findNewsBySlug('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('findNewsByTag', () => {
    it('should return news posts matching the tag', async () => {
      const publishedPosts = mockNewsPosts.filter((p) => p.published === 1)
      mockAll.mockResolvedValueOnce({ results: publishedPosts })

      const result = await findNewsByTag('travel')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('first-post')
    })

    it('should return empty array for non-existent tag', async () => {
      const publishedPosts = mockNewsPosts.filter((p) => p.published === 1)
      mockAll.mockResolvedValueOnce({ results: publishedPosts })

      const result = await findNewsByTag('nonexistent')

      expect(result).toEqual([])
    })
  })

  describe('findAllNewsTags', () => {
    it('should return deduplicated sorted tags from all published posts', async () => {
      const publishedPosts = mockNewsPosts.filter((p) => p.published === 1)
      mockAll.mockResolvedValueOnce({ results: publishedPosts })

      const result = await findAllNewsTags()

      expect(result).toEqual(['photography', 'travel'])
    })
  })
})
