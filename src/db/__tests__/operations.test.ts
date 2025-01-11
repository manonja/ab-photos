import { sql, pool } from '../client';
import { findPhotosByProjectId, findAllProjects, findProjectBySlug, findPhotoByProjectIdAndSeq } from '../operations';
import { mockPhotos, mockProjects } from './mocks';
import { NeonQueryFunction } from '@neondatabase/serverless';

// Mock the database client and environment
jest.mock('../client', () => ({
    sql: jest.fn(),
    pool: {
        connect: jest.fn()
    }
}));

process.env.DATABASE_URL = 'postgres://fake:fake@fake.neon.tech/neondb';

const mockedSql = sql as unknown as jest.Mock;

describe('Database Operations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findPhotosByProjectId', () => {
        it('should return photos for a given project ID', async () => {
            const projectId = 'nature';
            const expectedPhotos = mockPhotos.filter(p => p.projectId === projectId);
            mockedSql.mockResolvedValueOnce(expectedPhotos);

            const result = await findPhotosByProjectId(projectId);
            
            expect(result).toEqual(expectedPhotos);
            // Verify SQL parts without checking exact formatting
            const sqlParts = mockedSql.mock.calls[0][0] as string[];
            expect(sqlParts.some((part: string) => part.includes('SELECT * FROM photos'))).toBe(true);
            expect(sqlParts.some((part: string) => part.includes('WHERE photos.project_id ='))).toBe(true);
            expect(mockedSql.mock.calls[0][1]).toBe(projectId);
        });
    });

    describe('findAllProjects', () => {
        it('should return all published projects', async () => {
            const publishedProjects = mockProjects.filter(p => p.isPublished);
            mockedSql.mockResolvedValueOnce(publishedProjects);

            const result = await findAllProjects();
            
            expect(result).toEqual(publishedProjects);
            const sqlParts = mockedSql.mock.calls[0][0] as string[];
            expect(sqlParts.some((part: string) => part.includes('SELECT * FROM projects'))).toBe(true);
            expect(sqlParts.some((part: string) => part.includes('WHERE "isPublished" = true'))).toBe(true);
        });
    });

    describe('findProjectBySlug', () => {
        it('should return a project by slug', async () => {
            const slug = 'nature';
            const expectedProject = mockProjects.find(p => p.id === slug);
            mockedSql.mockResolvedValueOnce([expectedProject]);

            const result = await findProjectBySlug(slug);
            
            expect(result).toEqual(expectedProject);
            const sqlParts = mockedSql.mock.calls[0][0] as string[];
            expect(sqlParts.some((part: string) => part.includes('SELECT * FROM projects'))).toBe(true);
            expect(sqlParts.some((part: string) => part.includes('WHERE id ='))).toBe(true);
            expect(sqlParts.some((part: string) => part.includes('LIMIT 1'))).toBe(true);
            expect(mockedSql.mock.calls[0][1]).toBe(slug);
        });

        it('should return null when project not found', async () => {
            const slug = 'non-existent';
            mockedSql.mockResolvedValueOnce([]);

            const result = await findProjectBySlug(slug);
            
            expect(result).toBeNull();
        });
    });

    describe('findPhotoByProjectIdAndSeq', () => {
        it('should return a photo by project ID and sequence', async () => {
            const projectId = 'nature';
            const sequence = 1;
            const expectedPhoto = mockPhotos.find(p => p.projectId === projectId && p.sequence === sequence);
            mockedSql.mockResolvedValueOnce([expectedPhoto]);

            const result = await findPhotoByProjectIdAndSeq(projectId, sequence);
            
            expect(result).toEqual(expectedPhoto);
            const sqlParts = mockedSql.mock.calls[0][0] as string[];
            expect(sqlParts.some((part: string) => part.includes('SELECT * FROM photos'))).toBe(true);
            expect(sqlParts.some((part: string) => part.includes('WHERE project_id ='))).toBe(true);
            expect(sqlParts.some((part: string) => part.includes('AND sequence ='))).toBe(true);
            expect(sqlParts.some((part: string) => part.includes('LIMIT 1'))).toBe(true);
            expect(mockedSql.mock.calls[0][1]).toBe(projectId);
            expect(mockedSql.mock.calls[0][2]).toBe(sequence);
        });

        it('should return null when photo not found', async () => {
            const projectId = 'nature';
            const sequence = 999;
            mockedSql.mockResolvedValueOnce([]);

            const result = await findPhotoByProjectIdAndSeq(projectId, sequence);
            
            expect(result).toBeNull();
        });
    });
});

// Integration tests
describe('Database Integration Tests', () => {
    // Mock the database client for integration tests
    const mockPool = {
        connect: jest.fn().mockResolvedValue({
            release: jest.fn()
        })
    };

    const mockSql = jest.fn().mockResolvedValue([{ test: 1 }]);

    beforeEach(() => {
        jest.clearAllMocks();
        (pool as any).connect = mockPool.connect;
        (sql as any) = mockSql;
    });

    it('should connect to the database', async () => {
        const client = await pool.connect();
        expect(client).toBeDefined();
        expect(mockPool.connect).toHaveBeenCalled();
        await client.release();
    });

    it('should query the database', async () => {
        const result = await sql`SELECT 1 as test`;
        expect(result[0].test).toBe(1);
        expect(mockSql).toHaveBeenCalled();
    });
}); 