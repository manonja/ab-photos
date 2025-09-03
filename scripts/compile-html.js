#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const OUTPUT_DIR = path.join(process.cwd(), 'src/lib/blog/compiled');

// Extract frontmatter from HTML comments
function extractFrontmatter(htmlContent) {
  const frontmatterRegex = /<!--\s*([\s\S]*?)\s*-->/;
  const match = htmlContent.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('No frontmatter found in HTML file');
  }
  
  const frontmatterText = match[1];
  const content = htmlContent.replace(frontmatterRegex, '').trim();
  
  // Parse frontmatter
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays (for tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
      }
      
      // Parse booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      frontmatter[key] = value;
    }
  }
  
  // Set default layout if not specified
  if (!frontmatter.layout) {
    frontmatter.layout = 'single';
  }
  
  return { frontmatter, content };
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read all blog files
function getAllBlogFiles() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('[Compile HTML] Blog directory does not exist, creating it...');
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  return files.filter(file => file.endsWith('.html') && !file.startsWith('_'));
}

// Compile blog files to JSON with HTML content
function compileBlogFiles() {
  console.log('[Compile HTML] Starting blog compilation...');
  
  const blogFiles = getAllBlogFiles();
  const posts = [];

  blogFiles.forEach(file => {
    try {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { frontmatter, content } = extractFrontmatter(fileContent);
      
      // Extract slug from filename or use frontmatter slug
      const fileSlug = file.replace(/\.html$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const slug = frontmatter.slug || fileSlug;
      
      // Only include published posts
      if (frontmatter.published !== false) {
        posts.push({
          title: frontmatter.title || 'Untitled',
          slug,
          date: frontmatter.date || new Date().toISOString().split('T')[0],
          author: frontmatter.author || 'Anton Bossenbroek',
          excerpt: frontmatter.excerpt || '',
          featuredImage: frontmatter.featuredImage || null,
          tags: frontmatter.tags || [],
          published: frontmatter.published !== false,
          layout: frontmatter.layout || 'single',
          content: content,
          fileName: file
        });
      }
    } catch (error) {
      console.error(`[Compile HTML] Error processing file ${file}:`, error);
    }
  });

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Write compiled data
  const output = {
    posts,
    compiledAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'posts.json'),
    JSON.stringify(output, null, 2)
  );

  console.log(`[Compile HTML] Compiled ${posts.length} posts to ${OUTPUT_DIR}/posts.json`);
}

// Run compilation
compileBlogFiles();