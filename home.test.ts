import { test, expect, chromium, ConsoleMessage } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';

let wranglerProcess: ChildProcess;

test.beforeAll(async () => {
  console.log('Starting wrangler in non-interactive mode...');
  
  // Start wrangler pages dev in the background with non-interactive mode
  wranglerProcess = spawn('npx', ['wrangler', 'pages', 'dev', '.vercel/output/static', '--port', '8788'], {
    stdio: 'pipe',
    shell: true,
    env: {
      ...process.env,
      CI: '1',                    // Ensures CI mode
      FORCE_COLOR: '0',           // Disables color output
      NO_WRANGLER_ANALYTICS: '1', // Disables analytics prompts
      BROWSER: 'none',            // Prevents browser auto-opening
      WRANGLER_LOG_LEVEL: 'none'  // Minimize logging
    }
  });

  // Log wrangler output for debugging
  if (wranglerProcess.stdout) {
    wranglerProcess.stdout.on('data', (data: Buffer) => {
      console.log('Wrangler output:', data.toString());
    });
  }
  if (wranglerProcess.stderr) {
    wranglerProcess.stderr.on('data', (data: Buffer) => {
      console.error('Wrangler error:', data.toString());
    });
  }

  // Wait for wrangler to start (looking for the ready message in stdout)
  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for wrangler to start'));
      }, 30000);

      if (wranglerProcess.stdout) {
        wranglerProcess.stdout.on('data', (data: Buffer) => {
          const output = data.toString();
          if (output.includes('Ready on')) {
            clearTimeout(timeout);
            resolve();
          }
        });
      } else {
        reject(new Error('Failed to start wrangler process: stdout is null'));
      }

      wranglerProcess.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`Wrangler process error: ${err.message}`));
      });

      wranglerProcess.on('exit', (code) => {
        if (code !== null && code !== 0) {
          clearTimeout(timeout);
          reject(new Error(`Wrangler process exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error('Error during wrangler startup:', error);
    throw error;
  }

  console.log('Wrangler started successfully');
  // Give it a little extra time to fully initialize
  await new Promise(resolve => setTimeout(resolve, 2000));
});

test.afterAll(async () => {
  console.log('Cleaning up wrangler process...');
  if (wranglerProcess) {
    wranglerProcess.kill();
    console.log('Wrangler process terminated');
  }
});

test('home page loads without console errors or warnings', async () => {
  console.log('Starting browser test...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Create arrays to store console messages
  const consoleMessages: { type: string; text: string }[] = [];

  // Listen to console events
  page.on('console', (msg: ConsoleMessage) => {
    const message = { type: msg.type(), text: msg.text() };
    consoleMessages.push(message);
    console.log('Browser console:', message);
  });

  try {
    console.log('Navigating to homepage...');
    // Navigate to the home page
    await page.goto('http://localhost:8788');

    // Wait for the main content to be visible
    console.log('Waiting for page to load...');
    await page.waitForLoadState('networkidle');

    // Check if page loaded successfully
    const title = await page.title();
    console.log('Page title:', title);
    expect(title).toBeTruthy();

    // Filter for warnings and errors
    const warnings = consoleMessages.filter(msg => msg.type === 'warning');
    const errors = consoleMessages.filter(msg => msg.type === 'error');

    if (warnings.length > 0) {
      console.log('Warnings found:', warnings);
    }
    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }

    // Assert no warnings or errors
    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);

    // Check if images are loaded
    console.log('Checking images...');
    const images = await page.locator('img').all();
    console.log(`Found ${images.length} images`);
    
    for (const image of images) {
      const src = await image.getAttribute('src');
      console.log('Checking image:', src);
      
      // Test CORS headers for external images
      if (src && src.startsWith('https://assets.bossenbroek.photo')) {
        const response = await fetch(src, { method: 'HEAD' });
        console.log('CORS Headers for', src, ':', {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
          'access-control-allow-headers': response.headers.get('access-control-allow-headers')
        });
      }
      
      const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }

    console.log('All tests passed successfully');
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('Browser closed');
  }
}); 