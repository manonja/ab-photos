# GitHub-as-CMS Implementation Plan for AB Photos

## Executive Summary

This document outlines the implementation of a GitHub-based content management system to replace Ghost CMS. This solution provides a **free, simple, and maintainable** approach for managing blog content while preserving all existing styling and components.

**Key Benefits:**
- **$0/month** hosting cost (vs $100/month for Ghost)
- No external dependencies or services to manage
- Full version control for all content
- Simple markdown-based editing
- Images stored directly in GitHub
- Maintains all existing design and components

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  GitHub Repo    │ ───────►│   Next.js App    │ ───────►│  Cloudflare     │
│  (Content)      │  API    │  (Build Time)    │  Deploy │  (Your Site)    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
     │                             │                            │
     │                             │                            │
     ▼                             ▼                            ▼
  Markdown Files              Fetch & Render               Static Site
  + Images                    at Build Time                Served Globally
```

## Implementation Plan

### Phase 1: GitHub Repository Setup (30 minutes)

#### 1.1 Create Content Repository
```bash
# Repository name: ab-photos-content
# Structure:
content/
├── news/
│   ├── _template.md
│   └── 2024-01-15-example-post.md
└── images/
    └── .gitkeep
```

#### 1.2 Post Template
Create `content/news/_template.md`:
```markdown
---
title: "Your Post Title Here"
slug: "url-friendly-slug-here"
date: "2024-01-15"
author: "Anton Bossenbroek"
excerpt: "A brief description of your post (max 160 characters)"
featuredImage: "../images/featured-image.jpg"
tags: ["photography", "event", "portrait"]
published: false
---

Write your post content here using Markdown...

## Adding Images

![Image description](../images/your-image.jpg)

## Formatting Options

**Bold text** and *italic text*

- Bullet points
- Another point

1. Numbered lists
2. Another item

> Quotes look like this

[Links to other sites](https://example.com)
```

#### 1.3 Repository Settings
- [ ] Create repository on GitHub
- [ ] Add client as collaborator with write access
- [ ] Enable GitHub Pages (Settings → Pages → Source: main branch)
- [ ] Create initial example post

### Phase 2: Next.js Integration (2-3 hours)

#### 2.1 Install Dependencies
```bash
npm install gray-matter react-markdown remark-gfm rehype-raw
npm install -D @types/react-markdown
```

#### 2.2 Environment Configuration
Add to `.env.local`:
```env
# GitHub Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO_OWNER=username
GITHUB_REPO_NAME=ab-photos-content

# Public vars for client-side image URLs
NEXT_PUBLIC_GITHUB_REPO_OWNER=username
NEXT_PUBLIC_GITHUB_REPO_NAME=ab-photos-content
```

Add to `.env.example`:
```env
# GitHub CMS Configuration
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-content-repo-name
NEXT_PUBLIC_GITHUB_REPO_OWNER=your-github-username
NEXT_PUBLIC_GITHUB_REPO_NAME=your-content-repo-name
```

#### 2.3 Create GitHub CMS Client
Create `/src/lib/github-cms/types.ts`:
```typescript
export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  published: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}
```

Create `/src/lib/github-cms/client.ts`:
```typescript
import matter from 'gray-matter';
import { Post, GitHubFile } from './types';

