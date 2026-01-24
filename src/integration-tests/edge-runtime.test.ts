import { expect, test } from '@playwright/test'

/**
 * E2E tests for edge runtime verification
 * These tests ensure that the application runs correctly on Cloudflare's edge runtime
 */

test.describe('Edge Runtime Smoke Tests', () => {
  test('API routes respond on edge runtime', async ({ request }) => {
    // Test the health check endpoint
    const response = await request.get('/api/hello')
    expect(response.ok()).toBeTruthy()

    const text = await response.text()
    expect(text).toBe('Hello World')
  })

  test('projects API returns valid data', async ({ request }) => {
    const response = await request.get('/api/projects')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(Array.isArray(data)).toBeTruthy()
  })

  test('page renders without hydration errors', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for hydration errors in the page content
    const hydrationError = await page.evaluate(() => {
      return (
        document.body.innerHTML.includes('Hydration failed') ||
        document.body.innerHTML.includes('There was an error while hydrating')
      )
    })
    expect(hydrationError).toBe(false)
  })

  test('work page loads without errors', async ({ page }) => {
    await page.goto('/work/7-rad')
    await page.waitForLoadState('networkidle')

    // Verify the page title is present
    const title = await page.title()
    expect(title).toBeTruthy()

    // Check for any JavaScript errors
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    // Wait a bit for any delayed errors
    await page.waitForTimeout(1000)
    expect(errors).toHaveLength(0)
  })

  test('about page renders correctly on edge', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    // Verify key content is present
    const heading = await page.locator('h2').first()
    await expect(heading).toBeVisible()
  })

  test('edge runtime returns proper headers', async ({ request }) => {
    const response = await request.get('/api/hello')
    expect(response.ok()).toBeTruthy()

    // Verify response headers
    const headers = response.headers()
    expect(headers['content-type']).toContain('text/plain')
  })
})
