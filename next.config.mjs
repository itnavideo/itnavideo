/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for self-hosting.
  output: 'standalone',

  // Enforce no trailing slash for consistent URLs
  trailingSlash: false,

  // Allow external images from Google Cloud Storage, Cloudinary, Unsplash, Pexels, etc.
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
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

  // Skip ESLint errors during production builds.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enable React strict mode for performance
  reactStrictMode: true,

  // Security & Response Caching Headers
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },

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
        source: '/blog/kinetic-typography-reel-maker-commercial-guide',
        destination: '/blog/ai-shorts-polisher-commercial-creation-guide',
        permanent: true,
      },
      {
        source: '/blog/commercial-real-estate-listing-stats-typography',
        destination: '/blog/luxury-real-estate-video-marketing-ai-guide',
        permanent: true,
      },
      {
        source: '/blog/what-is-auto-captioning',
        destination: '/blog/how-auto-captions-increase-reels-engagement-2026',
        permanent: true,
      },
      {
        source: '/blog/convert-any-text-to-realistic-video-with-ai',
        destination: '/blog/how-to-convert-script-text-to-ai-video-online',
        permanent: true,
      },
      {
        source: '/blog/use-your-own-photos-videos-audio-ai-shorts',
        destination: '/blog/how-to-make-ai-shorts-using-your-own-photos-and-voice',
        permanent: true,
      },
      {
        source: '/blog/add-ai-voiceovers-to-videos-without-editor',
        destination: '/blog/how-to-add-ai-voiceovers-to-videos-without-editing',
        permanent: true,
      },
      {
        source: '/blog/best-caption-styles-for-reels',
        destination: '/blog/viral-caption-styles-for-instagram-reels-and-shorts',
        permanent: true,
      },
      {
        source: '/blog/difference-between-subtitles-and-captions',
        destination: '/blog/subtitles-vs-captions-which-to-use-for-social-video',
        permanent: true,
      },
      {
        source: '/blog/ai-videogenerator-tools-for-educators',
        destination: '/blog/best-ai-video-generator-tools-for-educators',
        permanent: true,
      },
      {
        source: '/blog/best-ai-video-gen-tools-for-youtube-shorts',
        destination: '/blog/best-ai-video-generator-tools-for-youtube-shorts',
        permanent: true,
      },
      {
        source: '/blog/what-to-do-when-itnavideo-video-takes-longer-to-generate',
        destination: '/blog/cloud-video-rendering-speed-and-optimization-guide',
        permanent: true,
      },
      {
        source: '/blog/does-itnavideo-have-a-monthly-video-duration-limit',
        destination: '/blog/ai-video-duration-limits-and-credit-usage-explained',
        permanent: true,
      },
      {
        source: '/blog/voice-to-video-ai-tools',
        destination: '/blog/best-voice-to-video-ai-tools-for-social-content',
        permanent: true,
      },
      {
        source: '/blog/best-realistic-text-to-speech-ai-social-media-videos-2026',
        destination: '/blog/realistic-text-to-speech-ai-voiceover-guide-2026',
        permanent: true,
      },
      {
        source: '/blog/how-to-make-whiteboard-reels-in-itnavideo',
        destination: '/blog/how-to-make-viral-whiteboard-animation-reels',
        permanent: true,
      },
      {
        source: '/auto-caption-reel',
        destination: '/auto-caption',
        permanent: true,
      },
      {
        source: '/auto-captions',
        destination: '/auto-caption',
        permanent: true,
      },
      {
        source: '/typography-video',
        destination: '/video-types/ai-shorts-polisher',
        permanent: true,
      },
      {
        source: '/video-types/typography-video',
        destination: '/video-types/ai-shorts-polisher',
        permanent: true,
      },
      {
        source: '/long-caption-pro',
        destination: '/video-types/youtube-subtitles',
        permanent: true,
      },
      {
        source: '/video-types/long-caption-pro',
        destination: '/video-types/youtube-subtitles',
        permanent: true,
      },
      {
        source: '/video-types/long-video-pro',
        destination: '/video-types/long-video-clips',
        permanent: true,
      },
      {
        source: '/caption-studio',
        destination: '/auto-caption',
        permanent: true,
      },
      {
        source: '/video-types/caption-studio',
        destination: '/auto-caption',
        permanent: true,
      },
      {
        source: '/create',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/videos',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/promote-and-earn',
        destination: '/pricing',
        permanent: true,
      },

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
