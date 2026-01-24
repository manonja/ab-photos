import { PlaywrightTestConfig } from '@playwright/test';

// Build wrangler command with --binding flags for Worker runtime env vars
// Note: webServer.env passes vars to the Node.js wrangler process, but NOT to
// the Cloudflare Worker runtime (V8 isolate). Use --binding for Worker bindings.
const buildWranglerCommand = (): string => {
  const baseCmd =
    'npx wrangler pages dev .vercel/output/static --port 8788 --compatibility-flag=nodejs_compat';
  const bindings: string[] = [];

  if (process.env.DATABASE_URL) {
    bindings.push(`--binding DATABASE_URL=${process.env.DATABASE_URL}`);
  }
  if (process.env.DIRECT_URL) {
    bindings.push(`--binding DIRECT_URL=${process.env.DIRECT_URL}`);
  }

  return bindings.length > 0 ? `${baseCmd} ${bindings.join(' ')}` : baseCmd;
};

const config: PlaywrightTestConfig = {
  testDir: './src/integration-tests',
  timeout: 60000,
  snapshotDir: './src/integration-tests/__snapshots__',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
    },
  },
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
    command: buildWranglerCommand(),
    port: 8788,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: {
      CI: '1',
      FORCE_COLOR: '0',
      NO_WRANGLER_ANALYTICS: '1',
      BROWSER: 'none',
    },
  },
};

export default config; 