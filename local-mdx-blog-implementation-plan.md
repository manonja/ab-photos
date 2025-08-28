# Local MDX Blog Implementation Plan

## Overview

This document outlines the implementation of a local MDX-based blog system for AB Photos. This solution provides a **zero-cost, developer-friendly** blogging platform that gives the client full control over content while maintaining design consistency.

**Key Benefits:**
- **$0/month** hosting cost (vs $100/month for Ghost)
- Write in Markdown with React component support
- Local preview and editing
- Images stored in project with Next.js optimization
- Simple terminal commands for blog management
- Full version control with Git

## Architecture

```
ab-photos/
├── content/
│   └── blog/                    # MDX blog posts
│       ├── 2024-01-15-fashion-week.mdx
│       ├── 2024-02-01-portrait-session.mdx
│       └── _template.mdx        # Post template
├── public/
│   └── images/
│       └── blog/               # Blog images
│           ├── 2024/
│           │   ├── fashion-week-hero.jpg
│           │   └── backstage-1.jpg
│           └── 2025/
├── scripts/
│   └── blog-cli.js            # CLI tool for blog management
└── src/
    ├── components/
    │   └── blog/              # MDX components
    │       ├── ImageGallery.tsx
    │       ├── PhotoComparison.tsx
    │       └── index.ts
    └── lib/
        └── blog/              # Blog utilities
            ├── types.ts
            ├── mdx-components.tsx
            └── index.ts
```

## Implementation Steps

### Step 1: Install Dependencies

```bash
# MDX support
npm install @next/mdx @mdx-js/loader @mdx-js/react

# Content processing
npm install gray-matter reading-time

# CLI tool
npm install commander chalk

# Image optimization (optional)
npm install sharp

# Development types
npm install -D @types/mdx
```

### Step 2: Configure Next.js for MDX

Update `next.config.mjs`:
```javascript
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    // ... existing image config
  },
  // ... other existing config
}

export default withMDX(nextConfig)
```

### Step 3: Create Blog Types

`src/lib/blog/types.ts`:
```typescript
export interface BlogFrontmatter {
  title: string
  date: string
  author: string
  excerpt: string
  featuredImage: string
  tags: string[]
  published?: boolean
}

export interface BlogPost extends BlogFrontmatter {
  slug: string
  content: React.ComponentType
  readingTime: string
}

export interface BlogImageProps {
  src: string
  alt: string
  caption?: string
}
```

### Step 4: Create MDX Components

