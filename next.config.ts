import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ezclaim.storage.googleapis.com',
        pathname: '/**',
      }
    ],
  },
  output: 'standalone',
};

export default nextConfig;
