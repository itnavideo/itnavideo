const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'itnavideo-app';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side packages (Firebase-admin needs this sometimes in standalone mode)
  serverExternalPackages: ['firebase-admin', 'fluent-ffmpeg'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Optimized for Render/Vercel
  output: 'standalone',

  // Skip TypeScript errors during production builds.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: `https://${firebaseProjectId}.firebaseapp.com/__/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
