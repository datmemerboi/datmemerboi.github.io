/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['github.com', 'github.githubassets.com'],
    unoptimized: true
  }
};

module.exports = nextConfig;
