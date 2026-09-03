import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';
import { cleanFaceCamSilenceAndFillers } from '../services/ai/faceCamSilenceCleaner';
import { extractFaceKeyframes } from '../services/vision/faceTracker';
import { transcribeMediaUrlWithGroq } from '../services/ai/groqTranscription';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const region = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'ap-south-1';
const bucket = process.env.REMOTION_LAMBDA_BUCKET_NAME || 'remotionlambda-apsouth1-m59wp9dklj';
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || 'remotion-render-4-0-467-mem3008mb-disk2048mb-900sec';
const serveUrl = process.env.REMOTION_LAMBDA_SERVE_URL || 'https://remotionlambda-apsouth1-m59wp9dklj.s3.ap-south-1.amazonaws.com/sites/itnavideo-video-explainer/index.html';

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

async function main() {
  console.log('=== Long Video Pro Render Test ===');
  const localVideoPath = path.resolve(process.cwd(), 'docs/references/long-form/videoplayback (1).mp4');
  if (!fs.existsSync(localVideoPath)) {
    console.error('Test video not found:', localVideoPath);
    process.exit(1);
  }

  const fileSize = fs.statSync(localVideoPath).size;
  console.log(`Uploading test video (${(fileSize / (1024 * 1024)).toFixed(2)} MB)...`);

  const fileBuffer = fs.readFileSync(localVideoPath);
  const mediaKey = `uploads/test-${Date.now()}-talking-head.mp4`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: mediaKey,
      Body: fileBuffer,
      ContentType: 'video/mp4',
    })
  );

  const mediaUrl = `https://${bucket}.s3.${region}.amazonaws.com/${mediaKey}`;
  console.log('Test video uploaded to S3:', mediaUrl);

  console.log('Transcribing with Groq Whisper...');
  const transcription = await transcribeMediaUrlWithGroq({ mediaUrl, fileName: 'talking-head.mp4' });
  console.log('Transcription received. Words count:', transcription.words?.length || 0, 'Duration:', transcription.durationSeconds);

  const rawWords = (transcription.words || []).map((w) => ({
    word: w.word,
    start: Number(w.start),
    end: Number(w.end),
  }));

  console.log('Running Face-Camera Silence & Filler Cleaner...');
  const faceCamCleaned = cleanFaceCamSilenceAndFillers(rawWords, transcription.durationSeconds || 30);
  console.log('FaceCam Cleaned Summary:', {
    originalDuration: faceCamCleaned.originalDurationSeconds,
    cleanedDuration: faceCamCleaned.cleanedDurationSeconds,
    silenceCutCount: faceCamCleaned.silenceCutCount,
    fillersRemovedCount: faceCamCleaned.fillersRemovedCount,
    clipsCount: faceCamCleaned.clips.length,
  });

  console.log('Clips:', faceCamCleaned.clips);
  console.log('First 5 Cleaned Words:', faceCamCleaned.cleanedWords.slice(0, 5));

  console.log('Running Face Tracking Extraction...');
  const faceTracking = await extractFaceKeyframes(localVideoPath, 30, 2.0);
  console.log('Face Tracking Result:', {
    source: faceTracking.source,
    keyframesCount: faceTracking.keyframes.length,
    isStaticCenter: faceTracking.isStaticCenter,
    avgXCenter: faceTracking.averageXCenter,
  });

  // Render on Lambda
  const inputProps = {
    mediaSrc: mediaUrl,
    sourceAudioVolume: 1.35,
    durationSeconds: Math.min(30, faceCamCleaned.cleanedDurationSeconds),
    speechClips: faceCamCleaned.clips,
    enableSmartPunchIn: true,
    faceKeyframes: faceTracking.keyframes,
    captions: faceCamCleaned.cleanedWords.slice(0, 25).map((w) => ({
      start: w.start,
      end: w.end,
      text: w.word,
      words: [w],
    })),
    chapterEvents: [
      { id: 'c1', title: 'FACECAM TEST', subtitle: 'Long Video Pro Quality Audit', stepNumber: 1, start: 0, end: 30 },
    ],
    templateConfig: {
      captionThemeId: 'glow-viral',
      stickerPackId: 'stickman-dev',
      lowerThirdId: 'chapter-badge',
      progressBarId: 'bottom-neon-bar',
    },
  };

  const outName = `renders/test-${Date.now()}-lvp-audit.mp4`;
  console.log('Starting Remotion Lambda Render for LONG-VIDEO-PRO...');
  const render = await renderMediaOnLambda({
    region: region as any,
    functionName,
    serveUrl,
    composition: 'LONG-VIDEO-PRO',
    codec: 'h264',
    audioCodec: 'aac',
    inputProps,
    outName,
    privacy: 'public',
    framesPerLambda: 900,
    downloadBehavior: { type: 'download', fileName: 'long-video-pro-audit.mp4' },
  });

  console.log('Lambda Render launched with renderId:', render.renderId);

  // Poll render progress
  let finished = false;
  while (!finished) {
    await new Promise((r) => setTimeout(r, 4000));
    const progress = await getRenderProgress({
      region: region as any,
      functionName,
      bucketName: bucket,
      renderId: render.renderId,
    });

    console.log(`Render progress: ${(progress.overallProgress * 100).toFixed(1)}% | Done: ${progress.done} | Fatal Error: ${!!progress.fatalErrorEncountered}`);

    if (progress.fatalErrorEncountered) {
      console.error('Render Fatal Error Details:', JSON.stringify(progress.errors, null, 2));
      finished = true;
    } else if (progress.done) {
      finished = true;
      console.log('Render Successful! Output URL:', progress.outputFile);
    }
  }
}

main().catch(console.error);
