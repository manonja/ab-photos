import { GET } from './route';
import { mockPhotos, setupDatabaseMocks } from '@/db/__tests__/mocks';

const { sql } = setupDatabaseMocks();

describe('GET /api/photos/[slug]/[photo_seq_id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns photo details when found', async () => {
    const mockPhoto = mockPhotos[0];
    (sql as jest.Mock).mockResolvedValueOnce([mockPhoto]);

    const request = new Request(
      'http://localhost:3000/api/photos/test-project/1',
      { method: 'GET' }
    );
    const response = await GET(request, {
      params: { slug: 'test-project', photo_seq_id: '1' }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockPhoto);
    expect(sql).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      'test-project',
      1
    );
  });

  it('returns 404 when photo is not found', async () => {
    (sql as jest.Mock).mockResolvedValueOnce([]);

    const request = new Request(
      'http://localhost:3000/api/photos/test-project/1',
      { method: 'GET' }
    );
    const response = await GET(request, {
      params: { slug: 'test-project', photo_seq_id: '1' }
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ error: 'Photo not found' });
  });

  it('returns 500 on server error', async () => {
    (sql as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const request = new Request(
      'http://localhost:3000/api/photos/test-project/1',
      { method: 'GET' }
    );
    const response = await GET(request, {
      params: { slug: 'test-project', photo_seq_id: '1' }
    });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch photo' });
  });
}); 