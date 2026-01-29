import {
  findAllExhibits,
  findAllProjects,
  findPhotoByProjectIdAndSeq,
  findPhotosByProjectId,
  findProjectBySlug,
} from '../operations'
import { mockPhotos, mockProjects } from './mocks'

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
})
