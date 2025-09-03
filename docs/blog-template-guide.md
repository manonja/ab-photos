# Blog Template Guide

This guide explains how the blog template works and how to customize your blog posts.

## Template Overview

When you run `npm run blog:new "Your Title"`, it creates a new blog post using an embedded template. The template provides a starting structure that you can customize for your content.

## Template Structure

### 1. Frontmatter (Metadata)

The frontmatter appears at the top of each blog post between `---` markers:

```yaml
---
title: "Your Title"
date: "2024-08-30"
author: "Anton Bossenbroek"
excerpt: "A brief description of your post that appears in the listing."
featuredImage: "/images/blog/2024/placeholder.jpg"
tags: ["photography"]
published: false
---
```

**Field Explanations:**
- `title`: The blog post title (automatically set from your command)
- `date`: Publication date (automatically set to today)
- `author`: Author name (default: Anton Bossenbroek)
- `excerpt`: Brief description shown in blog listing (max 160 characters for SEO)
- `featuredImage`: Hero image for the post
- `tags`: Array of relevant tags for categorization
- `published`: Set to `true` when ready to go live

### 2. Content Sections

The template includes examples of common content patterns:
- Introduction paragraph
- Section headings
- Text formatting (bold, italic)
- Image embedding
- Lists (bullet and numbered)
- Quote components
- Conclusion

## Markdown Features

### Text Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic***
```

### Headings

```markdown
## Main Section
### Subsection
```

### Images

```markdown
![Alt text](/images/blog/2024/your-photo.jpg)
```

### Lists

```markdown
Bullet points:
- First item
- Second item
- Third item

