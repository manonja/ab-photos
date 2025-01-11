import { findPhotosByProjectId, findAllProjects, findProjectBySlug, findPhotoByProjectIdAndSeq } from '../operations';
import { mockPhotos, mockProjects, setupDatabaseMocks, clearDatabaseMocks } from './mocks';

// Setup database mocks before any tests run
setupDatabaseMocks();

describe('Database Operations', () => {
    beforeEach(() => {
        clearDatabaseMocks();
        jest.resetModules();
    });

    describe('findPhotosByProjectId', () => {
        it('should return photos for a given project ID', async () => {
            const projectId = 'nature';
            const expectedPhotos = mockPhotos.filter(p => p.projectId === projectId);
            const { sql } = setupDatabaseMocks();
            (sql as jest.Mock).mockResolvedValueOnce(expectedPhotos);

            const result = await findPhotosByProjectId(projectId);
            
            expect(result).toEqual(expectedPhotos);
            expect(sql).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                projectId
            );
        });
    });

    describe('findAllProjects', () => {
        it('should return all published projects', async () => {
            const publishedProjects = mockProjects.filter(p => p.isPublished);
            const { sql } = setupDatabaseMocks();
            (sql as jest.Mock).mockResolvedValueOnce(publishedProjects);

            const result = await findAllProjects();
            
            expect(result).toEqual(publishedProjects);
            expect(sql).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM projects')
            );
        });
    });

    describe('findProjectBySlug', () => {
        it('should return a project by slug', async () => {
            const slug = 'nature';
            const expectedProject = mockProjects.find(p => p.slug === slug);
            const { sql } = setupDatabaseMocks();
            (sql as jest.Mock).mockResolvedValueOnce([expectedProject]);

            const result = await findProjectBySlug(slug);
            
            expect(result).toEqual(expectedProject);
            expect(sql).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                slug
            );
        });

        it('should return null when project not found', async () => {
            const slug = 'non-existent';
            const { sql } = setupDatabaseMocks();
            (sql as jest.Mock).mockResolvedValueOnce([]);

            const result = await findProjectBySlug(slug);
            
            expect(result).toBeNull();
        });
    });

    describe('findPhotoByProjectIdAndSeq', () => {
        it('should return a photo by project ID and sequence', async () => {
            const projectId = 'nature';
            const sequence = 1;
            const expectedPhoto = mockPhotos.find(p => p.projectId === projectId && p.sequence === sequence);
            const { sql } = setupDatabaseMocks();
            (sql as jest.Mock).mockResolvedValueOnce([expectedPhoto]);

            const result = await findPhotoByProjectIdAndSeq(projectId, sequence);
            
            expect(result).toEqual(expectedPhoto);
            expect(sql).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                projectId,
                sequence
            );
        });

        it('should return null when photo not found', async () => {
            const projectId = 'nature';
            const sequence = 999;
            const { sql } = setupDatabaseMocks();
            (sql as jest.Mock).mockResolvedValueOnce([]);

            const result = await findPhotoByProjectIdAndSeq(projectId, sequence);
            
            expect(result).toBeNull();
        });
    });
}); 