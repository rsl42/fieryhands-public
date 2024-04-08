const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['images.unsplash.com']
  },
  async rewrites() {
    return [
      {
          source: '/update',
          destination: '/new'
      }
    ];
  }
}

module.exports = nextConfig
