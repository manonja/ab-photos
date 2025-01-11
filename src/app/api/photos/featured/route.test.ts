import { GET } from './route';
import { mockPhotos, setupDatabaseMocks } from '@/db/__tests__/mocks';

const { sql } = setupDatabaseMocks();

describe('GET /api/photos/featured', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns featured photos successfully', async () => {
    const featuredPhotos = mockPhotos.filter(p => p.sequence === 1);
    (sql as jest.Mock).mockResolvedValueOnce(featuredPhotos);

    const request = new Request('http://localhost:3000/api/photos/featured');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(featuredPhotos);
    expect(sql).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      expect.stringContaining('WHERE sequence = 1')
    );
  });

  it('returns empty array when no featured photos found', async () => {
    (sql as jest.Mock).mockResolvedValueOnce([]);

    const request = new Request('http://localhost:3000/api/photos/featured');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it('returns 500 on database error', async () => {
    (sql as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const request = new Request('http://localhost:3000/api/photos/featured');
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch featured photos' });
  });
}); 