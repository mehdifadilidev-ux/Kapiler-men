/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  transpilePackages: ['@kpil/shared'],
};

module.exports = nextConfig;
