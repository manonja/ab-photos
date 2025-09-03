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
  .option('-l, --layout <layout>', 'Layout type: single, two-column, or mixed', 'single')
  .action(async (title, options) => {
    const date = new Date().toISOString().split('T')[0]
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const filename = `${date}-${slug}.html`
    const filepath = path.join(BLOG_DIR, filename)
    
    // Check if file already exists
    if (await fs.pathExists(filepath)) {
      console.error(colors.red(`Error: ${filename} already exists!`))
      process.exit(1)
    }
    
    // Get current year
    const year = new Date().getFullYear()
    
    // Format date for display
    const displayDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    
    // Get appropriate template based on layout
    let contentTemplate = ''
    
    if (options.layout === 'two-column') {
      contentTemplate = `  <!-- Two column layout -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
    <div class="space-y-6 text-base leading-normal">
      <h3 class="text-xl font-normal mb-3">Left Column Title</h3>
      <p>Left column content starts here. Replace this with your actual content.</p>
      <p>Add more paragraphs as needed.</p>
    </div>
    
    <div class="space-y-6 text-base leading-normal">
      <h3 class="text-xl font-normal mb-3">Right Column Title</h3>
      <p>Right column content starts here. Replace this with your actual content.</p>
      <p>Add more paragraphs as needed.</p>
    </div>
  </div>`
    } else {
      // Default single column
      contentTemplate = `  <div class="space-y-6 text-base leading-normal">
    <p>Write your introduction paragraph here. This is your chance to hook the reader and give them a reason to continue reading.</p>
    
    <p>Continue with your main content. Each paragraph should be wrapped in p tags with proper spacing.</p>
    
    <h2 class="text-2xl font-normal mt-8 mb-4">First Section Title</h2>
    
    <p>Your section content goes here. You can use <strong class="font-semibold">bold text</strong> and <em class="italic">italic text</em> for emphasis.</p>
    
    <h2 class="text-2xl font-normal mt-8 mb-4">Second Section Title</h2>
    
    <p>More content here. To create a list:</p>
    
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li>First item in your list</li>
      <li>Second item in your list</li>
      <li>Third item in your list</li>
    </ul>
    
    <h2 class="text-2xl font-normal mt-8 mb-4">Conclusion</h2>
    
    <p>Wrap up your blog post with a strong conclusion that reinforces your main points.</p>
  </div>`
    }
    
    const template = `<!-- 
title: "${title}"
slug: "${slug}"
date: "${date}"
author: "Anton Bossenbroek"
excerpt: "A brief description of your post that appears in the listing."
tags: ["photography"]
published: ${!options.draft}
layout: "${options.layout}"
-->

<article class="text-white">
  <h1 class="text-4xl font-normal uppercase mb-2">${title}</h1>
  <div class="font-light italic text-gray-400 mb-8">${displayDate}</div>
  
  <div class="my-8 h-px bg-gray-300 w-full${options.layout === 'single' ? ' max-w-[80%]' : ''}"></div>
  
${contentTemplate}
</article>`
    
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
      .filter(f => f.endsWith('.html') && !f.startsWith('_'))
      .sort()
      .reverse()
    
    if (posts.length === 0) {
      console.log(colors.yellow('No blog posts found.'))
      return
    }
    
    console.log(colors.blue('\n📝 Blog Posts:\n'))
    
    for (const file of posts) {
      const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
      const titleMatch = content.match(/title:\s*"(.+)"/)
      const publishedMatch = content.match(/published:\s*(true|false)/)
      const layoutMatch = content.match(/layout:\s*"(.+)"/)
      const title = titleMatch ? titleMatch[1] : 'Untitled'
      const isDraft = publishedMatch && publishedMatch[1] === 'false'
      const layout = layoutMatch ? layoutMatch[1] : 'single'
      
      if (isDraft && !options.drafts) continue
      
      const status = isDraft ? colors.yellow('[DRAFT]') : colors.green('[PUBLISHED]')
      const layoutTag = colors.gray(`[${layout}]`)
      console.log(`${status} ${layoutTag} ${file} - ${title}`)
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