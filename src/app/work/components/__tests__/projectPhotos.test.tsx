import { render, screen } from '@testing-library/react'
import { getPhotoDetails } from '@/actions/getPhotoDetails'
import type { Photo } from '@/db/types'
import ProjectPhotos from '../projectPhotos'

// Mock the getPhotoDetails function
jest.mock('@/actions/getPhotoDetails')
const mockedGetPhotoDetails = getPhotoDetails as jest.MockedFunction<typeof getPhotoDetails>

describe('ProjectPhotos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all photos from a project', async () => {
    const mockPhotos: Photo[] = [
      {
        id: 'photo1',
        desktop_blob: 'https://example.com/photo1.jpg',
        mobile_blob: 'https://example.com/photo1-mobile.jpg',
        gallery_blob: 'https://example.com/photo1-gallery.jpg',
        sequence: 1,
        caption: 'First photo',
        projectId: 'test-project',
      },
      {
        id: 'photo2',
        desktop_blob: 'https://example.com/photo2.jpg',
        mobile_blob: 'https://example.com/photo2-mobile.jpg',
        gallery_blob: 'https://example.com/photo2-gallery.jpg',
        sequence: 2,
        caption: 'Second photo',
        projectId: 'test-project',
      },
    ]
    mockedGetPhotoDetails.mockResolvedValueOnce(mockPhotos)

    render(await ProjectPhotos({ slug: 'test-project' }))

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', 'https://example.com/photo1.jpg')
    expect(images[1]).toHaveAttribute('src', 'https://example.com/photo2.jpg')

    // Verify alt text contains captions
    expect(images[0]).toHaveAttribute('alt', 'First photo')
    expect(images[1]).toHaveAttribute('alt', 'Second photo')
  })

  it('should render coming soon message when project has no photos', async () => {
    mockedGetPhotoDetails.mockResolvedValueOnce([])

    render(await ProjectPhotos({ slug: 'test-project' }))

    const message = screen.getByText('Coming soon')
    expect(message).toBeInTheDocument()

    const description = screen.getByText(/Photos for this project are currently being prepared/)
    expect(description).toBeInTheDocument()
  })

  it('should render error message when photo fetch fails', async () => {
    mockedGetPhotoDetails.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(await ProjectPhotos({ slug: 'test-project' }))

    const message = screen.getByText('Unable to load photos')
    expect(message).toBeInTheDocument()

    const description = screen.getByText(/There was an issue retrieving photos/)
    expect(description).toBeInTheDocument()
  })
})
