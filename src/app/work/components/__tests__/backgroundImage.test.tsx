import { render, screen } from '@testing-library/react';
import BackgroundImage from '../backgroundImage';
import { getPhotoDetails } from '@/actions/getPhotoDetails';
import { Photo } from '@/db/types';

// Mock the getPhotoDetails function
jest.mock('@/actions/getPhotoDetails');
const mockedGetPhotoDetails = getPhotoDetails as jest.MockedFunction<typeof getPhotoDetails>;

describe('BackgroundImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the image when photo is found', async () => {
    const mockPhoto: Photo = {
      id: 'test-photo',
      desktop_blob: 'https://example.com/test.jpg',
      mobile_blob: 'https://example.com/test-mobile.jpg',
      gallery_blob: 'https://example.com/test-gallery.jpg',
      sequence: 2,
      caption: 'Test photo',
      projectId: 'test-project'
    };
    mockedGetPhotoDetails.mockResolvedValueOnce(mockPhoto);

    render(await BackgroundImage({ slug: 'test-project' }));
    
    const image = screen.getByRole('img', { name: mockPhoto.caption || 'Background' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPhoto.desktop_blob);
    expect(mockedGetPhotoDetails).toHaveBeenCalledWith('test-project', 2);
  });

  it('renders fallback when photo is not found', async () => {
    mockedGetPhotoDetails.mockResolvedValueOnce(null);

    render(await BackgroundImage({ slug: 'test-project' }));
    
    const fallback = screen.getByTestId('background-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveClass('bg-black');
  });

  it('uses custom sequence when provided', async () => {
    const mockPhoto: Photo = {
      id: 'test-photo',
      desktop_blob: 'https://example.com/test.jpg',
      mobile_blob: 'https://example.com/test-mobile.jpg',
      gallery_blob: 'https://example.com/test-gallery.jpg',
      sequence: 3,
      caption: 'Test photo',
      projectId: 'test-project'
    };
    mockedGetPhotoDetails.mockResolvedValueOnce(mockPhoto);

    render(await BackgroundImage({ slug: 'test-project', sequence: 3 }));
    
    expect(mockedGetPhotoDetails).toHaveBeenCalledWith('test-project', 3);
  });
}); 