'use client'

import React from 'react'
import HeroComponent from '@/blocks/Hero/Component'
import GalleryComponent from '@/blocks/Gallery/Component'
import TextComponent from '@/blocks/Text/Component'
import ImageTextComponent from '@/blocks/ImageText/Component'
import QuoteComponent from '@/blocks/Quote/Component'
import SpacerComponent from '@/blocks/Spacer/Component'

type Block =
  | { blockType: 'hero'; heading?: string; subheading?: string; image: unknown; overlayOpacity?: number; height?: 'full' | 'large' | 'medium' | 'small' }
  | { blockType: 'gallery'; photoSource: 'existing' | 'payload'; projectId?: string; images?: unknown[]; layout?: 'grid' | 'masonry' | 'carousel' | 'single'; columns?: '2' | '3' | '4'; showCaptions?: boolean; enableLightbox?: boolean }
  | { blockType: 'text'; content: object; alignment?: 'left' | 'center' | 'right'; maxWidth?: 'full' | 'large' | 'medium' | 'small' }
  | { blockType: 'imageText'; image: unknown; content: object; imagePosition?: 'left' | 'right'; imageSize?: 'small' | 'medium' | 'large'; verticalAlignment?: 'top' | 'center' | 'bottom' }
  | { blockType: 'quote'; quote: string; attribution?: string; style?: 'default' | 'large' | 'minimal' }
  | { blockType: 'spacer'; size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }

interface BlockRendererProps {
  blocks: Block[]
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return (
              <HeroComponent
                key={index}
                heading={block.heading}
                subheading={block.subheading}
                image={block.image as never}
                overlayOpacity={block.overlayOpacity}
                height={block.height}
              />
            )
          case 'gallery':
            return (
              <GalleryComponent
                key={index}
                photoSource={block.photoSource}
                projectId={block.projectId}
                images={block.images as never[]}
                layout={block.layout}
                columns={block.columns}
                showCaptions={block.showCaptions}
                enableLightbox={block.enableLightbox}
              />
            )
          case 'text':
            return (
              <TextComponent
                key={index}
                content={block.content}
                alignment={block.alignment}
                maxWidth={block.maxWidth}
              />
            )
          case 'imageText':
            return (
              <ImageTextComponent
                key={index}
                image={block.image as never}
                content={block.content}
                imagePosition={block.imagePosition}
                imageSize={block.imageSize}
                verticalAlignment={block.verticalAlignment}
              />
            )
          case 'quote':
            return (
              <QuoteComponent
                key={index}
                quote={block.quote}
                attribution={block.attribution}
                style={block.style}
              />
            )
          case 'spacer':
            return <SpacerComponent key={index} size={block.size} />
          default:
            return null
        }
      })}
    </>
  )
}

export default BlockRenderer
