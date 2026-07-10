/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [],
  
  // Standalone output for self-hosting.
  output: 'standalone',

  outputFileTracingExcludes: {
    '/*': buildTraceExcludes(),
    '/api/*': buildTraceExcludes(),
  },

  outputFileTracingIncludes: {
    '/*': [
      './node_modules/next/dist/server/dev/browser-logs/file-logger.js',
      './node_modules/next/dist/server/dev/browser-logs/file-logger.js.map',
    ],
    '/api/reels/jobs': [
      './node_modules/@remotion/compositor-*/*',
    ],
  },

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

  // Redirects for old grouped landing-page URLs. Direct video-type URLs are canonical.
  async redirects() {
    return [
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
      '*.log',
      './*.log',
  ];
}

export default nextConfig;
