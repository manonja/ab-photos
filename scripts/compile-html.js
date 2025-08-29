#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const OUTPUT_DIR = path.join(process.cwd(), 'src/lib/blog/compiled');

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold mt-6 mb-3 text-gray-900">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-8 mb-4 text-gray-900">$1</h1>');
  
  // Convert bold and italic
  html = html.replace(/\*\*\*(.*)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*)\*/g, '<em>$1</em>');
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
  
  // Convert images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
    '<figure class="my-8">' +
    '<img src="$2" alt="$1" class="w-full rounded-lg" />' +
    '<figcaption class="text-sm text-gray-600 text-center mt-2">$1</figcaption>' +
    '</figure>'
  );
  
  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">');
  
  // Convert lists
  html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc list-inside mb-4 space-y-2">$&</ul>');
  
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, function(match) {
    if (!match.includes('<ul')) {
      return '<ol class="list-decimal list-inside mb-4 space-y-2">' + match + '</ol>';
    }
    return match;
  });
  
  // Convert code blocks
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-100 rounded text-sm font-mono">$1</code>');
  
  // Wrap in paragraphs
  html = '<p class="text-gray-700 leading-relaxed mb-4">' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p class="text-gray-700 leading-relaxed mb-4"><\/p>/g, '');
  html = html.replace(/<p class="text-gray-700 leading-relaxed mb-4">(<h[1-3]|<ul|<ol|<figure)/g, '$1');
  html = html.replace(/(<\/h[1-3]>|<\/ul>|<\/ol>|<\/figure>)<\/p>/g, '$1');
  
  return html;
}

// Process custom components
function processCustomComponents(content) {
  // Remove import statements
  content = content.replace(/^import\s+.*$/gm, '');
  // Convert Quote component
  content = content.replace(
    /<Quote author="([^"]+)">\s*([^<]+)\s*<\/Quote>/g,
    '<blockquote class="relative my-8 px-8 py-6 bg-gray-50 rounded-lg">' +
    '<div class="absolute top-4 left-4 text-6xl text-gray-200 leading-none">&ldquo;</div>' +
    '<div class="relative z-10">' +
    '<p class="text-lg italic text-gray-700 leading-relaxed mb-3">$2</p>' +
    '<cite class="text-sm text-gray-600 not-italic">— $1</cite>' +
    '</div>' +
    '</blockquote>'
  );
  
  // Convert ImageGallery component
  content = content.replace(
    /<ImageGallery[^>]*columns={(\d+)}[^>]*images={\[([\s\S]*?)\]}\s*\/>/g,
    function(match, columns, images) {
      const imageArray = images.match(/{\s*src:\s*"([^"]+)"[^}]*alt:\s*"([^"]+)"[^}]*}/g) || [];
      const cols = parseInt(columns);
      const gridClass = cols === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                       cols === 3 ? 'grid-cols-1 md:grid-cols-3' : 
                       'grid-cols-1 md:grid-cols-4';
      
      let galleryHtml = '<div class="grid ' + gridClass + ' gap-4 my-8">';
      
      imageArray.forEach(img => {
        const srcMatch = img.match(/src:\s*"([^"]+)"/);
        const altMatch = img.match(/alt:\s*"([^"]+)"/);
        if (srcMatch && altMatch) {
          galleryHtml += '<figure>' +
            '<img src="' + srcMatch[1] + '" alt="' + altMatch[1] + '" class="w-full h-full object-cover rounded-lg" />' +
            '</figure>';
        }
      });
      
      galleryHtml += '</div>';
      return galleryHtml;
    }
  );
  
  // Convert VideoEmbed component
  content = content.replace(
    /<VideoEmbed url="([^"]+)"[^/]*\/>/g,
    '<div class="relative aspect-video my-8">' +
    '<iframe src="$1" class="absolute inset-0 w-full h-full rounded-lg" frameborder="0" allowfullscreen></iframe>' +
    '</div>'
  );
  
  return content;
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
  return files.filter(file => (file.endsWith('.mdx') || file.endsWith('.md')) && !file.startsWith('_'));
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
      const { data, content } = matter(fileContent);
      
      const slug = file.replace(/\.(mdx?|md)$/, '');
      
      // Process custom components first
      let htmlContent = processCustomComponents(content);
      
      // Convert markdown to HTML
      htmlContent = markdownToHtml(htmlContent);
      
      // Only include published posts
      if (data.published !== false) {
        posts.push({
          ...data,
          slug,
          content: htmlContent,
          fileName: file
        });
      }
    } catch (error) {
      console.error(`[Compile HTML] Error processing file ${file}:`, error);
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

  console.log(`[Compile HTML] Compiled ${posts.length} posts to ${OUTPUT_DIR}/posts.json`);
}

// Run compilation
compileBlogFiles();