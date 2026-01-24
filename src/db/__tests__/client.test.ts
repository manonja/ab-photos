import { beforeAll, describe, expect, it, jest } from '@jest/globals'

// Create mock functions
const mockNeon = jest.fn()
const mockPool = jest.fn(() => ({
  on: jest.fn(),
}))

// Mock @neondatabase/serverless
jest.mock('@neondatabase/serverless', () => ({
  neon: mockNeon,
  Pool: mockPool,
}))

describe('Database Client', () => {
  // Store original environment
  const originalEnv = process.env

  beforeAll(() => {
    // Clear module cache before all tests
    jest.resetModules()
  })

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {})
    // Reset process.env
    process.env = { ...originalEnv }
    // Clear module cache before each test
    jest.resetModules()
  })

  afterEach(() => {
    // Restore process.env
    process.env = originalEnv
    // Clear console mock
    jest.restoreAllMocks()
  })

  describe('getDatabaseUrl', () => {
    it('should throw error with console.error when DATABASE_URL is not set', async () => {
      // Delete DATABASE_URL from environment
      delete process.env.DATABASE_URL

      // Import the module (this needs to be done after environment setup)
      await expect(import('../client')).rejects.toThrow('DATABASE_URL is not set')
      expect(console.error).toHaveBeenCalledWith(
        '[Database Error] DATABASE_URL environment variable is not set. Please check your .env file.',
      )
    })

    it('should create clients successfully when DATABASE_URL is set', async () => {
      // Set a mock DATABASE_URL
      process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/testdb'

      // Import the module
      await import('../client')

      // Verify neon was called
      expect(mockNeon).toHaveBeenCalled()
      // Verify Pool was created with correct config
      expect(mockPool).toHaveBeenCalledWith({
        connectionString: 'postgres://test:test@localhost:5432/testdb',
        max: 10,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 60000,
      })
    })
  })

  describe('SQL Client Creation', () => {
    it('should handle neon client creation error', async () => {
      process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/testdb'
      const mockError = new Error('Connection failed')

      // Mock neon to throw error
      mockNeon.mockImplementationOnce(() => {
        throw mockError
      })

      // Import should throw
      await expect(import('../client')).rejects.toThrow('Connection failed')

      // Verify error was logged
      expect(console.error).toHaveBeenCalledWith(
        '[Database Error] Failed to create SQL client:',
        expect.objectContaining({
          error: 'Connection failed',
          timestamp: expect.any(String),
        }),
      )
    })
  })

  describe('Pool Creation', () => {
    it('should handle pool creation error', async () => {
      process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/testdb'
      const mockError = new Error('Pool creation failed')

      // Mock Pool to throw error
      mockPool.mockImplementationOnce(() => {
        throw mockError
      })

      // Import should throw
      await expect(import('../client')).rejects.toThrow('Pool creation failed')

      // Verify error was logged with config
      expect(console.error).toHaveBeenCalledWith(
        '[Database Error] Failed to create connection pool:',
        expect.objectContaining({
          error: 'Pool creation failed',
          timestamp: expect.any(String),
          config: {
            max: 10,
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 60000,
          },
        }),
      )
    })
  })
})
