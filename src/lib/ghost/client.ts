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
    order: 'published_at DESC'
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    console.log('[Ghost] getPosts: Starting request', { params: mergedOptions });
    const posts = await api.posts.browse(mergedOptions);
    console.log('[Ghost] getPosts: Successfully retrieved posts', { count: posts.length });
    return posts as GhostPost[];
  } catch (error) {
    console.error('[Ghost] getPosts: Error occurred', { error, params: mergedOptions });
    return [];
  }
}

// Get a single post by slug
export async function getSinglePost(slug: string) {
  try {
    console.log('[Ghost] getSinglePost: Starting request', { slug });
    const post = await api.posts.read({
      slug,
      include: ['tags', 'authors']
    });
    console.log('[Ghost] getSinglePost: Successfully retrieved post', { title: post.title });
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
      limit: 'all'
    });
    console.log('[Ghost] getPostsByTag: Successfully retrieved posts', { count: posts.length });
    return posts as GhostPost[];
  } catch (error) {
    console.error('[Ghost] getPostsByTag: Error occurred', { error, slug });
    return [];
  }
} 