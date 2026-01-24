export interface BlogFrontmatter {
  title: string
  date: string
  author: string
  excerpt: string
  featuredImage: string
  tags: string[]
  published?: boolean
  layout?: 'single' | 'two-column' | 'mixed'
}

export interface BlogPost extends BlogFrontmatter {
  slug: string
  content: string // HTML content as string
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

// Blog display types (previously Ghost types)
export interface BlogAuthor {
  id: string
  name: string
  slug: string
  profile_image?: string
  cover_image?: string
  bio?: string
  website?: string
  location?: string
  facebook?: string
  twitter?: string
  meta_title?: string
  meta_description?: string
  url: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  description?: string
  feature_image?: string
  visibility: string
  meta_title?: string
  meta_description?: string
  url: string
}

export interface BlogPostDisplay {
  id: string
  uuid: string
  title: string
  slug: string
  html: string
  comment_id?: string
  feature_image?: string
  featured: boolean
  visibility: string
  created_at: string
  updated_at: string
  published_at: string
  custom_excerpt?: string
  codeinjection_head?: string
  codeinjection_foot?: string
  custom_template?: string
  canonical_url?: string
  tags?: BlogTag[]
  authors?: BlogAuthor[]
  primary_author?: BlogAuthor
  primary_tag?: BlogTag
  url: string
  excerpt: string
  reading_time: number
  access?: boolean
  comments?: boolean
  og_image?: string
  og_title?: string
  og_description?: string
  twitter_image?: string
  twitter_title?: string
  twitter_description?: string
  meta_title?: string
  meta_description?: string
  htmlContent?: string // For HTML content
}
