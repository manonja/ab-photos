import { type ConsoleMessage, expect, test } from '@playwright/test'

test('home page loads without console errors or warnings', async ({ page }) => {
  console.log('Starting browser test...')

  // Create arrays to store console messages
  const consoleMessages: { type: string; text: string }[] = []

  // Listen to console events
  page.on('console', (msg: ConsoleMessage) => {
    const message = { type: msg.type(), text: msg.text() }
    consoleMessages.push(message)
    console.log('Browser console:', message)
  })

  try {
    console.log('Navigating to homepage...')
    // Navigate to the home page
    await page.goto('/')

    // Wait for the main content to be visible
    console.log('Waiting for page to load...')
    await page.waitForLoadState('networkidle')

    // Check if page loaded successfully
    const title = await page.title()
    console.log('Page title:', title)
    expect(title).toBeTruthy()

    // Filter out known benign warnings (e.g., analytics warnings in localhost)
    const benignWarningPatterns = [/Ignoring Event: localhost/, /plausible/i, /analytics/i]

    // Filter for warnings and errors (excluding benign ones)
    const warnings = consoleMessages.filter(
      (msg) =>
        msg.type === 'warning' && !benignWarningPatterns.some((pattern) => pattern.test(msg.text)),
    )
    const errors = consoleMessages.filter((msg) => msg.type === 'error')

    if (warnings.length > 0) {
      console.log('Warnings found:', warnings)
    }
    if (errors.length > 0) {
      console.log('Errors found:', errors)
    }

    // Assert no warnings or errors
    expect(warnings).toHaveLength(0)
    expect(errors).toHaveLength(0)

    // Check if images are loaded
    console.log('Checking images...')
    const images = await page.locator('img').all()
    console.log(`Found ${images.length} images`)

    for (const image of images) {
      const src = await image.getAttribute('src')
      console.log('Checking image:', src)
      const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth)
      expect(naturalWidth).toBeGreaterThan(0)
    }

    console.log('All tests passed successfully')
  } catch (error) {
    console.error('Test failed:', error)
    throw error
  }
})
