'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { Media } from '@/payload-types'

interface GalleryImage {
  image: Media | string
}

interface ExistingPhoto {
  id: string
  url: string
  alt?: string
  caption?: string
}

interface GalleryBlockProps {
  photoSource: 'existing' | 'payload'
  projectId?: string
  images?: GalleryImage[]
  layout?: 'grid' | 'masonry' | 'carousel' | 'single'
  columns?: '2' | '3' | '4'
  showCaptions?: boolean
  enableLightbox?: boolean
}

const columnClasses = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export const GalleryComponent: React.FC<GalleryBlockProps> = ({
  photoSource,
  projectId,
  images = [],
  layout = 'grid',
  columns = '3',
  showCaptions = false,
  enableLightbox = true,
}) => {
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Fetch existing photos from Neon database
  useEffect(() => {
    if (photoSource === 'existing' && projectId) {
      setLoading(true)
      fetch(`/api/photos/${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setExistingPhotos(data.map((photo: { id: string; url: string; alt?: string; caption?: string }) => ({
              id: photo.id,
              url: photo.url,
              alt: photo.alt || '',
              caption: photo.caption || '',
            })))
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [photoSource, projectId])

  // Prepare photos array based on source
  const photos = photoSource === 'existing'
    ? existingPhotos.map(p => ({ url: p.url, alt: p.alt, caption: p.caption }))
    : images.map(img => {
        const media = typeof img.image === 'string' ? null : img.image
        return {
          url: typeof img.image === 'string' ? img.image : media?.url || '',
          alt: media?.alt || '',
          caption: media?.caption || '',
        }
      })

  if (loading) {
    return (
      <section className="w-full py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-400">Loading gallery...</div>
        </div>
      </section>
    )
  }

  if (photos.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  if (layout === 'single') {
    return (
      <section className="w-full py-8 space-y-8">
        {photos.map((photo, index) => (
          <div key={index} className="relative w-full">
            <Image
              src={photo.url}
              alt={photo.alt || ''}
              width={1600}
              height={1000}
              className="w-full h-auto cursor-pointer"
              onClick={() => openLightbox(index)}
            />
            {showCaptions && photo.caption && (
              <p className="text-sm text-gray-400 mt-2">{photo.caption}</p>
            )}
          </div>
        ))}
      </section>
    )
  }

  if (layout === 'carousel') {
    return (
      <section className="w-full py-8 overflow-x-auto">
        <div className="flex gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[40vw]">
              <Image
                src={photo.url}
                alt={photo.alt || ''}
                width={800}
                height={600}
                className="w-full h-auto cursor-pointer"
                onClick={() => openLightbox(index)}
              />
              {showCaptions && photo.caption && (
                <p className="text-sm text-gray-400 mt-2">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <section className={`w-full py-8 grid ${columnClasses[columns]} gap-4`}>
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={photo.url}
              alt={photo.alt || ''}
              fill
              className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => openLightbox(index)}
            />
            {showCaptions && photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                <p className="text-sm text-white">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {lightboxOpen && enableLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setLightboxOpen(false)}
          >
            &times;
          </button>
          <button
            className="absolute left-4 text-white text-4xl"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
            }}
          >
            &#8249;
          </button>
          <Image
            src={photos[lightboxIndex]?.url || ''}
            alt={photos[lightboxIndex]?.alt || ''}
            width={1400}
            height={900}
            className="max-h-[90vh] w-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white text-4xl"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
            }}
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  )
}

export default GalleryComponent
