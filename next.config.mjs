import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/5712c57ea7/internal-packages/next-dev/README.md

console.log('[Config] environment: Build configuration', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  npm_lifecycle_event: process.env.npm_lifecycle_event
});

// Set the API URL based on the execution context
const isDev = process.env.npm_lifecycle_event === 'dev';
// For regular NextJS dev, use port 3000, otherwise use port 8788 for wrangler
process.env.NEXT_PUBLIC_API_URL = isDev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8788';

if (process.env.NODE_ENV === 'development' || process.argv.includes('pages:dev')) {
  console.log('[Config] setupDevPlatform: Starting platform setup', {
    NODE_ENV: process.env.NODE_ENV,
    argv: process.argv,
    condition: `NODE_ENV=${process.env.NODE_ENV} || pages:dev in argv`
  });
  await setupDevPlatform();
  console.log('[Config] setupDevPlatform: Platform setup completed');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
  env: {
    // Set development API URL based on the execution environment
    NEXT_PUBLIC_API_URL: process.env.npm_lifecycle_event === 'dev' 
      ? 'http://localhost:3000' 
      : 'http://localhost:8788'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.ghost.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'anton-photography.ghost.io',
        pathname: '/**',
      },
      // Add your specific Ghost subdomain if it's different from the above
    ],
  },
  typescript: {
    // !! WARN !!
    // To remove once mailchimp subscription fixed
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['bossenbroek.photo', 'localhost:8788', 'localhost:3000']
    }
  }
};

console.log('[Config] environment: Final configuration', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV
});

export default nextConfig;
