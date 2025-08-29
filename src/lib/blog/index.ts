// Edge-compatible blog functions that use pre-compiled JSON data
import { BlogPost, BlogFrontmatter } from './types'
import compiledPosts from './compiled/posts.json'

// Dynamic imports for MDX components
const mdxModules = {
  '2024-01-15-example-welcome-post.mdx': () => import('../../../content/blog/2024-01-15-example-welcome-post.mdx'),
} as const

// Cache for MDX components
const mdxCache = new Map<string, React.ComponentType>()

// Load MDX component dynamically
async function loadMDXComponent(fileName: string): Promise<React.ComponentType | null> {
  if (mdxCache.has(fileName)) {
    return mdxCache.get(fileName)!
  }

  const loader = mdxModules[fileName as keyof typeof mdxModules]
  if (!loader) {
    console.error(`[Blog] No MDX module found for: ${fileName}`)
    return null
  }

  try {
    const mdxModule = await loader()
    const component = mdxModule.default
    mdxCache.set(fileName, component)
    return component
  } catch (error) {
    console.error(`[Blog] Failed to load MDX component: ${fileName}`, error)
    return null
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  console.log('[Blog] getAllBlogPosts: Fetching from pre-compiled data')
  
  const posts = await Promise.all(
    compiledPosts.posts.map(async (post) => {
      const component = await loadMDXComponent(post.fileName)
      if (!component) return null
      
      return {
        ...post,
        content: component,
      } as BlogPost
    })
  )

  // Filter out nulls
  return posts.filter((post): post is BlogPost => post !== null)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log('[Blog] getBlogPostBySlug: Fetching post by slug:', slug)
  
  const postData = compiledPosts.posts.find(p => p.slug === slug)
  if (!postData) {
    console.log('[Blog] Post not found:', slug)
    return null
  }

  const component = await loadMDXComponent(postData.fileName)
  if (!component) return null

  return {
    ...postData,
    content: component,
  } as BlogPost
}

export async function getBlogTags(): Promise<string[]> {
  const tagSet = new Set<string>()
  
  compiledPosts.posts.forEach(post => {
    post.tags.forEach((tag: string) => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}