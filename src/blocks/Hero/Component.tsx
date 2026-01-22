'use client'

import Image from 'next/image'
import type { Media } from '@/payload-types'

interface HeroBlockProps {
  heading?: string
  subheading?: string
  image: Media | string
  overlayOpacity?: number
  height?: 'full' | 'large' | 'medium' | 'small'
}

const heightClasses = {
  full: 'h-screen',
  large: 'h-[80vh]',
  medium: 'h-[60vh]',
  small: 'h-[40vh]',
}

export const HeroComponent: React.FC<HeroBlockProps> = ({
  heading,
  subheading,
  image,
  overlayOpacity = 40,
  height = 'full',
}) => {
  const imageUrl = typeof image === 'string' ? image : image?.url
  const imageAlt = typeof image === 'string' ? heading || '' : image?.alt || heading || ''

  if (!imageUrl) return null

  return (
    <section className={`relative w-full ${heightClasses[height]} overflow-hidden`}>
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />
      {(heading || subheading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          {heading && (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light uppercase tracking-wider mb-4">
              {heading}
            </h1>
          )}
          {subheading && (
            <p className="text-lg md:text-xl lg:text-2xl font-light opacity-90">
              {subheading}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

export default HeroComponent
