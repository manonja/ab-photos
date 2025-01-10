import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectPhotos from '../projectPhotos';
import { getPhotoDetails } from '@/actions/getPhotoDetails';
import { Photo } from '@/db/types';

// Mock the getPhotoDetails function
jest.mock('@/actions/getPhotoDetails');
const mockedGetPhotoDetails = getPhotoDetails as jest.MockedFunction<typeof getPhotoDetails>;

describe('ProjectPhotos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all photos from a project', async () => {
        const mockPhotos: Photo[] = [
            {
                id: 'photo1',
                desktop_blob: 'https://example.com/photo1.jpg',
                mobile_blob: 'https://example.com/photo1-mobile.jpg',
                gallery_blob: 'https://example.com/photo1-gallery.jpg',
                sequence: 1,
                caption: 'First photo',
                projectId: 'test-project'
            },
            {
                id: 'photo2',
                desktop_blob: 'https://example.com/photo2.jpg',
                mobile_blob: 'https://example.com/photo2-mobile.jpg',
                gallery_blob: 'https://example.com/photo2-gallery.jpg',
                sequence: 2,
                caption: 'Second photo',
                projectId: 'test-project'
            }
        ];
        mockedGetPhotoDetails.mockResolvedValueOnce(mockPhotos);

        render(await ProjectPhotos({ slug: 'test-project' }));

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', 'https://example.com/photo1.jpg');
        expect(images[1]).toHaveAttribute('src', 'https://example.com/photo2.jpg');

        const captions = screen.getAllByText(/photo/);
        expect(captions).toHaveLength(2);
        expect(captions[0]).toHaveTextContent('First photo');
        expect(captions[1]).toHaveTextContent('Second photo');
    });

    it('should render no photos message when project has no photos', async () => {
        mockedGetPhotoDetails.mockResolvedValueOnce([]);

        render(await ProjectPhotos({ slug: 'test-project' }));

        const message = screen.getByText('No photos available for this project.');
        expect(message).toBeInTheDocument();
    });

    it('should render error message when photo fetch fails', async () => {
        mockedGetPhotoDetails.mockRejectedValueOnce(new Error('Failed to fetch'));

        render(await ProjectPhotos({ slug: 'test-project' }));

        const message = screen.getByText('Error loading photos. Please try again later.');
        expect(message).toBeInTheDocument();
    });
}); 