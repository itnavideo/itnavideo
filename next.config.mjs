/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for self-hosting.
  output: 'standalone',

  // Enforce no trailing slash for consistent URLs
  trailingSlash: false,

  // Allow external images from Google Cloud Storage, Cloudinary, Unsplash, Pexels, etc.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },

  outputFileTracingExcludes: {
    '/*': buildTraceExcludes(),
    '/api/*': buildTraceExcludes(),
  },

  outputFileTracingIncludes: {
    '/*': [
      './node_modules/next/dist/server/dev/browser-logs/file-logger.js',
      './node_modules/next/dist/server/dev/browser-logs/file-logger.js.map',
    ],
  },

  serverExternalPackages: [
    '@remotion/renderer',
    '@remotion/bundler',
    'ffmpeg-static',
    'ffprobe-static',
    'googleapis',
  ],

  // Skip TypeScript errors during production builds.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enable React strict mode for performance
  reactStrictMode: true,

  // Security & Response Caching Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  // Redirects for old grouped landing-page URLs. Direct video-type URLs are canonical.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'itnavideo.com',
          },
        ],
        destination: 'https://www.itnavideo.com/:path*',
        permanent: true,
      },
      {
        source: '/video-types/auto-caption-reel',
        destination: '/auto-caption-reel',
        permanent: true,
      },
      {
        source: '/video-types/compare-explainer',
        destination: '/compare-explainer',
        permanent: true,
      },
      {
        source: '/video-types/long-video-promo',
        destination: '/long-video-promo',
        permanent: true,
      },
      {
        source: '/templates',
        destination: '/video-types',
        permanent: true,
      },
      {
        source: '/templates/custom-ai-reel',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/custom-ai-reel',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/templates/auto-caption-reel',
        destination: '/auto-caption-reel',
        permanent: true,
      },
      {
        source: '/templates/compare-explainer',
        destination: '/compare-explainer',
        permanent: true,
      },
      {
        source: '/templates/long-video-promo',
        destination: '/long-video-promo',
        permanent: true,
      },
    ];
  },

};

function buildTraceExcludes() {
  return [
      '.git/**/*',
      './.git/**/*',
      '.vercel/**/*',
      './.vercel/**/*',
      'workspace/**/*',
      './workspace/**/*',
      'logs/**/*',
      './logs/**/*',
      'models/**/*',
      './models/**/*',
      'deploy-artifacts/**/*',
      './deploy-artifacts/**/*',
      'public/renders/**/*',
      './public/renders/**/*',
      'public/cache/**/*',
      './public/cache/**/*',
      'public/uploads/**/*',
      './public/uploads/**/*',
      '.next/standalone/public/uploads/**/*',
      './.next/standalone/public/uploads/**/*',
      'C:/**/*',
      './C:/**/*',
      '**/C:/**/*',
      '**/AppData/Local/Temp/**/*',
      './**/AppData/Local/Temp/**/*',
      '**/itnavideo_*.wav',
      './**/itnavideo_*.wav',
      '**/itnavideo_*.mp4',
      './**/itnavideo_*.mp4',
      '**/node_modules/@remotion/compositor-*/**/*',
      'remotion/templates/**/*',
      './remotion/templates/**/*',
      '*.log',
      './*.log',
  ];
}

export default nextConfig;
