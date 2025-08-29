import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { BlogPost, BlogFrontmatter } from './types'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

// Cache for MDX components to avoid re-importing
const mdxCache = new Map<string, React.ComponentType>()

// Dynamic import function for MDX files
async function loadMDXFile(filename: string): Promise<React.ComponentType> {
  if (mdxCache.has(filename)) {
    return mdxCache.get(filename)!
  }

  try {
    const module = await import(`@/content/blog/${filename}`)
    const component = module.default
    mdxCache.set(filename, component)
    return component
  } catch (error) {
    console.error(`[Blog] Failed to load MDX file: ${filename}`, error)
    throw error
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  console.log('[Blog] getAllBlogPosts: Fetching all blog posts')
  
  // Ensure blog directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('[Blog] Blog directory does not exist, returning empty array')
    return []
  }

  const files = fs.readdirSync(BLOG_DIR)
  const mdxFiles = files.filter(file => 
    file.endsWith('.mdx') && !file.startsWith('_')
  )

  console.log('[Blog] Found MDX files:', mdxFiles)

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      try {
        const filePath = path.join(BLOG_DIR, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(fileContent)
        
        const frontmatter = data as BlogFrontmatter
        const slug = file.replace(/\.mdx$/, '')
        const MDXContent = await loadMDXFile(file)
        
        return {
          ...frontmatter,
          slug,
          content: MDXContent,
          readingTime: readingTime(content).text,
        } as BlogPost
      } catch (error) {
        console.error(`[Blog] Error processing file ${file}:`, error)
        return null
      }
    })
  )

  // Filter out nulls and unpublished posts, then sort by date
  const publishedPosts = posts
    .filter((post): post is BlogPost => 
      post !== null && post.published !== false
    )
    .sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

  console.log('[Blog] Returning posts:', publishedPosts.length)
  return publishedPosts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log('[Blog] getBlogPostBySlug: Fetching post by slug:', slug)
  
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    
    if (!fs.existsSync(filePath)) {
      console.log('[Blog] Post not found:', slug)
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    const frontmatter = data as BlogFrontmatter
    const MDXContent = await loadMDXFile(`${slug}.mdx`)
    
    const post = {
      ...frontmatter,
      slug,
      content: MDXContent,
      readingTime: readingTime(content).text,
    } as BlogPost

    console.log('[Blog] Found post:', post.title)
    return post
  } catch (error) {
    console.error('[Blog] Error fetching post by slug:', error)
    return null
  }
}

export async function getBlogTags(): Promise<string[]> {
  const posts = await getAllBlogPosts()
  const tagSet = new Set<string>()
  
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}