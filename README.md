This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### Prerequisites

- Node.js 18.x or later
- npm 10.x or later
- A Cloudflare account
- Wrangler CLI installed globally (`npm install -g wrangler`)

## Environment Setup

This project requires certain environment variables to be set up before running. Follow these steps to configure your environment:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your actual configuration:
   - Database settings
   - API keys
   - Server configuration

3. Make sure never to commit the `.env` file to version control.

## Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| DIRECT_URL | Direct PostgreSQL connection URL | postgresql://user:pass@host:5432/db |
| DATABASE_URL | Pooled PostgreSQL connection URL | postgresql://user:pass@host:5432/db?pooled=true |
| NEXT_PUBLIC_API_URL | Public API endpoint URL | https://api.yourdomain.com |
| NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID | Mailchimp audience/list ID | abc123def |
| NEXT_PUBLIC_MAILCHIMP_API_KEY | Mailchimp API key | 1234567890abcdef-us1 |
| NEXT_PUBLIC_MAILCHIMP_API_SERVER | Mailchimp API server region | us1 |
| NEXT_PUBLIC_MAILCHIMP_URL | Mailchimp form submission URL | https://your-form.mailchimp.com |
| NEXT_PUBLIC_CONTACT_FORM_URL | Contact form submission endpoint | https://api.yourdomain.com/contact |
| PORT | Application port | 3000 |
| NODE_ENV | Environment name | development |

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ab-photos-live
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# Database URLs (Neon PostgreSQL)
DIRECT_URL="your-direct-postgresql-url"
DATABASE_URL="your-pooled-postgresql-url"

# API and Public URLs
NEXT_PUBLIC_API_URL="your-api-url"

# Mailchimp Configuration (if using newsletter features)
NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID="your-audience-id"
NEXT_PUBLIC_MAILCHIMP_API_KEY="your-api-key"
NEXT_PUBLIC_MAILCHIMP_API_SERVER="your-server-region"
NEXT_PUBLIC_MAILCHIMP_URL="your-mailchimp-form-url"
NEXT_PUBLIC_CONTACT_FORM_URL="your-contact-form-url"
```

### Development Workflow

1. Start the development server:
```bash
npm run dev
```
This runs Next.js in development mode with hot reloading at [http://localhost:3000](http://localhost:3000)

2. Preview Cloudflare Pages locally:
```bash
npm run preview
```
This builds and runs your application in an environment that matches Cloudflare Pages

3. Build for production:
```bash
npm run pages:build
```
This creates an optimized production build in the `.vercel/output` directory

4. Run tests:
```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
```

### Cloudflare Development

1. Authenticate with Cloudflare:
```bash
wrangler login
```

1. Run changes locally with wrangler,

```bash
npm run dev:wrangler
```

2. Deploy to Cloudflare Pages:
```bash
npm run deploy
```

### Debugging

- Use Chrome DevTools with the development server (a debugger is enabled at default port)
- Check the `.vercel/output` directory for build output
- View build logs with `wrangler pages deployment tail`

### Best Practices

1. Always test your changes locally using both:
   - `npm run dev` for rapid development
   - `npm run preview` to ensure Cloudflare compatibility

2. Check for type errors:
```bash
npm run lint
```

3. Run tests before deploying:
```bash
npm run test
```

4. Use the appropriate environment variables for local development vs production

## Cloudflare integration

Besides the `dev` script mentioned above `c3` has added a few extra scripts that allow you to integrate the application with the [Cloudflare Pages](https://pages.cloudflare.com/) environment, these are:
  - `pages:build` to build the application for Pages using the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI
  - `preview` to locally preview your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
  - `deploy` to deploy your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

> __Note:__ while the `dev` script is optimal for local development you should preview your Pages application as well (periodically or before deployments) in order to make sure that it can properly work in the Pages environment (for more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md#recommended-workflow))

### Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

You can use bindings during development, when previewing locally your application and of course in the deployed application:

- To use bindings in dev mode you need to define them in the `next.config.js` file under `setupDevBindings`, this mode uses the `next-dev` `@cloudflare/next-on-pages` submodule. For more details see its [documentation](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md).

- To use bindings in the preview mode you need to add them to the `pages:preview` script accordingly to the `wrangler pages dev` command. For more details see its [documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) or the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

- To use bindings in the deployed application you will need to configure them in the Cloudflare [dashboard](https://dash.cloudflare.com/). For more details see the  [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

#### KV Example

`c3` has added for you an example showing how you can use a KV binding.

In order to enable the example:
- Search for javascript/typescript lines containing the following comment:
  ```ts
  // KV Example:
  ```
  and uncomment the commented lines below it.
- Do the same in the `wrangler.toml` file, where
  the comment is:
  ```
  # KV Example:
  ```
- If you're using TypeScript run the `cf-typegen` script to update the `env.d.ts` file:
  ```bash
  npm run cf-typegen
  # or
  yarn cf-typegen
  # or
  pnpm cf-typegen
  # or
  bun cf-typegen
  ```

After doing this you can run the `dev` or `preview` script and visit the `/api/hello` route to see the example in action.

Finally, if you also want to see the example work in the deployed application make sure to add a `MY_KV_NAMESPACE` binding to your Pages application in its [dashboard kv bindings settings section](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section). After having configured it make sure to re-deploy your application.

## Contributing

### Testing Guidelines

We use a comprehensive testing strategy combining Jest for unit/integration tests and Playwright for E2E testing. Here are our testing conventions and best practices:

#### 1. Component Testing with React Testing Library

We use React Testing Library for testing React components. Tests should focus on user behavior rather than implementation details.

Example component test:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoCard } from '../PhotoCard';

describe('PhotoCard', () => {
  const defaultProps = {
    title: 'Test Photo',
    imageUrl: '/test.jpg',
  };

  it('renders photo card with required props', () => {
    render(<PhotoCard {...defaultProps} />);
    
    expect(screen.getByRole('heading')).toHaveTextContent(defaultProps.title);
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultProps.imageUrl);
  });

  it('calls onView when view button is clicked', () => {
    const onView = jest.fn();
    render(<PhotoCard {...defaultProps} onView={onView} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onView).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. API Route Testing

API routes are tested using Jest with proper mocking of database calls and external services.

Example API test:
```typescript
import { GET } from './route';
import { sql } from '@/db/client';

