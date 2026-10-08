import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvLocal } from './load-env-local.mjs';
import fs from 'node:fs';
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadEnvLocal(rootDir);

const region = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'us-east-1';
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || 'remotion-render-4-0-467-mem3008mb-disk2048mb-900sec';
const bucketName = process.env.REMOTION_LAMBDA_BUCKET_NAME || 'remotionlambda-useast1-2zq6twaok1';
const serveUrl = process.env.REMOTION_LAMBDA_SERVE_URL || 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html';

console.log('--- Real Image to Video AI Pipeline Test with Realistic Images & S3 Audio ---');

// 1. Get realistic images from reusable-assets.json
const assetsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'lib/generated/reusable-assets.json'), 'utf8'));
const realisticAssets = (assetsJson.assets || [])
  .filter(a => a.type === 'image' && a.safeToUse && a.src.toLowerCase().includes('/realistic/'))
  .slice(0, 3);

console.log('Found realistic assets:', realisticAssets.map(a => a.src));

// 2. Build real scenes
const scenes = [
  {
    id: 'scene-1',
    startSeconds: 0,
    endSeconds: 3.5,
    imageUrl: realisticAssets[0]?.src || '/assets/reusable/images/realistic/istockphoto-623667888-612x612.jpg',
    cameraMotion: 'zoom-in',
    transition: 'dissolve',
    title: 'Realistic AI Scene 01',
    fitMode: 'cover',
  },
  {
    id: 'scene-2',
    startSeconds: 3.5,
    endSeconds: 7.0,
    imageUrl: realisticAssets[1]?.src || '/assets/reusable/images/realistic/istockphoto-2193342338-612x612.jpg',
    cameraMotion: 'pan-left',
    transition: 'push-left',
    title: 'Realistic AI Scene 02',
    fitMode: 'cover',
  }
];

const inputProps = {
  mediaSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  bgmUrl: '',
  bgmVolume: 0.15,
  scenes,
  captions: [
    { start: 0.2, end: 3.2, text: 'Real realistic image generation and parallax testing.' },
    { start: 3.6, end: 6.8, text: 'Seamless transition across realistic AI visuals in 1080p.' }
  ],
  subtitleChunks: [
    { start: 0.2, end: 3.2, text: 'Real realistic image generation and parallax testing.' },
    { start: 3.6, end: 6.8, text: 'Seamless transition across realistic AI visuals in 1080p.' }
  ],
  sfxEvents: [],
  durationSeconds: 7.0,
  title: 'Realistic Image to Video Test',
  subtitleStyle: 'parallax-modern',
  fitMode: 'cover',
};

const totalFrames = Math.ceil(7.0 * 30);

console.log('Dispatching render to AWS Lambda with realistic local assets...');
const render = await renderMediaOnLambda({
  region,
  functionName,
  serveUrl,
  composition: 'IMAGE-TO-VIDEO-AI',
  codec: 'h264',
  audioCodec: 'aac',
  inputProps,
  frameRange: [0, totalFrames - 1],
  privacy: 'public',
  deleteAfter: '1-day',
  downloadBehavior: { type: 'download', fileName: 'test-realistic.mp4' },
  framesPerLambda: 120,
});

console.log('Render dispatched! ID:', render.renderId);

let isDone = false;
while (!isDone) {
  await new Promise(r => setTimeout(r, 2000));
  const progress = await getRenderProgress({
    region,
    bucketName: render.bucketName,
    functionName,
    renderId: render.renderId,
  });

  const percent = Math.round((progress.overallProgress || 0) * 100);
  console.log(`Progress: ${percent}% | Done: ${progress.done}`);

  if (progress.errors && progress.errors.length > 0) {
    console.error('Errors encountered on Lambda workers:');
    console.error(JSON.stringify(progress.errors, null, 2));
    process.exit(1);
  }

  if (progress.done) {
    isDone = true;
    console.log('✅ RENDER SUCCEEDED! Output MP4 URL:');
    console.log(progress.outputFile);
  }
}
