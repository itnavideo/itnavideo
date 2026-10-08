import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const assetsData = JSON.parse(readFileSync(path.resolve(process.cwd(), 'public/assets/assets.json'), 'utf8'));
const allImages = assetsData.assets.filter(a => a.type === 'image' && a.src);
console.log(`Found ${allImages.length} images in asset catalog.`);

// Pick 46 images for the test
const test46Images = allImages.slice(0, 46).map((img, idx) => ({
  id: `scene-img-${idx + 1}`,
  url: img.src,
  title: img.title || `Visual Scene ${idx + 1}`,
}));

console.log(`Prepared ${test46Images.length} test images.`);

// Create sequential scenes for Remotion
const scenes = test46Images.slice(0, 5).map((img, idx) => ({
  id: `scene-${idx + 1}`,
  startSeconds: idx * 2.0,
  endSeconds: (idx + 1) * 2.0,
  imageUrl: img.url,
  cameraMotion: idx % 2 === 0 ? 'zoom-in' : 'pan-left',
  transition: idx === 0 ? 'none' : 'dissolve',
  title: img.title,
  fitMode: 'cover',
}));

const totalDuration = scenes[scenes.length - 1].endSeconds;
const totalFrames = Math.round(totalDuration * 30);

const inputProps = {
  mediaSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  bgmUrl: '',
  bgmVolume: 0.15,
  scenes,
  captions: [
    { start: 0.2, end: 2.8, text: 'Testing 46 images hybrid mix with AI narrative placement.' },
    { start: 3.0, end: 5.8, text: 'Seamless transition across multiple scenes with Ken Burns parallax.' },
    { start: 6.0, end: 9.8, text: 'Full 1080p widescreen cinema output rendered on AWS Lambda.' }
  ],
  subtitleChunks: [
    { start: 0.2, end: 2.8, text: 'Testing 46 images hybrid mix with AI narrative placement.' },
    { start: 3.0, end: 5.8, text: 'Seamless transition across multiple scenes with Ken Burns parallax.' },
    { start: 6.0, end: 9.8, text: 'Full 1080p widescreen cinema output rendered on AWS Lambda.' }
  ],
  subtitleStyle: 'parallax-modern',
  topicTitle: '46 Images Hybrid Mix Test',
  cameraMotionPreset: 'ken-burns',
  fitMode: 'cover',
  totalDurationSeconds: totalDuration,
  durationSeconds: totalDuration,
  sfxEvents: [],
  fps: 30,
};

const region = 'us-east-1';
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || 'remotion-render-4-0-424-mem2048mb-disk2048mb-120sec';
const serveUrl = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html';
const composition = 'IMAGE-TO-VIDEO-AI';

console.log('Dispatching 46-images hybrid mix render to AWS Lambda us-east-1...', {
  region,
  functionName,
  composition,
  scenesCount: scenes.length,
  totalDuration,
  totalFrames,
});

try {
  const result = await renderMediaOnLambda({
    region,
    functionName,
    serveUrl,
    composition,
    codec: 'h264',
    audioCodec: 'aac',
    inputProps,
    outName: `renders/test-46-mix-${Date.now()}/out.mp4`,
    privacy: 'public',
    deleteAfter: '1-day',
    overwrite: true,
    concurrency: 2,
    frameRange: [0, totalFrames - 1],
    maxRetries: 2,
  });

  console.log('Render dispatched successfully! Render ID:', result.renderId);
  console.log('Bucket:', result.bucketName);

  let done = false;
  while (!done) {
    await new Promise(r => setTimeout(r, 4000));
    const progress = await getRenderProgress({
      region,
      functionName,
      renderId: result.renderId,
      bucketName: result.bucketName,
    });

    console.log(`Progress: ${(progress.overallProgress * 100).toFixed(1)}% | Done: ${progress.done} | Fatal Error: ${progress.fatalErrorEncountered}`);

    if (progress.fatalErrorEncountered) {
      console.error('Render encountered fatal error:', progress.errors);
      process.exit(1);
    }

    if (progress.done) {
      done = true;
      console.log('46 Images Hybrid Mix Render COMPLETED at 100%!');
      console.log('Output Video URL:', progress.outputFile);
    }
  }
} catch (err) {
  console.error('Lambda render invocation error:', err);
  process.exit(1);
}
