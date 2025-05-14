import GhostContentAPI from '@tryghost/content-api';
import { GhostPost, GhostTag, GhostAuthor } from './types';

// Initialize Ghost Content API client
const api = new GhostContentAPI({
  url: process.env.NEXT_PUBLIC_GHOST_URL || '',
  key: process.env.NEXT_PUBLIC_GHOST_CONTENT_API_KEY || '',
  version: 'v5.0'
});

// Get all posts with optional params
export async function getPosts(options: any = {}) {
  const defaultOptions = {
    limit: 'all',
    include: ['tags', 'authors'],
    fields: ['id', 'title', 'slug', 'feature_image', 'excerpt', 'published_at', 'primary_tag', 'primary_author'],
    order: 'published_at DESC',
    // Filter out posts with the tag 'news' (which appears to be the Coming Soon post)
    // You may need to adjust this filter based on your specific needs
    filter: 'tag:-news'
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    console.log('[Ghost] getPosts: Starting request', { params: mergedOptions });
    
    // First try to get the full post details for better image URLs
    // This is a workaround as sometimes the feature_image might be null in the browse response
    // but available when fetching a single post
    const posts = await api.posts.browse(mergedOptions);
    
    // For each post that has no feature_image, try to get it directly
    const enhancedPosts = await Promise.all(
      posts.map(async (post: any) => {
        if (!post.feature_image && post.slug) {
          try {
            // Try to get the full post details which might include the feature_image
            const fullPost = await api.posts.read({
              slug: post.slug,
              include: ['tags', 'authors'],
              fields: ['id', 'feature_image']
            });
            
            if (fullPost.feature_image) {
              console.log(`[Ghost] Enhanced post ${post.slug} with feature image`);
              return { ...post, feature_image: fullPost.feature_image };
            }
          } catch (error) {
            // Silently fail and return the original post
            console.error(`[Ghost] Error enhancing post ${post.slug}`, error);
          }
        }
        return post;
      })
    );
    
    console.log('[Ghost] getPosts: Successfully retrieved posts', { 
      count: enhancedPosts.length,
      // Log the first post's feature image URL for debugging
      sampleFeatureImage: enhancedPosts.length > 0 ? enhancedPosts[0].feature_image : null,
      // Log the complete first post for debugging structure
      samplePost: enhancedPosts.length > 0 ? JSON.stringify(enhancedPosts[0]).substring(0, 500) + '...' : null
    });
    
    return enhancedPosts as GhostPost[];
  } catch (error) {
    console.error('[Ghost] getPosts: Error occurred', { error, params: mergedOptions });
    return [];
  }
}

// Get a single post by slug
export async function getSinglePost(slug: string) {
  try {
    console.log('[Ghost] getSinglePost: Starting request', { slug });
    
    // Use a more comprehensive set of fields, including ones that might contain images
    const post = await api.posts.read({
      slug,
      include: ['tags', 'authors'],
      fields: [
        'id', 'title', 'slug', 'html', 'feature_image', 
        'excerpt', 'published_at', 'primary_tag', 
        'primary_author', 'reading_time', 'og_image',
        'twitter_image', 'canonical_url', 'codeinjection_head',
        'codeinjection_foot', 'custom_excerpt'
      ]
    });
    
    console.log('[Ghost] getSinglePost: Successfully retrieved post', { 
      title: post.title,
      featureImage: post.feature_image,
      hasHtml: !!post.html,
      htmlLength: post.html ? post.html.length : 0
    });
    
    return post as GhostPost;
  } catch (error) {
    console.error('[Ghost] getSinglePost: Error occurred', { error, slug });
    return null;
  }
}

// Get all tags
export async function getTags() {
  try {
    console.log('[Ghost] getTags: Starting request');
    const tags = await api.tags.browse({ limit: 'all' });
    console.log('[Ghost] getTags: Successfully retrieved tags', { count: tags.length });
    return tags as GhostTag[];
  } catch (error) {
    console.error('[Ghost] getTags: Error occurred', { error });
    return [];
  }
}

// Get posts by tag
export async function getPostsByTag(slug: string) {
  try {
    console.log('[Ghost] getPostsByTag: Starting request', { slug });
    const posts = await api.posts.browse({
      filter: `tag:${slug}`,
      include: ['tags', 'authors'],
      fields: ['id', 'title', 'slug', 'feature_image', 'excerpt', 'published_at', 'primary_tag', 'primary_author'],
      limit: 'all'
    });
    
    // Apply the same enhancement as getPosts
    const enhancedPosts = await Promise.all(
      posts.map(async (post: any) => {
        if (!post.feature_image && post.slug) {
          try {
            const fullPost = await api.posts.read({
              slug: post.slug,
              include: ['tags', 'authors'],
              fields: ['id', 'feature_image']
            });
            
            if (fullPost.feature_image) {
              return { ...post, feature_image: fullPost.feature_image };
            }
          } catch (error) {
            // Silently fail
          }
        }
        return post;
      })
    );
    
    console.log('[Ghost] getPostsByTag: Successfully retrieved posts', { count: enhancedPosts.length });
    return enhancedPosts as GhostPost[];
  } catch (error) {
    console.error('[Ghost] getPostsByTag: Error occurred', { error, slug });
    return [];
  }
} 