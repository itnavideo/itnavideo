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

  // Redirects — /templates is now /video-types; old URLs get 301 redirect
  async redirects() {
    return [
      {
        source: '/templates',
        destination: '/video-types',
        permanent: true,
      },
      {
        source: '/templates/:slug',
        destination: '/video-types/:slug',
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
