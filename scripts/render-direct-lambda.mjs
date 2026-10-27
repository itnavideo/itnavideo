// scripts/render-direct-lambda.mjs
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { loadEnvLocal } from './load-env-local.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadEnvLocal(rootDir);

const REGION = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'us-east-1';
const FUNCTION_NAME = process.env.REMOTION_LAMBDA_FUNCTION_NAME || 'remotion-render-4-0-467-mem3008mb-disk2048mb-900sec';
const SERVE_URL = process.env.REMOTION_LAMBDA_SERVE_URL || 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html';
const BUCKET_NAME = process.env.REMOTION_LAMBDA_BUCKET_NAME || 'remotionlambda-useast1-2zq6twaok1';

export async function transcribeWithGroq(audioUrl) {
  console.log(`🎙  [GROQ WHISPER] Downloading audio for transcription: ${audioUrl}`);
  const res = await fetch(audioUrl);
  if (!res.ok) throw new Error(`Audio download failed: HTTP ${res.status}`);
  const blob = await res.blob();

  const formData = new FormData();
  formData.append('file', blob, 'audio.mp3');
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'word');
  formData.append('timestamp_granularities[]', 'segment');

  console.log('🎙  [GROQ WHISPER] Transcribing via ultra-fast cloud API...');
  const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: formData,
  });

  if (!groqRes.ok) {
    const errText = await groqRes.text();
    throw new Error(`Groq transcription failed (${groqRes.status}): ${errText}`);
  }

  const data = await groqRes.json();
  console.log(`✅ [GROQ WHISPER] Transcribed ${data.words?.length || 0} words (${data.duration?.toFixed(1)}s)`);
  return data;
}

export function groupWordsIntoCaptions(words = [], maxWordsPerChunk = 4) {
  const captions = [];
  let currentWords = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    currentWords.push({
      text: w.word.trim(),
      word: w.word.trim(),
      start: Number(w.start),
      end: Number(w.end),
    });

    if (currentWords.length >= maxWordsPerChunk || i === words.length - 1) {
      const chunkStart = currentWords[0].start;
      const chunkEnd = currentWords[currentWords.length - 1].end;
      captions.push({
        start: chunkStart,
        end: chunkEnd,
        text: currentWords.map((item) => item.text).join(' '),
        words: [...currentWords],
      });
      currentWords = [];
    }
  }
  return captions;
}

export async function renderOnLambda({ composition, inputProps, totalFrames }) {
  console.log(`☁️  [AWS LAMBDA] Dispatching render job...`);
  console.log(`   Composition: ${composition}`);
  console.log(`   Total Frames: ${totalFrames} (${(totalFrames / 30).toFixed(1)}s @ 30fps)`);
  console.log(`   Function: ${FUNCTION_NAME}`);

  const { renderId, bucketName } = await renderMediaOnLambda({
    region: REGION,
    functionName: FUNCTION_NAME,
    serveUrl: SERVE_URL,
    composition,
    inputProps,
    codec: 'h264',
    imageFormat: 'jpeg',
    frameRange: [0, totalFrames - 1],
    privacy: 'public',
    maxRetries: 3,
  });

  console.log(`✅ [AWS LAMBDA] Render initiated!`);
  console.log(`   Render ID: ${renderId}`);
  console.log(`   Bucket: ${bucketName}`);
  console.log(`⏳ [AWS LAMBDA] Polling render progress...`);

  const startTime = Date.now();
  while (true) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName: FUNCTION_NAME,
      region: REGION,
    });

    const pct = ((progress.overallProgress || 0) * 100).toFixed(1);
    console.log(`   [${elapsed}s] Progress: ${pct}% | Done: ${progress.done} | Output: ${progress.outputFile ? 'Ready' : 'Pending'}`);

    if (progress.done) {
      console.log(`🎉 [AWS LAMBDA] Render Complete!`);
      console.log(`🎬 1080p MP4 URL: ${progress.outputFile}`);
      return {
        renderId,
        videoUrl: progress.outputFile,
        durationSeconds: elapsed,
      };
    }

    if (progress.fatalErrorEncountered) {
      const errMsgs = progress.errors?.map((e) => e.message || e.stack).join('\n') || 'Unknown Lambda error';
      throw new Error(`Fatal Lambda render error:\n${errMsgs}`);
    }

    await new Promise((r) => setTimeout(r, 6000));
  }
}
