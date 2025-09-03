#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

console.log('[Watch Blog] Watching for changes in', BLOG_DIR);

// Initial compile
execSync('node scripts/compile-html.js', { stdio: 'inherit' });

// Watch for changes
fs.watch(BLOG_DIR, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.html')) {
    console.log(`[Watch Blog] Detected ${eventType} in ${filename}`);
    try {
      execSync('node scripts/compile-html.js', { stdio: 'inherit' });
      console.log('[Watch Blog] Recompiled blog posts');
    } catch (error) {
      console.error('[Watch Blog] Error recompiling:', error.message);
    }
  }
});

// Keep the process running
process.stdin.resume();