jest.mock('@/db/client', () => ({
  sql: jest.fn(),
}));

describe('GET /api/photos/featured', () => {
  it('returns featured photos successfully', async () => {
    const mockPhotos = [
      { id: '1', desktop_blob: 'photo1.jpg', sequence: 1 },
    ];
    (sql as jest.Mock).mockResolvedValueOnce(mockPhotos);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockPhotos);
  });

  it('handles errors gracefully', async () => {
    (sql as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const response = await GET();
    expect(response.status).toBe(500);
  });
});
```

#### 3. E2E Testing with Playwright

We use Playwright for end-to-end testing of critical user flows.

Example E2E test:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Featured Photos', () => {
  test('displays featured photos on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="featured-photos"]');

    const photos = page.locator('article');
    await expect(photos).toHaveCount(await photos.count());

    // Test interaction
    const firstPhoto = photos.first();
    await firstPhoto.click();
    await expect(page).toHaveURL(/.*\/photos\/.*/);
  });
});
```

#### 4. Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

#### 5. Testing Best Practices

1. **Component Tests**
   - Test user interactions and rendered output
   - Use semantic queries (getByRole, getByLabelText)
   - Mock minimal dependencies

2. **API Tests**
   - Mock database calls and external services
   - Test success and error cases
   - Verify response status and data structure

3. **E2E Tests**
   - Focus on critical user flows
   - Use data-testid for stable selectors
   - Test loading, success, and error states

### Logging Best Practices

We follow a structured logging approach to ensure consistency and debuggability across the application. Here are our logging conventions:

#### 1. Log Prefixes and Context

- Use source prefixes to identify the log origin:
  ```typescript
  // In API routes
  console.log('[API] routeName: message', context);
  
  // In server actions
  console.log('[Action] actionName: message', context);
  ```

#### 2. Log Structure

Each log should follow this pattern:
```typescript
console.log('[Source] functionName: descriptiveMessage', {
    // Context object with relevant data
    param1,
    param2,
    // Add derived data when useful
    resultCount: results.length
});
```

#### 3. Logging Levels

Use appropriate logging levels:
- `console.log()` for general flow and successful operations
- `console.warn()` for handled issues (e.g., non-OK responses)
- `console.error()` for errors and exceptions

#### 4. Request Lifecycle Logging

For each operation, log the following stages:
```typescript
// 1. Starting the operation
console.log('[Source] operation: Starting request', { params });

// 2. Important steps
console.log('[Source] operation: Performing step', { stepDetails });

// 3. Successful completion
console.log('[Source] operation: Successfully completed', { results });

// 4. Error handling
console.warn('[Source] operation: Non-OK response', { 
    status,
    statusText,
    // Include relevant context
    params 
});

// 5. Error cases
console.error('[Source] operation: Error occurred', {
    error,
    // Include all relevant parameters
    params
});
```

#### 5. Context Objects

Always include relevant context as a second parameter:
```typescript
// Good
console.log('[API] getPhoto: Fetching photo', { photoId, userId });

// Avoid
console.log('[API] getPhoto: Fetching photo', photoId); // Missing context
console.log(`[API] getPhoto: Fetching photo ${photoId}`); // String interpolation
```

#### 6. Error Logging

When logging errors, include full context:
```typescript
try {
    // Operation
} catch (error) {
    console.error('[Source] operation: Error occurred', {
        error,
        // Include all parameters that led to the error
        params,
        // Include any relevant state
        state
    });
}
```

#### 7. Response Status Logging

For API responses, log both success and failure cases:
```typescript
if (!response.ok) {
    console.warn('[Source] operation: Non-OK response', {
        status: response.status,
        statusText: response.statusText,
        // Include request parameters
        params
    });
} else {
    console.log('[Source] operation: Success response', {
        // Include relevant response data
        resultCount: data.length,
        // Include request parameters
        params
    });
}
```

These practices ensure:
- Consistent log format across the application
- Easy filtering and searching in log aggregators
- Sufficient context for debugging issues
- Clear operation lifecycle tracking
- Proper error tracking and debugging

### Best Practices (continued)
