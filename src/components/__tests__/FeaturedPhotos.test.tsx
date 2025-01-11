import { render, screen, waitFor } from '@testing-library/react';
import { FeaturedPhotos } from '../FeaturedPhotos';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

// Mock next/image (used by PhotoCard)
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || 'Featured photo'} />,
}));

describe('FeaturedPhotos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('shows loading state initially', () => {
    render(<FeaturedPhotos />);
    expect(screen.getByTestId('loading-photos')).toBeInTheDocument();
  });

  it('displays photos when loaded successfully', async () => {
    const mockPhotos = [
      {
        id: '1',
        desktop_blob: '/photo1.jpg',
        caption: 'Photo 1',
        sequence: 1,
      },
      {
        id: '2',
        desktop_blob: '/photo2.jpg',
        caption: 'Photo 2',
        sequence: 2,
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotos,
    });

    render(<FeaturedPhotos />);

    await waitFor(() => {
      expect(screen.getByTestId('featured-photos')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByText('Photo 1')).toBeInTheDocument();
    expect(screen.getByText('Photo 2')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<FeaturedPhotos />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    expect(screen.getByText('Failed to load photos')).toBeInTheDocument();
  });

  it('shows no photos message when response is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<FeaturedPhotos />);

    await waitFor(() => {
      expect(screen.getByTestId('no-photos')).toBeInTheDocument();
    });
    expect(screen.getByText('No featured photos available')).toBeInTheDocument();
  });
}); 