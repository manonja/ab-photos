#!/usr/bin/env node
const { program } = require('commander')
const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const chalk = require('chalk')

const BLOG_DIR = path.join(process.cwd(), 'content/blog')
const IMAGES_DIR = path.join(process.cwd(), 'public/images/blog')

// Ensure directories exist
fs.ensureDirSync(BLOG_DIR)
fs.ensureDirSync(IMAGES_DIR)

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
      console.error(chalk.red(`Error: ${filename} already exists!`))
      process.exit(1)
    }
    
    // Template content
    const template = `---
title: "${title}"
slug: "${slug}"
date: "${date}"
author: "Anton Bossenbroek"
excerpt: "A brief description of your post that will appear in listings (max 160 characters)"
featuredImage: "/images/blog/2024/featured.jpg"
tags: ["photography", "event"]
published: ${!options.draft}
---

import { ImageGallery, PhotoComparison, Quote, VideoEmbed } from '@/components/blog'

Write your opening paragraph here. This will grab the reader's attention and set the tone for your post.

## Adding a Single Image

![Description of the image](/images/blog/2024/your-image.jpg)

## Creating an Image Gallery

Use this for multiple related images:

<ImageGallery
  columns={2}
  images={[
    { src: "/images/blog/2024/photo-1.jpg", alt: "First photo description" },
    { src: "/images/blog/2024/photo-2.jpg", alt: "Second photo description" },
    { src: "/images/blog/2024/photo-3.jpg", alt: "Third photo description" },
    { src: "/images/blog/2024/photo-4.jpg", alt: "Fourth photo description" }
  ]}
/>

## Before/After Comparison

Perfect for showing editing or transformation:

<PhotoComparison
  before="/images/blog/2024/before.jpg"
  after="/images/blog/2024/after.jpg"
  beforeLabel="Original"
  afterLabel="Edited"
/>

## Adding Quotes

<Quote author="Ansel Adams">
  A photograph is usually looked at - seldom looked into.
</Quote>

## Embedding Videos

<VideoEmbed url="https://vimeo.com/123456789" />

## Text Formatting

You can use standard markdown:

- **Bold text** using double asterisks
- *Italic text* using single asterisks
- [Links](https://example.com) using square brackets
- \`inline code\` using backticks

### Lists

1. Numbered lists
2. Like this one
3. Are automatically formatted

- Bullet points
- Work the same way
- With hyphens

## Tips for Great Blog Posts

1. Start with a compelling opening
2. Use images to break up text
3. Keep paragraphs short and readable
4. End with a call to action or conclusion

Remember to set \`published: true\` when you're ready to publish!
`
    
    // Write file
    await fs.writeFile(filepath, template)
    
    console.log(chalk.green(`✓ Created: ${filepath}`))
    console.log(chalk.blue(`\n📝 Opening in VS Code...`))
    
    // Open in VS Code
    try {
      execSync(`code ${filepath}`)
    } catch (e) {
      console.log(chalk.yellow('Could not open VS Code. Please open manually.'))
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
      
      console.log(chalk.green(`✓ Image added: ${destination}`))
      console.log(chalk.blue(`\n📋 Markdown reference:`))
      console.log(chalk.white(`![Alt text](${mdPath})`))
      
      // Copy to clipboard if possible (macOS)
      try {
        execSync(`echo "![Alt text](${mdPath})" | pbcopy`)
        console.log(chalk.gray('\n(Copied to clipboard)'))
      } catch {}
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`))
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
      console.log(chalk.yellow('No blog posts found.'))
      return
    }
    
    console.log(chalk.blue('\n📝 Blog Posts:\n'))
    
    for (const file of posts) {
      const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
      const match = content.match(/title:\s*"(.+)"/)
      const publishedMatch = content.match(/published:\s*(true|false)/)
      const title = match ? match[1] : 'Untitled'
      const isDraft = publishedMatch && publishedMatch[1] === 'false'
      
      if (isDraft && !options.drafts) continue
      
      const status = isDraft ? chalk.yellow('[DRAFT]') : chalk.green('[PUBLISHED]')
      console.log(`${status} ${file} - ${title}`)
    }
  })

program
  .command('preview')
  .description('Preview your blog locally')
  .action(() => {
    console.log(chalk.blue('🚀 Starting development server...\n'))
    execSync('npm run dev', { stdio: 'inherit' })
  })

program
  .command('publish [message]')
  .description('Commit and push your blog changes')
  .action((message = 'feat: update blog content') => {
    try {
      console.log(chalk.blue('📦 Staging blog files...'))
      execSync('git add content/blog public/images/blog')
      
      console.log(chalk.blue('💾 Committing changes...'))
      execSync(`git commit -m "${message}"`)
      
      console.log(chalk.blue('🚀 Pushing to remote...'))
      execSync('git push')
      
      console.log(chalk.green('\n✓ Blog published successfully!'))
      console.log(chalk.gray('Changes will be live in ~2 minutes.'))
    } catch (error) {
      console.error(chalk.red('Error publishing:'), error.message)
      process.exit(1)
    }
  })

program.parse(process.argv)