# Blog Workflow Guide

## Quick Start Commands

```bash
# Create new post
npm run blog:new "My Amazing Post Title"

# Add an image
npm run blog:image ~/Desktop/photo.jpg

# Preview locally
npm run dev

# Publish to live site
npm run blog:publish
```

## Shell Shortcuts

Add these to your `~/.zshrc` or `~/.bashrc`:

```bash
# Blog shortcuts
alias blog='cd ~/Documents_local/Websites/ab-photos && npm run blog'
alias bnew='cd ~/Documents_local/Websites/ab-photos && npm run blog:new'
alias bimg='cd ~/Documents_local/Websites/ab-photos && npm run blog:image'
alias bpub='cd ~/Documents_local/Websites/ab-photos && npm run blog:publish'
alias blist='cd ~/Documents_local/Websites/ab-photos && npm run blog:list'
```

## Writing Your First Post

1. **Create a new post:**
   ```bash
   bnew "Amsterdam Fashion Week 2024"
   ```
   This creates a new file with today's date and opens it in VS Code.

2. **The post will open with a template ready to edit**

3. **Add images:**
   - Option A: Use the CLI tool
     ```bash
     bimg ~/Desktop/photo.jpg
     ```
   - Option B: Manually copy to: `public/images/blog/2024/`
   - The CLI will show you the markdown to paste

4. **Write your content using simple Markdown**

5. **Preview your post:**
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3000/news

6. **Publish when ready:**
   - Set `published: true` in the frontmatter
   - Save the file
   - Run:
     ```bash
     bpub
     ```

## Available Components

### Quote
```markdown
<Quote author="Person Name">
This is an inspiring quote about photography.
</Quote>
```

### Image Gallery
```markdown
<ImageGallery columns={2} images={[
  { src: "/images/blog/2024/photo1.jpg", alt: "Description" },
  { src: "/images/blog/2024/photo2.jpg", alt: "Description" }
]} />
```

## Markdown Basics

### Headings
```markdown
## Section Heading
### Subsection
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
***Bold and italic***
```

### Links
```markdown
[Link text](https://example.com)
[Internal link](/about)
```

### Images
```markdown
![Alt text](/images/blog/2024/photo.jpg)
```

### Lists
```markdown
- Bullet point
- Another point

1. Numbered item
2. Another item
```

## Best Practices

### Image Guidelines
- Optimize images before uploading (aim for < 2MB)
- Use descriptive filenames: `amsterdam-fashion-week-backstage.jpg`
- Always include alt text for accessibility
- Recommended dimensions: 2048px on longest side

### SEO Tips
- Write compelling excerpts (they appear in search results and social shares)
- Use 3-5 relevant tags
- Choose descriptive titles
- Keep excerpts under 160 characters

### File Naming
- Always use lowercase
- Replace spaces with hyphens
- Files are named automatically with date: `2024-01-15-post-title.mdx`

## Troubleshooting

### Post Not Appearing?
- Check `published: true` is set
- Save the file
- Run `npm run dev` and check for compilation
- Refresh your browser

### Images Not Loading?
- Check file path is correct (starts with `/`)
- Ensure image is in `public/images/blog/`
- Use lowercase filenames
- Avoid spaces in filenames

### VS Code Not Opening?
- Install VS Code command line tools
- Or manually open: `code ~/Documents_local/Websites/ab-photos/content/blog/`

## Advanced Tips

### Draft Posts
- Keep `published: false` while writing
- Use `npm run blog:list --drafts` to see all posts including drafts

### Multiple Images at Once
```bash
# Add multiple images
for img in ~/Desktop/*.jpg; do
  npm run blog:image "$img"
done
```

### Quick Edit
```bash
# Open most recent post
code content/blog/$(ls -t content/blog/*.mdx | head -1)
```

## Zero-Cost Blog Benefits

- **No monthly fees** - Unlike Ghost ($100/month), this costs $0
- **Full control** - All content stored in your repository
- **Version control** - Every change is tracked in Git
- **Fast performance** - Static HTML generation
- **Simple workflow** - Write in Markdown, publish with Git

## Support

If you encounter any issues:
1. Check the terminal for error messages
2. Verify all files are saved
3. Try `npm run dev` to see detailed errors
4. The blog automatically compiles when you run dev or build