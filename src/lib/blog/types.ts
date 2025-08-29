export interface BlogFrontmatter {
  title: string
  date: string
  author: string
  excerpt: string
  featuredImage: string
  tags: string[]
  published?: boolean
}

export interface BlogPost extends BlogFrontmatter {
  slug: string
  content: React.ComponentType
}

export interface BlogImageProps {
  src: string
  alt: string
  caption?: string
}

export interface ImageGalleryProps {
  images: BlogImageProps[]
  columns?: 1 | 2 | 3 | 4
  spacing?: 'tight' | 'normal' | 'loose'
}

export interface PhotoComparisonProps {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
}

export interface QuoteProps {
  author: string
  children: React.ReactNode
}

export interface VideoEmbedProps {
  url: string
  title?: string
  aspectRatio?: '16:9' | '4:3' | '1:1'
}