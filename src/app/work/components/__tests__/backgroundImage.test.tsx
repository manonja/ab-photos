import { render, screen } from '@testing-library/react'
import { getPhotoDetails } from '@/actions/getPhotoDetails'
import BackgroundImage from '../backgroundImage'

// Mock Cloudflare context (required because getPhotoDetails now imports @/db/operations → @/db/client → @opennextjs/cloudflare)
jest.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => ({ env: {} }),
}))

// Mock the getPhotoDetails function
jest.mock('@/actions/getPhotoDetails')
const mockedGetPhotoDetails = getPhotoDetails as jest.MockedFunction<typeof getPhotoDetails>

describe('BackgroundImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render background image when photo is found', async () => {
    const mockPhoto = {
      id: 'photo1',
      desktop_blob: 'https://example.com/photo.jpg',
      caption: 'Test photo',
    }
    mockedGetPhotoDetails.mockResolvedValueOnce(mockPhoto)

    render(await BackgroundImage({ slug: 'test-project' }))

    const img = screen.getByAltText('Test photo')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
    expect(mockedGetPhotoDetails).toHaveBeenCalledWith('test-project', 2)
  })

  it('should render fallback when photo is not found', async () => {
    mockedGetPhotoDetails.mockResolvedValueOnce(null)

    render(await BackgroundImage({ slug: 'test-project' }))

    const fallback = screen.getByTestId('background-fallback')
    expect(fallback).toBeInTheDocument()
    expect(fallback).toHaveClass('bg-black')
  })

  it('should render fallback on error', async () => {
    mockedGetPhotoDetails.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(await BackgroundImage({ slug: 'test-project' }))

    const fallback = screen.getByTestId('background-fallback')
    expect(fallback).toBeInTheDocument()
    expect(fallback).toHaveClass('bg-black')
  })

  it('should use custom sequence when provided', async () => {
    const mockPhoto = {
      id: 'photo3',
      desktop_blob: 'https://example.com/photo3.jpg',
      caption: 'Custom sequence photo',
    }
    mockedGetPhotoDetails.mockResolvedValueOnce(mockPhoto)

    render(await BackgroundImage({ slug: 'test-project', sequence: 3 }))

    expect(mockedGetPhotoDetails).toHaveBeenCalledWith('test-project', 3)
  })

  it('should use getPhotoDetails for random photo selection instead of direct fetch', async () => {
    const mockPhotos = [
      {
        id: 'photo1',
        desktop_blob: 'https://example.com/photo1.jpg',
        caption: 'Photo 1',
      },
      {
        id: 'photo2',
        desktop_blob: 'https://example.com/photo2.jpg',
        caption: 'Photo 2',
      },
    ]
    mockedGetPhotoDetails.mockResolvedValueOnce(mockPhotos)

    // Mock global.fetch to verify the component does NOT call it directly
    const fetchMock = jest
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(mockPhotos), { status: 200 }))
    global.fetch = fetchMock

    render(await BackgroundImage({ slug: '7-rad', random: true }))

    // The component should delegate to getPhotoDetails (no sequence = fetch all photos)
    expect(mockedGetPhotoDetails).toHaveBeenCalledWith('7-rad')
    // The component should NOT make a direct fetch call
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
