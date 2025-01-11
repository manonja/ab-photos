import { GET } from './route';
import { findPhotoByProjectIdAndSeq } from '@/db/operations';

// Simple mock photo for testing
const mockPhoto = {
    id: 'photo1',
    projectId: 'nature',
    sequence: 1,
    caption: 'Test photo',
    desktop_blob: 'test.jpg',
    mobile_blob: 'test-mobile.jpg',
    gallery_blob: 'test-gallery.jpg'
};

// Mock the database operation
jest.mock('@/db/operations', () => ({
    findPhotoByProjectIdAndSeq: jest.fn()
}));

const mockedFindPhoto = findPhotoByProjectIdAndSeq as jest.MockedFunction<typeof findPhotoByProjectIdAndSeq>;

describe('GET /api/photos/[slug]/[photo_seq_id]', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 200 and photo when found', async () => {
        // Arrange
        mockedFindPhoto.mockResolvedValue(mockPhoto);

        // Act
        const response = await GET(
            new Request('http://test.com'),
            { params: { slug: 'nature', photo_seq_id: '1' } }
        );

        // Assert
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(mockPhoto);
    });

    it('returns 404 when photo not found', async () => {
        // Arrange
        mockedFindPhoto.mockResolvedValue(null);

        // Act
        const response = await GET(
            new Request('http://test.com'),
            { params: { slug: 'nature', photo_seq_id: '999' } }
        );

        // Assert
        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toEqual({ error: 'Photo not found' });
    });

    it('returns 400 when sequence ID is invalid', async () => {
        // Act
        const response = await GET(
            new Request('http://test.com'),
            { params: { slug: 'nature', photo_seq_id: 'invalid' } }
        );

        // Assert
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data).toEqual({ error: 'Invalid sequence ID' });
    });

    it('returns 500 on database error', async () => {
        // Arrange
        const error = new Error('Database error') as any;
        error.code = 'P2002';
        mockedFindPhoto.mockRejectedValue(error);

        // Act
        const response = await GET(
            new Request('http://test.com'),
            { params: { slug: 'nature', photo_seq_id: '1' } }
        );

        // Assert
        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toEqual({ error: 'Failed to fetch photo', code: 'P2002' });
    });
}); 