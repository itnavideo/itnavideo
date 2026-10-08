import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvLocal } from './load-env-local.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadEnvLocal(rootDir);

const region = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'us-east-1';
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || 'remotion-render-4-0-467-mem3008mb-disk2048mb-900sec';
const bucketName = process.env.REMOTION_LAMBDA_BUCKET_NAME || 'remotionlambda-useast1-2zq6twaok1';
const serveUrl = process.env.REMOTION_LAMBDA_SERVE_URL || 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html';

console.log('Testing Image to Video AI Render on AWS Lambda...');
console.log({ region, functionName, bucketName, serveUrl });

const inputProps = {
  mediaSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  bgmUrl: '',
  bgmVolume: 0.15,
  scenes: [
    {
      id: 'scene-1',
      startSeconds: 0,
      endSeconds: 3.0,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80',
      cameraMotion: 'zoom-in',
      transition: 'dissolve',
      title: 'Scene 01 Hook',
      fitMode: 'cover',
    },
    {
      id: 'scene-2',
      startSeconds: 3.0,
      endSeconds: 6.0,
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1920&q=80',
      cameraMotion: 'pan-left',
      transition: 'push-left',
      title: 'Scene 02 Insight',
      fitMode: 'cover',
    }
  ],
  captions: [
    { start: 0.2, end: 2.8, text: 'Welcome to Image to Video AI studio rendering.' },
    { start: 3.1, end: 5.8, text: 'Automatic parallax scene cuts with 1080p cinematic quality.' }
  ],
  subtitleChunks: [
    { start: 0.2, end: 2.8, text: 'Welcome to Image to Video AI studio rendering.' },
    { start: 3.1, end: 5.8, text: 'Automatic parallax scene cuts with 1080p cinematic quality.' }
  ],
  sfxEvents: [],
  durationSeconds: 6.0,
  title: 'Image to Video AI Test',
  subtitleStyle: 'parallax-modern',
  fitMode: 'cover',
};

async function main() {
  try {
    const totalFrames = 180; // 6s @ 30fps
    console.log('Dispatching render to AWS Lambda...');
    const result = await renderMediaOnLambda({
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
      concurrency: 2,
      maxRetries: 2,
      logLevel: 'info',
    });

    console.log('Render dispatched successfully! Render ID:', result.renderId);
    console.log('Bucket:', result.bucketName);

    // Poll until complete
    let done = false;
    let attempts = 0;
    while (!done && attempts < 60) {
      await new Promise((r) => setTimeout(r, 2000));
      attempts++;
      const progress = await getRenderProgress({
        region,
        functionName,
        bucketName: result.bucketName,
        renderId: result.renderId,
        skipLambdaInvocation: true,
        logLevel: 'info',
      });

      console.log(`Progress: ${Math.round((progress.overallProgress || 0) * 100)}% | Done: ${progress.done} | Lambdas: ${progress.lambdasInvoked}`);

      if (progress.errors && progress.errors.length > 0) {
        console.error('Errors encountered on Lambda workers:');
        console.error(JSON.stringify(progress.errors, null, 2));
      }

      if (progress.done) {
        done = true;
        if (progress.outputFile) {
          console.log('✅ RENDER SUCCEEDED! Output MP4 URL:');
          console.log(progress.outputFile);
        } else {
          console.error('❌ Render completed but no output file was created!');
        }
      }
    }
  } catch (err) {
    console.error('❌ Render execution failed:', err);
  }
}

main();
