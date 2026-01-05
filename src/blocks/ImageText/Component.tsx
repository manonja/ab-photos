'use client'

import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'

interface ImageTextBlockProps {
  image: Media | string
  content: object
  imagePosition?: 'left' | 'right'
  imageSize?: 'small' | 'medium' | 'large'
  verticalAlignment?: 'top' | 'center' | 'bottom'
}

const imageSizeClasses = {
  small: 'w-1/3',
  medium: 'w-1/2',
  large: 'w-2/3',
}

const textSizeClasses = {
  small: 'w-2/3',
  medium: 'w-1/2',
  large: 'w-1/3',
}

const alignmentClasses = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

export const ImageTextComponent: React.FC<ImageTextBlockProps> = ({
  image,
  content,
  imagePosition = 'left',
  imageSize = 'medium',
  verticalAlignment = 'center',
}) => {
  const imageUrl = typeof image === 'string' ? image : image?.url
  const imageAlt = typeof image === 'string' ? '' : image?.alt || ''

  if (!imageUrl) return null

  const imageElement = (
    <div className={`relative ${imageSizeClasses[imageSize]} aspect-[4/3]`}>
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
      />
    </div>
  )

  const textElement = (
    <div className={`${textSizeClasses[imageSize]} px-8`}>
      <div className="prose prose-invert prose-lg">
        <RichText data={content} />
      </div>
    </div>
  )

  return (
    <section className={`w-full py-8 flex flex-col md:flex-row gap-8 ${alignmentClasses[verticalAlignment]}`}>
      {imagePosition === 'left' ? (
        <>
          {imageElement}
          {textElement}
        </>
      ) : (
        <>
          {textElement}
          {imageElement}
        </>
      )}
    </section>
  )
}

export default ImageTextComponent
