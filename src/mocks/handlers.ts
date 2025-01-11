import { rest } from 'msw';

// Example mock data
const mockPhotoData = {
  id: 1,
  title: 'Test Photo',
  url: 'https://example.com/test.jpg',
  description: 'A test photo',
};

export const handlers = [
  // GET photo details
  rest.get('/api/photos/:slug/:photo_seq_id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockPhotoData)
    );
  }),

  // Add more handlers as needed for other API endpoints
]; 