`src/components/blog/ImageGallery.tsx`:
```typescript
import Image from 'next/image'

interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: 1 | 2 | 3 | 4
  spacing?: 'tight' | 'normal' | 'loose'
}

export function ImageGallery({ 
  images, 
  columns = 3, 
  spacing = 'normal' 
}: ImageGalleryProps) {
  const gapClass = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-8'
  }[spacing]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} ${gapClass} my-8`}>
      {images.map((image, index) => (
        <figure key={index} className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes={`(max-width: 768px) 100vw, ${100/columns}vw`}
            />
          </div>
          {image.caption && (
            <figcaption className="text-sm text-gray-600 mt-2 text-center">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
```

`src/components/blog/PhotoComparison.tsx`:
```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PhotoComparisonProps {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
}

export function PhotoComparison({ 
  before, 
  after, 
  beforeLabel = 'Before', 
  afterLabel = 'After' 
}: PhotoComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.min(100, Math.max(0, percentage)))
  }

  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-lg my-8 cursor-col-resize"
         onMouseMove={handleMove}>
      {/* Before Image */}
      <div className="absolute inset-0">
        <Image src={before} alt={beforeLabel} fill className="object-cover" />
        <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded">
          {beforeLabel}
        </div>
      </div>
      
      {/* After Image */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image src={after} alt={afterLabel} fill className="object-cover" />
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded">
          {afterLabel}
        </div>
      </div>
      
      {/* Slider Line */}
      <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
           style={{ left: `${sliderPosition}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5L3 10l5 5V5zm4 0v10l5-5-5-5z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
```

`src/components/blog/index.ts`:
```typescript
export { ImageGallery } from './ImageGallery'
export { PhotoComparison } from './PhotoComparison'
export { VideoEmbed } from './VideoEmbed'
export { Quote } from './Quote'
export { PhotoGrid } from './PhotoGrid'
```

### Step 5: Create Blog CLI Tool

`scripts/blog-cli.js`:
```javascript
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
    
    // Read template
    const templatePath = path.join(BLOG_DIR, '_template.mdx')
    let template = await fs.readFile(templatePath, 'utf-8')
    
    // Replace placeholders
    template = template
      .replace('YOUR_TITLE_HERE', title)
      .replace('YOUR_SLUG_HERE', slug)
      .replace('YOUR_DATE_HERE', date)
      .replace('published: false', `published: ${!options.draft}`)
    
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
    const monthDir = new Date().toISOString().slice(0, 7)
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
      
      // Copy to clipboard if possible
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
```

### Step 6: Create Blog Post Template

`content/blog/_template.mdx`:
```mdx
---
title: "YOUR_TITLE_HERE"
slug: "YOUR_SLUG_HERE"
date: "YOUR_DATE_HERE"
author: "Anton Bossenbroek"
excerpt: "A brief description of your post that will appear in listings (max 160 characters)"
featuredImage: "/images/blog/2024/featured.jpg"
tags: ["photography", "event"]
published: false
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
- `inline code` using backticks

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

Remember to set `published: true` when you're ready to publish!
```

### Step 7: Create Blog Loading Utilities

`src/lib/blog/index.ts`:
```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { BlogPost, BlogFrontmatter } from './types'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

// Dynamic import function for MDX files
async function loadMDXFile(filename: string) {
  const module = await import(`@/content/blog/${filename}`)
  return module.default
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(BLOG_DIR)
  
  const posts = await Promise.all(
    files
      .filter(file => file.endsWith('.mdx') && !file.startsWith('_'))
      .map(async (file) => {
        const filePath = path.join(BLOG_DIR, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(fileContent)
        
        const frontmatter = data as BlogFrontmatter
        const slug = file.replace(/\.mdx$/, '')
        const MDXContent = await loadMDXFile(file)
        
        return {
          ...frontmatter,
          slug,
          content: MDXContent,
          readingTime: readingTime(content).text,
        } as BlogPost
      })
  )
  
  return posts
    .filter(post => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    const frontmatter = data as BlogFrontmatter
    const MDXContent = await loadMDXFile(`${slug}.mdx`)
    
    return {
      ...frontmatter,
      slug,
      content: MDXContent,
      readingTime: readingTime(content).text,
    } as BlogPost
  } catch (error) {
    return null
  }
}

export async function getBlogTags(): Promise<string[]> {
  const posts = await getAllBlogPosts()
  const tagSet = new Set<string>()
  
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}
```

### Step 8: Create MDX Components Wrapper

`src/lib/blog/mdx-components.tsx`:
```typescript
import Image from 'next/image'
import Link from 'next/link'
import { ImageGallery, PhotoComparison, Quote, VideoEmbed, PhotoGrid } from '@/components/blog'

// Define custom components for MDX
export const components = {
  // Override default elements
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src) return null
    return (
      <figure className="my-8">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
        {alt && (
          <figcaption className="text-sm text-gray-600 text-center mt-2">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  },
  
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (!href) return <>{children}</>
    
    const isInternal = href.startsWith('/')
    
    if (isInternal) {
      return (
        <Link href={href} className="text-blue-600 hover:underline">
          {children}
        </Link>
      )
    }
    
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    )
  },
  
  // Custom components available in MDX
  ImageGallery,
  PhotoComparison,
  Quote,
  VideoEmbed,
  PhotoGrid,
}
```

### Step 9: Update Package.json Scripts

Add to `package.json`:
```json
{
  "scripts": {
    // ... existing scripts
    "blog": "node scripts/blog-cli.js",
    "blog:new": "node scripts/blog-cli.js new",
    "blog:image": "node scripts/blog-cli.js add-image",
    "blog:list": "node scripts/blog-cli.js list",
    "blog:preview": "node scripts/blog-cli.js preview",
    "blog:publish": "node scripts/blog-cli.js publish"
  }
}
```

### Step 10: Client Workflow Documentation

Create `docs/blog-workflow.md`:
```markdown
# Blog Workflow Guide

## Quick Start Commands

```bash
# Create new post
npm run blog:new "My Amazing Post Title"

# Add an image
npm run blog:image ~/Desktop/photo.jpg

# Preview locally
npm run blog:preview

# Publish to live site
npm run blog:publish
```

## Shell Shortcuts

Add these to your `~/.zshrc` or `~/.bashrc`:

```bash
# Blog shortcuts
alias blog='cd ~/Projects/ab-photos && npm run blog'
alias bnew='cd ~/Projects/ab-photos && npm run blog:new'
alias bimg='cd ~/Projects/ab-photos && npm run blog:image'
alias bpub='cd ~/Projects/ab-photos && npm run blog:publish'
```

## Writing Your First Post

1. **Create a new post:**
   ```bash
   bnew "Amsterdam Fashion Week 2024"
   ```

2. **The post will open in VS Code with a template**

3. **Add images:**
   - Drag images to your terminal and run: `bimg [path]`
   - Or manually copy to: `public/images/blog/2024/`

4. **Write your content using Markdown and components**

5. **Preview your post:**
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3000/news

6. **Publish when ready:**
   ```bash
   bpub
   ```

## Available Components

### Image Gallery
```mdx
<ImageGallery
  columns={3}
  images={[
    { src: "/images/blog/2024/photo1.jpg", alt: "Description" },
    { src: "/images/blog/2024/photo2.jpg", alt: "Description" },
    { src: "/images/blog/2024/photo3.jpg", alt: "Description" }
  ]}
/>
```

### Before/After Comparison
```mdx
<PhotoComparison
  before="/images/blog/2024/before.jpg"
  after="/images/blog/2024/after.jpg"
/>
```

### Quote
```mdx
<Quote author="Person Name">
  This is an inspiring quote about photography.
</Quote>
```

### Video Embed
```mdx
<VideoEmbed url="https://vimeo.com/123456789" />
```

## Tips

- Set `published: false` while drafting
- Use descriptive image filenames
- Keep excerpts under 160 characters
- Add 3-5 relevant tags
- Images are automatically optimized
```

## Implementation Timeline

| Phase | Task | Time | Commit Message |
|-------|------|------|----------------|
| 1 | Install dependencies | 5 min | `feat: add MDX dependencies and configuration` |
| 2 | Create blog structure | 10 min | `feat: create blog directory structure and types` |
| 3 | Build CLI tool | 20 min | `feat: implement blog CLI tool for post management` |
| 4 | Create components | 30 min | `feat: create MDX blog components (ImageGallery, etc)` |
| 5 | Blog utilities | 15 min | `feat: add blog data loading utilities` |
| 6 | Update routes | 20 min | `feat: integrate MDX blog with news routes` |
| 7 | Add template | 10 min | `feat: add blog post template and example` |
| 8 | Documentation | 10 min | `docs: add client documentation and shortcuts` |
| 9 | Cleanup | 10 min | `chore: remove Ghost dependencies` |

**Total: ~2 hours**

## Success Metrics

- ✅ Client can create new post in < 30 seconds
- ✅ Images handled with simple drag & drop
- ✅ Local preview available instantly
- ✅ Publish with single command
- ✅ Zero monthly costs
- ✅ All content version controlled
- ✅ Design consistency maintained

## Next Steps After Implementation

1. Create first example post together with client
2. Set up shell shortcuts
3. Brief walkthrough of components
4. Test full workflow end-to-end
5. Remove Ghost environment variables

This implementation provides a robust, cost-effective, and developer-friendly blogging solution that perfectly matches the client's technical comfort level.