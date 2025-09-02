#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const OUTPUT_DIR = path.join(process.cwd(), 'src/lib/blog/compiled');

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  // Split content into lines for easier processing
  const lines = markdown.split('\n');
  const htmlLines = [];
  let inList = false;
  let listType = null;
  let inParagraph = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines but close paragraph if needed
    if (line === '') {
      if (inParagraph) {
        htmlLines.push('</p>');
        inParagraph = false;
      }
      if (inList) {
        htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
        listType = null;
      }
      continue;
    }
    
    // Headers
    if (line.startsWith('# ')) {
      if (inParagraph) {
        htmlLines.push('</p>');
        inParagraph = false;
      }
      htmlLines.push(`<h1 class="text-4xl font-bold mt-8 mb-4 text-gray-900">${processInlineMarkdown(line.substring(2))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inParagraph) {
        htmlLines.push('</p>');
        inParagraph = false;
      }
      htmlLines.push(`<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900">${processInlineMarkdown(line.substring(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      if (inParagraph) {
        htmlLines.push('</p>');
        inParagraph = false;
      }
      htmlLines.push(`<h3 class="text-2xl font-semibold mt-6 mb-3 text-gray-900">${processInlineMarkdown(line.substring(4))}</h3>`);
      continue;
    }
    
    // Lists
    if (line.match(/^\- /)) {
      if (inParagraph) {
        htmlLines.push('</p>');
        inParagraph = false;
      }
      if (!inList || listType !== 'ul') {
        if (inList && listType === 'ol') htmlLines.push('</ol>');
        htmlLines.push('<ul class="list-disc list-inside mb-4 space-y-2">');
        inList = true;
        listType = 'ul';
      }
      htmlLines.push(`<li>${processInlineMarkdown(line.substring(2))}</li>`);
      continue;
    }
    
    if (line.match(/^\d+\. /)) {
      if (inParagraph) {
        htmlLines.push('</p>');
        inParagraph = false;
      }
      if (!inList || listType !== 'ol') {
        if (inList && listType === 'ul') htmlLines.push('</ul>');
        htmlLines.push('<ol class="list-decimal list-inside mb-4 space-y-2">');
        inList = true;
        listType = 'ol';
      }
      htmlLines.push(`<li>${processInlineMarkdown(line.replace(/^\d+\. /, ''))}</li>`);
      continue;
    }
    
    // Close lists if not in list anymore
    if (inList) {
      htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
      listType = null;
    }
    
    // Images
    if (line.match(/^!\[/)) {
      if (inParagraph) {
        htmlLines.push('</p>');
        inParagraph = false;
      }
      const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        htmlLines.push(`<figure class="my-8">`);
        htmlLines.push(`  <img src="${match[2]}" alt="${match[1]}" class="w-full rounded-lg" />`);
        if (match[1]) {
          htmlLines.push(`  <figcaption class="text-sm text-gray-600 text-center mt-2">${match[1]}</figcaption>`);
        }
        htmlLines.push(`</figure>`);
      }
      continue;
    }
    
    // Regular paragraph text
    if (!inParagraph) {
      htmlLines.push('<p class="text-gray-700 leading-relaxed mb-4">');
      inParagraph = true;
    }
    htmlLines.push(processInlineMarkdown(line));
  }
  
  // Close any open paragraph
  if (inParagraph) {
    htmlLines.push('</p>');
  }
  
  // Close any open list
  if (inList) {
    htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
  }
  
  return htmlLines.join('\n');
}

// Process inline markdown (bold, italic, links, code)
function processInlineMarkdown(text) {
  // Bold and italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
  
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-100 rounded text-sm font-mono">$1</code>');
  
  return text;
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