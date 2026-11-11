import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { enableTailwind } from '@remotion/tailwind';
import { mkdir, readFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entryPoint = path.join(rootDir, 'remotion', 'index.tsx');
const outputDir = path.join(rootDir, 'public', 'renders');
const outputLocation = path.join(outputDir, 'itnavideo-yc-saas-demo.mp4');

// Load environment variables from .env.local
const envContent = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf8');
const getEnv = (k) => {
  const match = envContent.match(new RegExp('^' + k + '=(.*)$', 'm'));
  return match ? match[1].trim() : null;
};

const cloudName = getEnv('CLOUDINARY_CLOUD_NAME') || 'dhouh9idx';
const apiKey = getEnv('CLOUDINARY_API_KEY') || '';
const apiSecret = getEnv('CLOUDINARY_API_SECRET') || '';
if (!apiKey || !apiSecret) {
  console.error('❌ CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set in .env.local');
  process.exit(1);
}

console.log('🚀 Step 1/3: Bundling Remotion video composition...');
await mkdir(outputDir, { recursive: true });

const serveUrl = await bundle({
  entryPoint,
  webpackOverride: (config) => enableTailwind(config),
});

console.log('🎬 Step 2/3: Rendering 1080p Full HD video locally...');
const composition = await selectComposition({
  serveUrl,
  id: 'SAAS-PRODUCT-DEMO',
});

const totalFrames = composition.durationInFrames;
console.log(`🎥 Total Frames: ${totalFrames} (${totalFrames / 30} seconds at 30 FPS)`);

await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation,
  concurrency: 2, // Smooth, safe rendering speed
  overwrite: true,
  logLevel: 'info',
  onProgress: ({ progress }) => {
    process.stdout.write(`\rRendering progress: ${Math.round(progress * 100)}% complete`);
  },
});

console.log(`\n✅ Local render complete: ${outputLocation}`);

console.log('☁️ Step 3/3: Uploading video to Cloudinary (folder: itnavideo12345)...');
const fileBuffer = await readFile(outputLocation);
const timestamp = Math.round(Date.now() / 1000);
const folder = 'itnavideo12345';
const publicId = 'itnavideo-yc-saas-demo';

const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex');

const form = new FormData();
form.append('file', new Blob([fileBuffer]), 'itnavideo-yc-saas-demo.mp4');
form.append('api_key', apiKey);
form.append('timestamp', timestamp.toString());
form.append('folder', folder);
form.append('public_id', publicId);
form.append('signature', signature);

const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
  method: 'POST',
  body: form,
});

const uploadData = await uploadRes.json();

if (uploadData.secure_url) {
  console.log('\n🎉 SUCCESS! Video is now permanently saved on Cloudinary:');
  console.log(`🔗 URL: ${uploadData.secure_url}`);
  console.log(`📁 Folder: ${uploadData.folder || folder}`);
  console.log(`⏱️ Duration: ${uploadData.duration}s`);
  console.log(`📐 Resolution: ${uploadData.width}x${uploadData.height}`);
} else {
  console.error('\n❌ Cloudinary upload error:', uploadData.error || uploadData);
  process.exit(1);
}
