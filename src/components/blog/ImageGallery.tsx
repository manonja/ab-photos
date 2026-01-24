import Image from 'next/image'
import type { ImageGalleryProps } from '@/lib/blog/types'

export function ImageGallery({ images, columns = 3, spacing = 'normal' }: ImageGalleryProps) {
  const gapClass = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-8',
  }[spacing]

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={`grid ${gridColsClass} ${gapClass} my-8`}>
      {images.map((image, index) => (
        <figure key={index} className="relative group">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={`(max-width: 768px) 100vw, ${100 / columns}vw`}
            />
          </div>
          {image.caption && (
            <figcaption className="text-sm text-gray-600 mt-2 text-center">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
