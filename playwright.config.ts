import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src/integration-tests',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:8788',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npx wrangler dev --no-bundle --no-watch',
    port: 8788,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: {
      CI: '1',
      FORCE_COLOR: '0',
      NO_WRANGLER_ANALYTICS: '1',
      BROWSER: 'none'
    },
  },
};

export default config; 