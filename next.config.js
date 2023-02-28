/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['github.com', 'github.githubassets.com'],
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : ''
};

module.exports = nextConfig;