export class GitHubCMSClient {
  private token = process.env.GITHUB_TOKEN;
  private owner = process.env.GITHUB_REPO_OWNER;
  private repo = process.env.GITHUB_REPO_NAME;
  private baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`;

  private async fetchGitHub(path: string) {
    const response = await fetch(`${this.baseUrl}/${path}`, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('[GitHub CMS] API error:', response.status, response.statusText);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  async getPosts(): Promise<Post[]> {
    try {
      console.log('[GitHub CMS] Fetching posts from GitHub');
      
      const files: GitHubFile[] = await this.fetchGitHub('contents/content/news');
      
      const markdownFiles = files.filter(
        (file) => file.name.endsWith('.md') && !file.name.startsWith('_')
      );

      const posts = await Promise.all(
        markdownFiles.map(async (file) => {
          const slug = file.name.replace('.md', '');
          return this.getPost(slug);
        })
      );

      const publishedPosts = posts
        .filter((post): post is Post => post !== null && post.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      console.log('[GitHub CMS] Successfully fetched posts', { count: publishedPosts.length });
      return publishedPosts;
    } catch (error) {
      console.error('[GitHub CMS] Error fetching posts:', error);
      return [];
    }
  }

  async getPost(slug: string): Promise<Post | null> {
    try {
      console.log('[GitHub CMS] Fetching post:', slug);
      
      const file: GitHubFile = await this.fetchGitHub(`contents/content/news/${slug}.md`);
      
      if (!file.content) {
        throw new Error('No content in file');
      }

      const content = Buffer.from(file.content, 'base64').toString('utf-8');
      const { data, content: markdownContent } = matter(content);

      const post: Post = {
        title: data.title || 'Untitled',
        slug: data.slug || slug,
        date: data.date || new Date().toISOString(),
        author: data.author || 'Anton Bossenbroek',
        excerpt: data.excerpt || '',
        featuredImage: this.processImageUrl(data.featuredImage),
        tags: data.tags || [],
        published: data.published ?? false,
        content: this.processContent(markdownContent),
      };

      console.log('[GitHub CMS] Successfully fetched post:', slug);
      return post;
    } catch (error) {
      console.error('[GitHub CMS] Error fetching post:', error);
      return null;
    }
  }

  async getTags(): Promise<string[]> {
    const posts = await this.getPosts();
    const tagSet = new Set<string>();
    
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await this.getPosts();
    return posts.filter((post) => 
      post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  private processImageUrl(url: string): string {
    if (!url) return '';
    
    // Handle relative paths from the content repo
    if (url.startsWith('../images/')) {
      return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/content${url.substring(2)}`;
    }
    
    return url;
  }

  private processContent(content: string): string {
    // Process image URLs in the content
    return content.replace(
      /!\[([^\]]*)\]\((\.\.\/images\/[^)]+)\)/g,
      (match, alt, url) => {
        const fullUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/content${url.substring(2)}`;
        return `![${alt}](${fullUrl})`;
      }
    );
  }
}

// Export singleton instance
export const githubCMS = new GitHubCMSClient();
```

#### 2.4 Create Markdown Renderer
Create `/src/lib/github-cms/markdown.tsx`:
```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import Link from 'next/link';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={`prose prose-lg prose-gray max-w-none ${className}`}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Custom image component with Next.js Image optimization
        img: ({ node, ...props }) => {
          const src = props.src || '';
          const alt = props.alt || '';

          return (
            <div className="relative w-full my-8">
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg shadow-md"
                loading="lazy"
                unoptimized={src.includes('github')} // GitHub images don't support optimization
              />
            </div>
          );
        },
        
        // Internal links use Next.js Link
        a: ({ href, children }) => {
          const isInternal = href?.startsWith('/');
          
          if (isInternal && href) {
            return (
              <Link href={href} className="text-blue-600 hover:underline">
                {children}
              </Link>
            );
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
          );
        },
        
        // Typography styling that matches your existing design
        h1: ({ children }) => (
          <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600">
            {children}
          </blockquote>
        ),
        code: ({ inline, className, children }) => {
          if (inline) {
            return (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          }
          return (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code className={className}>{children}</code>
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

### Phase 3: Update Existing Routes (1-2 hours)

#### 3.1 Update News Listing Page
Modify `/src/app/news/page.tsx`:
```typescript
// Replace Ghost imports
// import { ghostClient } from '@/lib/ghost/client';
import { githubCMS } from '@/lib/github-cms/client';

export default async function NewsPage() {
  // Replace Ghost call
  // const posts = await ghostClient.getPosts({ filter: 'tag:-news' });
  const posts = await githubCMS.getPosts();

  // Rest of your component remains exactly the same
  return (
    <>
      {/* Your existing JSX */}
    </>
  );
}
```

#### 3.2 Update Individual Post Page
Modify `/src/app/news/[slug]/page.tsx`:
```typescript
import { githubCMS } from '@/lib/github-cms/client';
import { MarkdownRenderer } from '@/lib/github-cms/markdown';

export async function generateStaticParams() {
  const posts = await githubCMS.getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function NewsPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await githubCMS.getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Keep your existing component structure
  return (
    <>
      {/* Your existing PostHeader component */}
      <PostHeader post={post} />
      
      {/* Replace Ghost HTML content with markdown */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MarkdownRenderer content={post.content} />
      </div>
    </>
  );
}
```

#### 3.3 Update Tag Pages
Modify `/src/app/news/tag/[slug]/page.tsx`:
```typescript
import { githubCMS } from '@/lib/github-cms/client';

export default async function NewsTagPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const posts = await githubCMS.getPostsByTag(params.slug);
  
  // Rest remains the same
}
```

### Phase 4: Configure Next.js (15 minutes)

#### 4.1 Update Image Configuration
Add to `next.config.mjs`:
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      // ... existing patterns
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
    ],
  },
};
```

#### 4.2 Update Git Ignore
Add to `.gitignore`:
```
# GitHub CMS
.env.local
```

### Phase 5: Client Documentation (30 minutes)

#### 5.1 Quick Start Guide
Create `docs/github-cms-guide.md`:
```markdown
# GitHub CMS Quick Start Guide

## Overview
Your blog content is now managed through GitHub. This guide shows you how to create and publish blog posts.

## Adding a New Blog Post

### Step 1: Access Your Content Repository
1. Go to: https://github.com/[your-username]/ab-photos-content
2. Navigate to the `content/news/` folder

### Step 2: Create a New Post
1. Click "Create new file"
2. Name your file using this format: `2024-01-15-post-title.md`
   - Always start with the date (YYYY-MM-DD)
   - Use hyphens instead of spaces
   - End with `.md`

### Step 3: Copy the Template
Copy this template and customize:

```markdown
---
title: "Your Amazing Post Title"
slug: "your-amazing-post-title"
date: "2024-01-15"
author: "Anton Bossenbroek"
excerpt: "A brief description that appears in the post list (keep under 160 characters)"
featuredImage: "../images/featured-photo.jpg"
tags: ["photography", "portrait", "event"]
published: true
---

Start writing your post content here...
```

### Step 4: Add Images

#### Option A: Upload to Repository (Recommended)
1. Navigate to `content/images/` folder
2. Click "Upload files"
3. Drag and drop your images
4. Click "Commit changes"
5. In your post, reference: `![Description](../images/your-image.jpg)`

#### Option B: Use External Images
Simply use the full URL: `![Description](https://example.com/image.jpg)`

### Step 5: Preview and Publish
1. Set `published: false` while writing (draft mode)
2. When ready, change to `published: true`
3. Click "Commit changes"
4. Your post will be live in ~2 minutes

## Writing in Markdown

### Basic Formatting
- **Bold**: `**text**` → **text**
- *Italic*: `*text*` → *text*
- [Link](url): `[text](url)`

### Headings
```
## Large Heading
### Medium Heading
#### Small Heading
```

### Lists
```
- Bullet point
- Another point

1. Numbered item
2. Another item
```

### Quotes
```
> This is a quote
```

### Images
```
![Image description](../images/photo.jpg)
```

## Best Practices

### Image Guidelines
- Optimize images before uploading (max 2MB per image)
- Use descriptive filenames: `amsterdam-fashion-week-2024.jpg`
- Include alt text for accessibility

### SEO Tips
- Write compelling excerpts (they appear in search results)
- Use relevant tags
- Choose descriptive slugs (URLs)

### File Naming
- Always use lowercase
- Replace spaces with hyphens
- Include dates for posts

## Troubleshooting

### Post Not Appearing?
- Check `published: true` is set
- Wait 2-3 minutes for build
- Ensure filename ends with `.md`

### Images Not Loading?
- Check file path is correct
- Ensure image is committed to repository
- Use relative paths: `../images/`

## Need Help?
Contact your developer with any questions or issues.
```

### Phase 6: Deployment Checklist (1 hour)

#### 6.1 Pre-Deployment Tasks
- [ ] Create GitHub personal access token (Settings → Developer → Tokens)
- [ ] Set up content repository with example post
- [ ] Configure environment variables
- [ ] Test locally with `npm run dev`
- [ ] Verify image loading
- [ ] Check markdown rendering

#### 6.2 Clean Up Ghost
```bash
# Remove Ghost dependencies
npm uninstall @tryghost/content-api

# Remove Ghost client files
rm -rf src/lib/ghost

# Update imports in all affected files
```

#### 6.3 Update CLAUDE.md
Add section about GitHub CMS:
```markdown
### Blog Content Management
- Content stored in GitHub repository: `ab-photos-content`
- Posts written in Markdown format
- Images stored in repository or external URLs
- Client guide: `/docs/github-cms-guide.md`
```

#### 6.4 Testing Checklist
- [ ] Create test post in GitHub
- [ ] Verify post appears on `/news`
- [ ] Click through to individual post
- [ ] Check image rendering
- [ ] Test tag filtering
- [ ] Verify SEO meta tags
- [ ] Check build performance
- [ ] Test on mobile devices

### Phase 7: Optional Enhancements

#### 7.1 Admin Interface (Future Enhancement)
```typescript
// Simple form for creating posts via web UI
// Can be added later if command-line git becomes a barrier
```

#### 7.2 Preview Mode
```typescript
// Add preview functionality for unpublished posts
// Useful for reviewing before publishing
```

#### 7.3 Search Functionality
```typescript
// Implement client-side search across posts
// Can search titles, content, tags
```

## Cost Analysis

| Service | Old (Ghost) | New (GitHub) | Savings |
|---------|-------------|--------------|---------|
| CMS Hosting | $100/month | $0 | $100/month |
| Image Storage | Included | Free (GitHub) | - |
| API Calls | Limited | Unlimited | - |
| **Total** | **$100/month** | **$0/month** | **$100/month** |

**Annual Savings: $1,200**

## Benefits Summary

1. **Zero Cost**: Completely free solution
2. **Simple**: No servers or databases to manage
3. **Version Control**: Full history of all edits
4. **Backup**: Content automatically backed up in Git
5. **Performance**: Static generation = fast loading
6. **Flexibility**: Easy to migrate or enhance later
7. **Developer Friendly**: Plain text files, standard tools

## Support & Maintenance

### Regular Tasks
- Monitor GitHub API rate limits (very generous for your usage)
- Occasionally update dependencies
- Help client with any markdown questions

### Monitoring
- Set up GitHub Actions for build notifications
- Monitor build times in Cloudflare Pages
- Check for any API errors in logs

This implementation provides a robust, free, and maintainable solution for blog content management while preserving all existing functionality and design.