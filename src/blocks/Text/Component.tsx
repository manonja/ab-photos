'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'

interface TextBlockProps {
  content: object
  alignment?: 'left' | 'center' | 'right'
  maxWidth?: 'full' | 'large' | 'medium' | 'small'
}

const maxWidthClasses = {
  full: 'max-w-none',
  large: 'max-w-6xl',
  medium: 'max-w-3xl',
  small: 'max-w-xl',
}

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto',
}

export const TextComponent: React.FC<TextBlockProps> = ({
  content,
  alignment = 'left',
  maxWidth = 'medium',
}) => {
  return (
    <section className={`w-full py-8 ${maxWidthClasses[maxWidth]} ${alignmentClasses[alignment]}`}>
      <div className="prose prose-invert prose-lg">
        <RichText data={content} />
      </div>
    </section>
  )
}

export default TextComponent
