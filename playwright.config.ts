import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8788',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true
  },
  webServer: {
    command: 'npx wrangler pages dev .vercel/output/static --port 8788 --compatibility-flag=nodejs_compat',
    url: 'http://localhost:8788',
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      CI: '1',
      FORCE_COLOR: '0',
      NO_WRANGLER_ANALYTICS: '1',
      BROWSER: 'none',
      NODE_ENV: 'test',
      CLOUDFLARE_NO_WRANGLER_ANALYTICS: '1',
      DATABASE_URL: 'test://noop',
      TESTING: 'true'
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ],
}); 
