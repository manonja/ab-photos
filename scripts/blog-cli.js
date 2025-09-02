#!/usr/bin/env node
const { program } = require('commander')
const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

// Import chalk dynamically due to ESM
let chalk;
(async () => {
  chalk = (await import('chalk')).default;
})();

const BLOG_DIR = path.join(process.cwd(), 'content/blog')
const IMAGES_DIR = path.join(process.cwd(), 'public/images/blog')

// Ensure directories exist
fs.ensureDirSync(BLOG_DIR)
fs.ensureDirSync(IMAGES_DIR)

// Simple console colors as fallback
const colors = {
  green: (text) => chalk ? chalk.green(text) : `✓ ${text}`,
  red: (text) => chalk ? chalk.red(text) : `✗ ${text}`,
  blue: (text) => chalk ? chalk.blue(text) : `ℹ ${text}`,
  yellow: (text) => chalk ? chalk.yellow(text) : `⚠ ${text}`,
  gray: (text) => chalk ? chalk.gray(text) : text,
  white: (text) => chalk ? chalk.white(text) : text
}

program
  .name('blog')
  .description('CLI tool for managing blog posts')
  .version('1.0.0')

program
  .command('new <title>')
  .description('Create a new blog post')
  .option('-d, --draft', 'Create as draft (unpublished)')
  .action(async (title, options) => {
    const date = new Date().toISOString().split('T')[0]
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const filename = `${date}-${slug}.mdx`
    const filepath = path.join(BLOG_DIR, filename)
    
    // Check if file already exists
    if (await fs.pathExists(filepath)) {
      console.error(colors.red(`Error: ${filename} already exists!`))
      process.exit(1)
    }
    
    // Get current year
    const year = new Date().getFullYear()
    
    // Simple template
    const template = `---
title: "${title}"
date: "${date}"
author: "Anton Bossenbroek"
excerpt: "A brief description of your post that appears in the listing."
featuredImage: "/images/blog/${year}/placeholder.jpg"
tags: ["photography"]
published: ${!options.draft}
---

Write your introduction paragraph here.

## First Section

Your content goes here. You can use **bold text** and *italic text* for emphasis.

## Adding Images

To add an image:
![Description of the image](/images/blog/${year}/your-image.jpg)

## Creating Lists

For bullet points:
- First item
- Second item
- Third item

For numbered lists:
1. First step
2. Second step
3. Third step

## Adding a Quote

<Quote author="Author Name">
This is an inspiring quote.
</Quote>

## Conclusion

Wrap up your blog post with a conclusion.

---

*Remember to:*
1. Add your images to \`public/images/blog/${year}/\`
2. Update the excerpt
3. Change \`published: ${!options.draft}\` to \`published: true\` when ready
4. Run \`npm run dev\` to see your post locally
`
    
    // Write file
    await fs.writeFile(filepath, template)
    
    // Run compile script
    console.log(colors.yellow(`\n⚙️  Updating compiled data...`))
    execSync('node scripts/compile-html.js', { stdio: 'inherit' })
    
    console.log(colors.green(`✓ Created: ${filepath}`))
    console.log(colors.blue(`\n📝 Opening in VS Code...`))
    
    // Open in VS Code
    try {
      execSync(`code ${filepath}`)
    } catch (e) {
      console.log(colors.yellow('Could not open VS Code. Please open manually.'))
    }
  })

program
  .command('add-image <imagePath>')
  .alias('img')
  .description('Add and optimize an image for your blog')
  .option('-n, --name <filename>', 'Rename the image')
  .action(async (imagePath, options) => {
    const year = new Date().getFullYear()
    const destDir = path.join(IMAGES_DIR, year.toString())
    
    // Ensure year directory exists
    await fs.ensureDir(destDir)
    
    // Determine filename
    const originalName = path.basename(imagePath)
    const filename = options.name || originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
    
    const destination = path.join(destDir, filename)
    
    try {
      // Copy image
      await fs.copy(imagePath, destination)
      
      // Generate markdown reference
      const mdPath = `/images/blog/${year}/${filename}`
      
      console.log(colors.green(`✓ Image added: ${destination}`))
      console.log(colors.blue(`\n📋 Markdown reference:`))
      console.log(colors.white(`![Alt text](${mdPath})`))
      
      // Copy to clipboard if possible (macOS)
      try {
        execSync(`echo "![Alt text](${mdPath})" | pbcopy`)
        console.log(colors.gray('\n(Copied to clipboard)'))
      } catch {}
      
    } catch (error) {
      console.error(colors.red(`Error: ${error.message}`))
      process.exit(1)
    }
  })

program
  .command('list')
  .alias('ls')
  .description('List all blog posts')
  .option('-d, --drafts', 'Include drafts')
  .action(async (options) => {
    const files = await fs.readdir(BLOG_DIR)
    const posts = files
      .filter(f => f.endsWith('.mdx') && !f.startsWith('_'))
      .sort()
      .reverse()
    
    if (posts.length === 0) {
      console.log(colors.yellow('No blog posts found.'))
      return
    }
    
    console.log(colors.blue('\n📝 Blog Posts:\n'))
    
    for (const file of posts) {
      const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
      const match = content.match(/title:\s*"(.+)"/)
      const publishedMatch = content.match(/published:\s*(true|false)/)
      const title = match ? match[1] : 'Untitled'
      const isDraft = publishedMatch && publishedMatch[1] === 'false'
      
      if (isDraft && !options.drafts) continue
      
      const status = isDraft ? colors.yellow('[DRAFT]') : colors.green('[PUBLISHED]')
      console.log(`${status} ${file} - ${title}`)
    }
  })

program
  .command('preview')
  .description('Preview your blog locally')
  .action(() => {
    console.log(colors.blue('🚀 Starting development server...\n'))
    execSync('npm run dev', { stdio: 'inherit' })
  })

program
  .command('publish [message]')
  .description('Commit and push your blog changes')
  .action((message = 'feat: update blog content') => {
    try {
      console.log(colors.blue('📦 Staging blog files...'))
      execSync('git add content/blog public/images/blog')
      
      console.log(colors.blue('💾 Committing changes...'))
      execSync(`git commit -m "${message}"`)
      
      console.log(colors.blue('🚀 Pushing to remote...'))
      execSync('git push')
      
      console.log(colors.green('\n✓ Blog published successfully!'))
      console.log(colors.gray('Changes will be live in ~2 minutes.'))
    } catch (error) {
      console.error(colors.red('Error publishing:'), error.message)
      process.exit(1)
    }
  })

// Ensure chalk is loaded before parsing
setTimeout(() => {
  program.parse(process.argv)
}, 100)