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
