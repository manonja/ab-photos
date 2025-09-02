# Blog Creation Quick Guide

## Quick Start: Create and Publish a Blog Post

### 1. Create New Post
```bash
npm run blog:new "My Photography Adventure"
```
This creates a new file: `content/blog/2025-09-02-my-photography-adventure.mdx`

### 2. Add Your Photo
```bash
npm run blog:image ~/Desktop/sunset-photo.jpg
```
Output example:
```
✓ Image copied to: public/images/blog/2025/sunset-photo.jpg
✓ Markdown to paste: ![sunset-photo](/images/blog/2025/sunset-photo.jpg)
```

### 3. Edit Your Post
The file automatically opens in VS Code. Update:
- `excerpt`: Brief description (max 160 chars)
- `featuredImage`: Change to your photo path
- `tags`: Add relevant tags
- Content: Write your post using the provided markdown

### 4. Preview Locally
```bash
npm run dev
```
Visit: http://localhost:3000/news

### 5. Publish
When ready:
1. Set `published: true` in the frontmatter
2. Save the file
3. Run:
```bash
npm run blog:publish
```

## Complete Example

```markdown
---
title: "Sunset Photography at the Beach"
date: "2025-09-02"
author: "Anton Bossenbroek"
excerpt: "Capturing the golden hour at Amsterdam beach with dramatic clouds and vibrant colors."
featuredImage: "/images/blog/2025/beach-sunset.jpg"
tags: ["landscape", "sunset", "beach", "tutorial"]
published: true
---

Yesterday's sunset at the beach was absolutely stunning. The clouds created perfect patterns for a dramatic sky.

![Beach sunset with dramatic clouds](/images/blog/2025/beach-sunset.jpg)

## Camera Settings

For this shot, I used:
- **Camera**: Canon R5
- **Lens**: 24-70mm f/2.8
- **Settings**: ISO 100, f/8, 1/125s
- **Focal length**: 35mm

The key was waiting for the right moment when the sun dipped below the clouds...
```

## Essential Commands

| Task | Command |
|------|---------|
| Create post | `npm run blog:new "Title"` |
| Add image | `npm run blog:image path/to/image.jpg` |
| List posts | `npm run blog:list` |
| Preview | `npm run dev` |
| Publish | `npm run blog:publish` |

## Troubleshooting

### Post Not Showing?
- Check `published: true` is set
- Save the file
- Refresh browser

### Image Not Loading?
- Verify path starts with `/`
- Check image exists in `public/images/blog/`
- Use lowercase filenames without spaces

### Navigation Not Working?
- Clear cache: `rm -rf .next`
- Restart dev server: `npm run dev`

## Quick Tips

1. **Image Optimization**: Keep images under 2MB
2. **SEO**: Write compelling excerpts under 160 characters
3. **Tags**: Use 3-5 relevant tags per post
4. **Markdown**: Use `**bold**` and `*italic*` for emphasis
5. **Preview**: Always preview before publishing

## Zero-Cost Benefits

✅ No monthly fees (vs $100/month Ghost)  
✅ Full version control with Git  
✅ Fast static site performance  
✅ Complete ownership of content  
✅ Simple markdown workflow  