/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential for server-side heavy lifting
  serverExternalPackages: ['firebase-admin', 'fluent-ffmpeg', 'openai', 'cloudinary'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Adding Google User images for Auth avatars
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Optimized for Render/Vercel
  output: 'standalone',

  // Build speed optimizations for YC-level speed
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Security & Video performance headers
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
};

export default nextConfig;