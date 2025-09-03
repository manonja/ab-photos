# Blog Creation Guide

This guide explains how to create blog posts using the HTML-based blog system.

## Quick Start

### Create a New Blog Post

```bash
# Single column layout (default)
npm run blog:new "My First Post"

# Two column layout
npm run blog:new "Technical Guide" --layout two-column

# Create as draft
npm run blog:new "Work in Progress" --draft
```

### List All Posts

```bash
npm run blog:list        # List published posts
npm run blog:list -d     # Include drafts
```

### Preview Locally

```bash
npm run dev              # Start development server
# Visit http://localhost:3000/news
```

## Blog Post Structure

Blog posts are HTML files stored in `/content/blog/` with the naming convention:
`YYYY-MM-DD-slug.html`

### Basic Template (Single Column)

```html
<!-- 
title: "Your Post Title"
slug: "url-friendly-slug"
date: "2025-01-15"
author: "Your Name"
excerpt: "Brief 1-2 sentence description for the listing page"
tags: ["photography", "technique"]
published: true
layout: "single"
-->

<article class="text-white">
  <h1 class="text-4xl font-normal uppercase mb-2">Your Post Title</h1>
  <div class="font-light italic text-gray-400 mb-8">January 15, 2025</div>
  
  <div class="my-8 h-px bg-gray-300 w-full max-w-[80%]"></div>
  
  <div class="space-y-6 text-base leading-normal">
    <p>Your introduction paragraph here.</p>
    
    <h2 class="text-2xl font-normal mt-8 mb-4">Section Title</h2>
    <p>Section content...</p>
  </div>
</article>
```

### Two Column Template

```html
<!-- Same frontmatter with layout: "two-column" -->

<article class="text-white">
  <h1 class="text-4xl font-normal uppercase mb-2">Your Post Title</h1>
  <div class="font-light italic text-gray-400 mb-8">January 15, 2025</div>
  
  <div class="my-8 h-px bg-gray-300 w-full"></div>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
    <div class="space-y-6 text-base leading-normal">
      <h3 class="text-xl font-normal mb-3">Left Column</h3>
      <p>Left column content...</p>
    </div>
    
    <div class="space-y-6 text-base leading-normal">
      <h3 class="text-xl font-normal mb-3">Right Column</h3>
      <p>Right column content...</p>
    </div>
  </div>
</article>
```

## Available HTML Elements

### Text Formatting
- **Paragraphs**: `<p>Your text</p>`
- **Bold**: `<strong class="font-semibold">bold text</strong>`
- **Italic**: `<em class="italic">italic text</em>`
- **Links**: `<a href="#" class="text-blue-400 hover:underline">link text</a>`

### Headings
- **Main sections**: `<h2 class="text-2xl font-normal mt-8 mb-4">Section Title</h2>`
- **Subsections**: `<h3 class="text-xl font-normal mb-3">Subsection Title</h3>`

### Lists
```html
<!-- Unordered list -->
<ul class="list-disc list-inside space-y-2 ml-4">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<!-- Ordered list -->
<ol class="list-decimal list-inside space-y-2 ml-4">
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>
```

### Images
```html
<!-- Basic image -->
<img src="/images/blog/2025/photo.jpg" alt="Description" class="w-full rounded-lg my-6">

<!-- Figure with caption -->
<figure class="my-8">
  <img src="/images/blog/2025/photo.jpg" alt="Description" class="w-full rounded-lg">
  <figcaption class="text-sm text-gray-400 mt-2 text-center">Image caption</figcaption>
</figure>
```

## Frontmatter Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| title | Yes | Post title | "Understanding Light" |
| slug | Yes | URL-friendly identifier | "understanding-light" |
| date | Yes | Publication date (YYYY-MM-DD) | "2025-01-15" |
| author | Yes | Author name | "Anton Bossenbroek" |
| excerpt | Yes | Brief description for listings | "A guide to natural vs artificial light" |
| tags | Yes | Array of tags | ["photography", "technique"] |
| published | Yes | Whether post is live | true or false |
| layout | No | Layout type | "single", "two-column", or "mixed" |

## Typography & Spacing Rules

Consistent with the work pages styling:
- **Main title**: `text-4xl font-normal uppercase`
- **Date**: `font-light italic text-gray-400`
- **Section headings**: `text-2xl font-normal mt-8 mb-4`
- **Body text**: `text-base leading-normal`
- **Paragraph spacing**: `space-y-6`
- **Dividers**: `h-px bg-gray-300`

## Publishing Workflow

1. **Create post**: `npm run blog:new "Title"`
2. **Edit content**: The file opens automatically in VS Code
3. **Preview**: `npm run dev` and visit `/news/your-slug`
4. **Publish**: Change `published: false` to `published: true`
5. **Deploy**: `git add . && git commit -m "feat: add new post" && git push`

## Best Practices

1. **Keep excerpts concise**: 1-2 sentences max
2. **Use semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
3. **Optimize images**: Keep under 500KB, use appropriate dimensions
4. **Test responsiveness**: Check on mobile and desktop
5. **Consistent styling**: Follow the typography rules above
6. **Draft first**: Start with `published: false` until ready

## Image Management

Store images in `/public/images/blog/YYYY/` where YYYY is the current year.

```bash
# Add an image to your blog
npm run blog:image path/to/your/image.jpg

# This will:
# 1. Copy the image to the correct directory
# 2. Give you the markdown path to use
```

## Technical Notes

- The blog system uses a build-time compiler (`scripts/compile-html.js`)
- Posts are compiled to JSON at build time for edge runtime compatibility
- No database or external CMS required (zero monthly costs)
- Full version control with Git
- Works with Cloudflare Pages edge runtime