import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/5712c57ea7/internal-packages/next-dev/README.md

// Set the API URL based on the execution context
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL?.includes('bossenbroek.photo')) {
  // For production builds, use the production domain
  process.env.NEXT_PUBLIC_API_URL = 'https://ab-photo.pages.dev';
  console.log('[Config] Setting production API URL:', process.env.NEXT_PUBLIC_API_URL);
}

console.log('[Config] environment: Build configuration', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  npm_lifecycle_event: process.env.npm_lifecycle_event
});

// UNCOMMENT line 21-25 when developing locally
const isDev = process.env.npm_lifecycle_event === 'dev';
console.log('isDev', isDev);
console.log('process.env.npm_lifecycle_event', process.env.npm_lifecycle_event);
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
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    remotePatterns: [
      // Ghost domains removed - no longer needed
      // {
      //   protocol: 'https',
      //   hostname: 'static.ghost.org',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'anton-photography.ghost.io',
      //   pathname: '/**',
      // },
      {
        protocol: 'https',
        hostname: 'assets.bossenbroek.photo',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ab-photo.pages.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ab-photos.pages.dev',
        pathname: '/**',
      },
      {
        // For local development
        protocol: 'http', 
        hostname: 'localhost',
        pathname: '/**',
        port: '3000',
      },
      {
        // For local development with wrangler
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
        port: '8788',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Unoptimized images during development for faster builds
  },
  typescript: {
    // !! WARN !!
    // To remove once mailchimp subscription fixed
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'bossenbroek.photo', 
        'localhost:8788', 
        'localhost:3000', 
        'ab-photo.pages.dev',
        'ab-photos.pages.dev',
        '*.ab-photos.pages.dev'
      ]
    }
  },
  // Add CORS headers for API routes
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://bossenbroek.photo" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" }
        ]
      },
      {
        // Cache control for images
        source: "/:path*.(jpg|jpeg|png|webp|avif|gif|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        // Cache control for static assets
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      }
    ];
  }
};

console.log('[Config] environment: Final configuration', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV
});

export default nextConfig;
