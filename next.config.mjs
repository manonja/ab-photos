import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/5712c57ea7/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // To remove once mailchimp subscription fixed
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/js/script.js',
  //       destination: 'https://wandering-math-49d0.anton-bossenbroek.workers.dev/js/script.js',
  //     },
  //     {
  //       source: '/api/event',
  //       destination: 'https://wandering-math-49d0.anton-bossenbroek.workers.dev/api/event',
  //     },
  //   ];
  // }
};

export default nextConfig;
