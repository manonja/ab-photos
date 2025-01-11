import { GET } from '../route';
import { mockPhotos, setupDatabaseMocks } from '@/db/__tests__/mocks';

describe('Featured Photos API', () => {
    beforeEach(() => {
        const { sql } = setupDatabaseMocks();
        // Reset mocks before each test
        sql.mockReset();
    });

    it('returns featured photos successfully', async () => {
        const { sql } = setupDatabaseMocks();
        sql.mockResolvedValueOnce(mockPhotos);

        const response = await GET();
        expect(response).toBeDefined();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockPhotos);
    });

    it('handles database errors', async () => {
        const { sql } = setupDatabaseMocks();
        sql.mockRejectedValueOnce(new Error('Database error'));

        const response = await GET();
        expect(response).toBeDefined();
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data).toEqual({ error: 'Failed to fetch featured photos' });
    });

    it('returns empty array when no photos found', async () => {
        const { sql } = setupDatabaseMocks();
        sql.mockResolvedValueOnce([]);

        const response = await GET();
        expect(response).toBeDefined();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual([]);
    });
}); 