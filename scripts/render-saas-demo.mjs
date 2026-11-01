import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { enableTailwind } from '@remotion/tailwind';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entryPoint = path.join(rootDir, 'remotion', 'index.tsx');
const outputDir = path.join(rootDir, 'public', 'renders');
const outputLocation = path.join(outputDir, 'itnavideo-yc-saas-demo.mp4');

await mkdir(outputDir, { recursive: true });

console.log('📦 Bundling Remotion SAAS Product Demo composition...');
const serveUrl = await bundle({
  entryPoint,
  webpackOverride: (config) => enableTailwind(config),
});

console.log('🎬 Selecting SAAS-PRODUCT-DEMO composition...');
const composition = await selectComposition({
  serveUrl,
  id: 'SAAS-PRODUCT-DEMO',
});

console.log(`🎥 Rendering 1080p MP4 (${composition.durationInFrames} frames / ${composition.durationInFrames / 30}s)...`);
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation,
  concurrency: 1, // Safe memory footprint
  overwrite: true,
  logLevel: 'info',
  onProgress: ({ progress }) => {
    process.stdout.write(`\rProgress: ${Math.round(progress * 100)}% rendered`);
  },
});

console.log(`\n✅ Render complete! Video saved to: ${outputLocation}`);
