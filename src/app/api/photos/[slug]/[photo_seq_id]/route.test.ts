import { GET } from './route';
import { findPhotoByProjectIdAndSeq } from '@/db/operations';
import { mockPhotos } from '@/db/__tests__/setup';

// Mock the database operation
jest.mock('@/db/operations', () => ({
    findPhotoByProjectIdAndSeq: jest.fn(),
}));

const mockedFindPhoto = findPhotoByProjectIdAndSeq as jest.MockedFunction<typeof findPhotoByProjectIdAndSeq>;

describe('GET /api/photos/[slug]/[photo_seq_id]', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a photo when found', async () => {
        const slug = 'nature';
        const sequence = 1;
        const expectedPhoto = mockPhotos.find(p => p.projectId === slug && p.sequence === sequence)!;
        mockedFindPhoto.mockResolvedValueOnce(expectedPhoto);

        const response = await GET(
            new Request('http://localhost:3000/api/photos/nature/1'),
            { params: { slug, photo_seq_id: sequence.toString() } }
        );

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(expectedPhoto);
        expect(mockedFindPhoto).toHaveBeenCalledWith(slug, sequence);
    });

    it('should return 404 when photo not found', async () => {
        mockedFindPhoto.mockResolvedValueOnce(null);

        const response = await GET(
            new Request('http://localhost:3000/api/photos/nature/999'),
            { params: { slug: 'nature', photo_seq_id: '999' } }
        );

        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toEqual({ error: 'Photo not found' });
    });

    it('should return 400 when sequence ID is invalid', async () => {
        const response = await GET(
            new Request('http://localhost:3000/api/photos/nature/invalid'),
            { params: { slug: 'nature', photo_seq_id: 'invalid' } }
        );

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data).toEqual({ error: 'Invalid sequence ID' });
        expect(mockedFindPhoto).not.toHaveBeenCalled();
    });

    it('should return 500 when database error occurs', async () => {
        const dbError = new Error('Database error');
        (dbError as any).code = 'P2002';
        mockedFindPhoto.mockRejectedValueOnce(dbError);

        const response = await GET(
            new Request('http://localhost:3000/api/photos/nature/1'),
            { params: { slug: 'nature', photo_seq_id: '1' } }
        );

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toEqual({ error: 'Failed to fetch photo', code: 'P2002' });
    });
}); 