import { expect, test } from '@playwright/test'

/**
 * Visual regression tests
 * These tests capture screenshots and compare against baseline snapshots
 */

test.describe('Visual Regression Tests', () => {
  test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for images to load
    await page.waitForTimeout(2000)

    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixelRatio: 0.1,
    })
  })

  test('about page visual snapshot', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    // Wait for images to load
    await page.waitForTimeout(2000)

    await expect(page).toHaveScreenshot('about.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixelRatio: 0.1,
    })
  })

  test('work page visual snapshot', async ({ page }) => {
    await page.goto('/work/7-rad')
    await page.waitForLoadState('networkidle')

    // Wait for images to load
    await page.waitForTimeout(2000)

    await expect(page).toHaveScreenshot('work-project.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixelRatio: 0.1,
    })
  })

  test('navigation visual consistency', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Take screenshot of navigation area
    const nav = page.locator('nav').first()
    await expect(nav).toHaveScreenshot('navigation.png', {
      threshold: 0.1,
    })
  })

  test('contact page visual snapshot', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('contact.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixelRatio: 0.1,
    })
  })
})
