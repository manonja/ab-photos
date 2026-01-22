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

// For regular NextJS dev, use port 3000
const isDev = process.env.npm_lifecycle_event === 'dev';
if (isDev) {
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    remotePatterns: [
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
        port: '8787',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development',
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
        'localhost:8787',
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
