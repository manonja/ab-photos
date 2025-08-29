#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const INDEX_EDGE_PATH = path.join(process.cwd(), 'src/lib/blog/index.ts');

function updateMDXImports() {
  console.log('[Update MDX Imports] Updating dynamic imports...');
  
  // Get all MDX files
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.mdx') && !file.startsWith('_'))
    .sort();

  // Generate import statements
  const imports = files.map(file => {
    const name = file.replace(/\.mdx$/, '');
    return `  '${file}': () => import('../../../content/blog/${file}'),`;
  }).join('\n');

  // Read current file
  let content = fs.readFileSync(INDEX_EDGE_PATH, 'utf-8');
  
  // Replace the mdxModules object
  const mdxModulesRegex = /const mdxModules = \{[\s\S]*?\} as const/;
  const newMdxModules = `const mdxModules = {\n${imports}\n} as const`;
  
  content = content.replace(mdxModulesRegex, newMdxModules);
  
  // Write back
  fs.writeFileSync(INDEX_EDGE_PATH, content);
  
  console.log(`[Update MDX Imports] Updated imports for ${files.length} MDX files`);
}

updateMDXImports();