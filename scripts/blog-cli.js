#!/usr/bin/env node
const { program } = require('commander')
const fs = require('node:fs')
const fsp = require('node:fs/promises')
const path = require('path')
const { execSync } = require('child_process')

// Import chalk dynamically due to ESM
let chalk
;(async () => {
  chalk = (await import('chalk')).default
})()

const SEED_FILE = path.join(process.cwd(), 'src/db/seed.sql')
const IMAGES_DIR = path.join(process.cwd(), 'public/images/blog')

// Ensure directories exist
fs.mkdirSync(IMAGES_DIR, { recursive: true })

// Simple console colors as fallback
const colors = {
  green: (text) => (chalk ? chalk.green(text) : `✓ ${text}`),
  red: (text) => (chalk ? chalk.red(text) : `✗ ${text}`),
  blue: (text) => (chalk ? chalk.blue(text) : `ℹ ${text}`),
  yellow: (text) => (chalk ? chalk.yellow(text) : `⚠ ${text}`),
  gray: (text) => (chalk ? chalk.gray(text) : text),
  white: (text) => (chalk ? chalk.white(text) : text),
}

function escapeSQL(value) {
  if (value === null || value === undefined) return 'NULL'
  return "'" + String(value).replace(/'/g, "''") + "'"
}

program.name('blog').description('CLI tool for managing blog posts (D1)').version('2.0.0')

program
  .command('new <title>')
  .description('Create a new blog post as SQL INSERT in seed.sql')
  .option('-d, --draft', 'Create as draft (unpublished)')
  .option('-l, --layout <layout>', 'Layout type: single or two-column', 'single')
  .option('-a, --author <author>', 'Post author', 'Anton Bossenbroek')
  .action(async (title, options) => {
    const date = new Date().toISOString().split('T')[0]
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists in seed.sql
    const seedContent = fs.readFileSync(SEED_FILE, 'utf-8')
    if (seedContent.includes(`'${slug}'`)) {
      console.error(colors.red(`Error: Post with slug '${slug}' already exists in seed.sql!`))
      process.exit(1)
    }

    const contentTemplate =
      options.layout === 'two-column'
        ? `<article class="text-white">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
    <div class="space-y-6 text-base leading-normal">
      <h3 class="text-xl font-normal mb-3">Left Column</h3>
      <p>Left column content here.</p>
    </div>
    <div class="space-y-6 text-base leading-normal">
      <h3 class="text-xl font-normal mb-3">Right Column</h3>
      <p>Right column content here.</p>
    </div>
  </div>
</article>`
        : `<article class="text-white">
  <div class="space-y-6 text-base leading-normal">
    <p>Write your introduction here.</p>
    <h2 class="text-2xl font-normal mt-8 mb-4">Section Title</h2>
    <p>Your content goes here.</p>
  </div>
</article>`

    const sql = `
INSERT OR REPLACE INTO news (id, title, date, author, excerpt, featuredImage, tags, published, layout, content)
VALUES (
  ${escapeSQL(slug)},
  ${escapeSQL(title)},
  ${escapeSQL(date)},
  ${escapeSQL(options.author)},
  ${escapeSQL('A brief description of your post.')},
  NULL,
  ${escapeSQL('[]')},
  ${options.draft ? '0' : '1'},
  ${escapeSQL(options.layout)},
  ${escapeSQL(contentTemplate)}
);
`

    fs.appendFileSync(SEED_FILE, sql)

    console.log(colors.green(`✓ Added post '${slug}' to ${SEED_FILE}`))
    console.log(colors.blue(`\n📝 Edit the SQL in seed.sql to customize content.`))
    console.log(colors.yellow(`\n💡 To deploy: npm run blog:publish`))
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
    await fsp.mkdir(destDir, { recursive: true })

    // Determine filename
    const originalName = path.basename(imagePath)
    const filename = options.name || originalName.toLowerCase().replace(/[^a-z0-9.-]/g, '-')

    const destination = path.join(destDir, filename)

    try {
      // Copy image
      await fsp.copyFile(imagePath, destination)

      // Generate markdown reference
      const mdPath = `/images/blog/${year}/${filename}`

      console.log(colors.green(`✓ Image added: ${destination}`))
      console.log(colors.blue(`\n📋 Image path:`))
      console.log(colors.white(mdPath))

      // Copy to clipboard if possible (macOS)
      try {
        execSync(`echo "${mdPath}" | pbcopy`)
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
  .description('List all news posts in seed.sql')
  .option('-d, --drafts', 'Include drafts')
  .action(async (options) => {
    const content = fs.readFileSync(SEED_FILE, 'utf-8')
    const postRegex =
      /INSERT OR REPLACE INTO news.*?VALUES\s*\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',[\s\S]*?(\d),\s*'([^']+)'/g
    let match
    const posts = []
    while ((match = postRegex.exec(content)) !== null) {
      posts.push({
        slug: match[1],
        title: match[2],
        date: match[3],
        author: match[4],
        published: match[5] === '1',
        layout: match[6],
      })
    }

    if (posts.length === 0) {
      console.log(colors.yellow('No news posts found in seed.sql.'))
      return
    }

    console.log(colors.blue('\n📝 News Posts:\n'))

    for (const post of posts.sort((a, b) => b.date.localeCompare(a.date))) {
      if (!post.published && !options.drafts) continue
      const status = post.published ? colors.green('[PUBLISHED]') : colors.yellow('[DRAFT]')
      const layoutTag = colors.gray(`[${post.layout}]`)
      console.log(`${status} ${layoutTag} ${post.date} - ${post.title}`)
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
  .command('publish')
  .description('Apply seed.sql to D1 database (remote)')
  .option('--local', 'Apply to local D1 instead of remote')
  .action((options) => {
    try {
      const target = options.local ? '--local' : '--remote'
      console.log(colors.blue(`📦 Applying seed.sql to D1 (${options.local ? 'local' : 'remote'})...`))
      execSync(`npx wrangler d1 execute ab-photos ${target} --file=src/db/seed.sql`, {
        stdio: 'inherit',
      })
      console.log(colors.green('\n✓ News published to D1 successfully!'))
    } catch (error) {
      console.error(colors.red('Error publishing:'), error.message)
      process.exit(1)
    }
  })

// Ensure chalk is loaded before parsing
setTimeout(() => {
  program.parse(process.argv)
}, 100)
