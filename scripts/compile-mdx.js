#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const OUTPUT_DIR = path.join(process.cwd(), 'src/lib/blog/compiled');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read all MDX files
function getAllMDXFiles() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('[Compile MDX] Blog directory does not exist, creating it...');
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  return files.filter(file => file.endsWith('.mdx') && !file.startsWith('_'));
}

// Compile MDX files to JSON
function compileMDXFiles() {
  console.log('[Compile MDX] Starting MDX compilation...');
  
  const mdxFiles = getAllMDXFiles();
  const posts = [];

  mdxFiles.forEach(file => {
    try {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const slug = file.replace(/\.mdx$/, '');
      
      // Only include published posts
      if (data.published !== false) {
        posts.push({
          ...data,
          slug,
          content,
          fileName: file
        });
      }
    } catch (error) {
      console.error(`[Compile MDX] Error processing file ${file}:`, error);
    }
  });

  // Sort by date
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

  console.log(`[Compile MDX] Compiled ${posts.length} posts to ${OUTPUT_DIR}/posts.json`);
}

// Run compilation
compileMDXFiles();