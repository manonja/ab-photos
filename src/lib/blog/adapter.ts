import { BlogPost, BlogPostDisplay, BlogTag, BlogAuthor } from './types';

/**
 * Prepares BlogPost for display in components
 */
export function prepareBlogPostForDisplay(post: BlogPost): BlogPostDisplay {
  const displayPost: BlogPostDisplay = {
    id: post.slug,
    uuid: post.slug,
    title: post.title,
    slug: post.slug,
    html: post.content, // HTML content from compiled JSON
    feature_image: post.featuredImage,
    featured: false,
    visibility: 'public',
    created_at: post.date,
    updated_at: post.date,
    published_at: post.date,
    custom_excerpt: post.excerpt,
    excerpt: post.excerpt,
    url: `/news/${post.slug}`,
    reading_time: 5, // Default reading time
    
    // Map tags
    tags: post.tags.map(tag => ({
      id: tag,
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
      visibility: 'public',
      url: `/news/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`
    } as BlogTag)),
    
    // Map author
    primary_author: {
      id: 'anton',
      name: post.author,
      slug: 'anton-bossenbroek',
      url: '/about'
    } as BlogAuthor,
    
    authors: [{
      id: 'anton',
      name: post.author,
      slug: 'anton-bossenbroek',
      url: '/about'
    } as BlogAuthor],
    
    // Optional fields
    codeinjection_head: undefined,
    codeinjection_foot: undefined,
    custom_template: undefined,
    canonical_url: undefined,
    primary_tag: post.tags[0] ? {
      id: post.tags[0],
      name: post.tags[0],
      slug: post.tags[0].toLowerCase().replace(/\s+/g, '-'),
      visibility: 'public',
      url: `/news/tag/${post.tags[0].toLowerCase().replace(/\s+/g, '-')}`
    } as BlogTag : undefined,
    
    // Additional fields that might be expected
    og_image: post.featuredImage,
    og_title: post.title,
    og_description: post.excerpt,
    twitter_image: post.featuredImage,
    twitter_title: post.title,
    twitter_description: post.excerpt,
    meta_title: post.title,
    meta_description: post.excerpt,
    
    // Keep reference to HTML content
    htmlContent: post.content
  } as BlogPostDisplay & { htmlContent: string };
  
  return displayPost;
}