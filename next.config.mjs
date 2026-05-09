/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable incremental static regeneration caching for cleaner deploys
  swcMinify: true,
  // Force new builds on deployment
  onDemandEntries: {
    maxInactiveAge: 0,
    pagesBufferLength: 1,
  },
};

export default nextConfig;