Numbered list:
1. First step
2. Second step
3. Third step
```

### Links

```markdown
[External link](https://example.com)
[Internal link](/about)
[Email link](mailto:contact@example.com)
```

## Special Components

### Quote Block

```html
<Quote author="Author Name">
This is an inspiring quote about photography.
</Quote>
```

Renders as a styled blockquote with author attribution.

### Image Gallery

```html
<ImageGallery columns={2} images={[
  { src: "/images/blog/2024/photo1.jpg", alt: "Description 1" },
  { src: "/images/blog/2024/photo2.jpg", alt: "Description 2" },
  { src: "/images/blog/2024/photo3.jpg", alt: "Description 3" },
  { src: "/images/blog/2024/photo4.jpg", alt: "Description 4" }
]} />
```

Creates a responsive image grid. Column options: 2, 3, or 4.

## Customizing the Default Template

### Option 1: Create a Custom Template File

Create a file at `/templates/blog-post-template.md` with your preferred structure:

```markdown
---
title: "Your Blog Post Title"
date: "2024-01-01"
author: "Anton Bossenbroek"
excerpt: "Your excerpt here"
featuredImage: "/images/blog/2024/featured.jpg"
tags: ["your-tags"]
published: false
---

Your custom template content here...
```

The CLI will use this template if it exists, otherwise it falls back to the embedded template.

### Option 2: Modify the CLI Script

Edit `/scripts/blog-cli.js` lines 56-107 to permanently change the embedded template.

## Complete Example: Event Photography Post

Here's a full example of a customized blog post:

```markdown
---
title: "Amsterdam Fashion Week 2024 Behind the Scenes"
date: "2024-08-30"
author: "Anton Bossenbroek"
excerpt: "An exclusive look at the energy and creativity behind Amsterdam Fashion Week's runway shows."
featuredImage: "/images/blog/2024/afw-backstage-hero.jpg"
tags: ["fashion", "event", "behind-the-scenes", "amsterdam"]
published: true
---

The backstage area at Amsterdam Fashion Week is where the real magic happens. Away from the runway lights, there's a choreographed chaos of stylists, makeup artists, and models preparing for their moment.

## The Energy Behind the Curtain

![Models getting ready backstage](/images/blog/2024/afw-models-prep.jpg)

This year's fashion week brought together emerging Dutch designers with established international brands. The atmosphere was electric, with each show bringing its own unique aesthetic and energy.

## Key Moments Captured

<ImageGallery columns={3} images={[
  { src: "/images/blog/2024/afw-makeup.jpg", alt: "Makeup artist at work" },
  { src: "/images/blog/2024/afw-styling.jpg", alt: "Last minute styling adjustments" },
  { src: "/images/blog/2024/afw-model-portrait.jpg", alt: "Model portrait before the show" },
  { src: "/images/blog/2024/afw-designer.jpg", alt: "Designer reviewing the lineup" },
  { src: "/images/blog/2024/afw-details.jpg", alt: "Close-up of garment details" },
  { src: "/images/blog/2024/afw-preparation.jpg", alt: "Final preparations" }
]} />

<Quote author="Iris van Herpen">
Fashion is an art form that moves and breathes with its wearer.
</Quote>

## Technical Approach

For these backstage shots, I focused on capturing authentic moments:

- **Lighting**: Natural light from the preparation area windows, supplemented with a small LED panel when needed
- **Lens choice**: 85mm f/1.4 for intimate portraits, 24-70mm f/2.8 for wider environmental shots
- **Camera settings**: High ISO (3200-6400) to freeze movement in low light
- **Approach**: Blend into the background, anticipate moments, respect the workers' space

## Behind Every Show

What strikes me most about fashion week is the incredible teamwork. Each model's look is the result of:

1. Hours of preparation by the design team
2. Precise coordination between stylists
3. The skill of makeup artists creating the show's aesthetic
4. Models who can transform into the designer's vision

## The Quiet Moments

![Model in contemplation before the show](/images/blog/2024/afw-quiet-moment.jpg)

Between the rush, there are moments of quiet contemplation. These are often my favorite shots – a model taking a breath before walking, a designer's nervous energy, or the satisfied smile of a makeup artist viewing their work.

## Lessons from the Runway

Photographing fashion week has taught me:

- **Preparation is key**: Know the schedule, scout locations, have backup equipment
- **Build relationships**: The best access comes from trust built over time
- **Tell the whole story**: The preparation is often more interesting than the runway
- **Respect the process**: Never interfere with the show's flow

## Final Thoughts

Amsterdam Fashion Week 2024 showcased not just clothing, but the passion and creativity of an entire industry. Being able to document these behind-the-scenes moments is a privilege that never gets old.

*Want to see more from fashion week? Check out the full gallery in my [Fashion portfolio](/work/fashion) or follow my [Instagram](https://instagram.com/antonbossenbroek) for real-time updates from events.*
```

## Tips for Writing Great Blog Posts

### Content Structure
1. **Hook readers** with a compelling opening paragraph
2. **Break up text** with images every 2-3 paragraphs
3. **Use headings** to organize content logically
4. **Include a call-to-action** at the end

### SEO Best Practices
- Write descriptive excerpts (under 160 characters)
- Use relevant tags (3-5 per post)
- Include alt text for all images
- Link to related content on your site

### Image Guidelines
- Optimize images before uploading (aim for < 2MB)
- Use descriptive filenames: `afw-backstage-models.jpg` not `IMG_1234.jpg`
- Maintain consistent dimensions for gallery images
- Featured images should be landscape orientation (16:9 or 3:2 ratio)

### Publishing Workflow
1. Create post with `npm run blog:new "Title"`
2. Edit the generated file with your content
3. Add images using `npm run blog:image path/to/image.jpg`
4. Preview with `npm run dev`
5. Set `published: true` when ready
6. Commit and push with `npm run blog:publish`

## Troubleshooting

### Common Issues

**Images not showing?**
- Ensure image paths start with `/`
- Check that images exist in `public/images/blog/`
- Use lowercase filenames without spaces

**Post not appearing?**
- Verify `published: true` is set
- Save the file and restart dev server
- Check for syntax errors in frontmatter

**Formatting looks wrong?**
- Ensure proper markdown syntax
- Check for unclosed HTML tags in components
- Verify quote marks are straight (`"`) not curly (`"`)

## Advanced Customization

### Creating New Components

While the current system supports Quote and ImageGallery components, you can add more by:

1. Defining the component pattern in `/scripts/compile-html.js`
2. Adding the HTML conversion logic
3. Documenting usage in this guide

### Modifying Styles

The blog uses Tailwind CSS classes. To change styling:
- Edit the class names in `/scripts/compile-html.js`
- Or override styles in your global CSS

Remember: The blog system is designed to be simple and maintainable. Keep customizations minimal to ensure long-term reliability.