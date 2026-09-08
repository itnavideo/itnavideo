/**
 * AWS Lambda-based audio extraction for Long Video Pro.
 * 
 * Instead of downloading large videos to Vercel, we invoke a Lambda function
 * that runs in the same AWS region as S3 (ap-south-1) for fast extraction.
 * 
 * Flow:
 * 1. Vercel invokes Lambda with S3 key of the uploaded video
 * 2. Lambda downloads video from S3 (same region = fast)
 * 3. Lambda uses ffmpeg to extract audio (mono, 16kHz, 64kbps MP3)
 * 4. Lambda uploads extracted audio back to S3
 * 5. Lambda returns the S3 key of the extracted audio
 * 6. Vercel creates presigned URL and sends to Groq
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION || process.env.REMOTION_AWS_REGION || 'ap-south-1';
const BUCKET = process.env.AWS_S3_BUCKET || 'itnavideo-transcribe';
const AUDIO_EXTRACT_FUNCTION = process.env.AUDIO_EXTRACT_LAMBDA_FUNCTION || '';

// Max file size we'll attempt to process (500MB)
const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;

type AudioExtractionResult = {
  audioUrl: string;
  audioFileName: string;
  audioKey?: string;
  durationSeconds?: number;
  error?: string;
};

/**
 * Extract audio from a video on S3 for transcription.
 * Uses AWS Lambda if available, otherwise falls back to direct S3 + local ffmpeg.
 */
export async function extractAudioFromS3Video(
  mediaKey: string,
  fileName: string,
): Promise<AudioExtractionResult> {
  const s3 = new S3Client({ region: REGION });
  const stem = fileName.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').slice(0, 40) || 'video';
  const audioKey = `itnavideo/temp-audio/${Date.now()}-${stem}-audio.mp3`;

  try {
    // Check video file size first
    const headResp = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: mediaKey }));
    const fileSize = headResp.ContentLength || 0;
    
    if (fileSize > MAX_VIDEO_SIZE_BYTES) {
      return { audioUrl: '', audioFileName: '', error: `Video too large (${Math.round(fileSize / 1024 / 1024)}MB). Maximum 500MB.` };
    }

    console.log('[AUDIO_EXTRACT] Starting extraction:', { mediaKey, sizeMB: (fileSize / 1024 / 1024).toFixed(1) });

    // If Lambda function is configured, use it (preferred — no Vercel resources used)
    if (AUDIO_EXTRACT_FUNCTION) {
      return await extractViaLambda(mediaKey, audioKey, stem);
    }

    // Fallback: extract locally using ffmpeg (works on Vercel with Remotion's bundled ffmpeg)
    return await extractLocally(s3, mediaKey, audioKey, stem, fileName);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[AUDIO_EXTRACT] Failed:', msg);
    return { audioUrl: '', audioFileName: '', error: msg };
  }
}

/**
 * Invoke dedicated Lambda for audio extraction (fastest, no Vercel load)
 */
async function extractViaLambda(
  mediaKey: string,
  outputKey: string,
  stem: string,
): Promise<AudioExtractionResult> {
  const lambda = new LambdaClient({ region: REGION });
  
  const payload = JSON.stringify({
    bucket: BUCKET,
    inputKey: mediaKey,
    outputKey,
    maxSeconds: 600,
    format: 'mp3',
    sampleRate: 16000,
    channels: 1,
    bitrate: '64k',
  });

  const response = await lambda.send(new InvokeCommand({
    FunctionName: AUDIO_EXTRACT_FUNCTION,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(payload),
  }));

  if (response.FunctionError) {
    const errorPayload = response.Payload ? JSON.parse(Buffer.from(response.Payload).toString()) : {};
    throw new Error(`Lambda extraction failed: ${errorPayload.errorMessage || response.FunctionError}`);
  }

  const result = response.Payload ? JSON.parse(Buffer.from(response.Payload).toString()) : {};
  if (!result.outputKey) throw new Error('Lambda returned no output key');

  // Generate presigned URL for the extracted audio
  const s3 = new S3Client({ region: REGION });
  const audioUrl = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: result.outputKey }), { expiresIn: 3600 });

  return {
    audioUrl,
    audioFileName: `${stem}-audio.mp3`,
    audioKey: result.outputKey,
    durationSeconds: result.durationSeconds,
  };
}

/**
 * Fallback: extract audio locally using ffmpeg.
 * Downloads from S3, runs ffmpeg, uploads back.
 */
async function extractLocally(
  s3: S3Client,
  mediaKey: string,
  outputKey: string,
  stem: string,
  fileName: string,
): Promise<AudioExtractionResult> {
  const { spawn } = await import('node:child_process');
  const { existsSync } = await import('node:fs');
  const { mkdtemp, readFile, rm, writeFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const nodePath = await import('node:path');

  // Find ffmpeg
  const ffmpegPath = findFfmpeg(nodePath, existsSync);
  if (!ffmpegPath) {
    return { audioUrl: '', audioFileName: '', error: 'ffmpeg not available on this server' };
  }

  const workDir = await mkdtemp(nodePath.join(tmpdir(), 'lvp-audio-'));
  const inputPath = nodePath.join(workDir, `input${nodePath.extname(fileName) || '.mp4'}`);
  const audioPath = nodePath.join(workDir, `${stem}-audio.mp3`);

  try {
    // Download video from S3
    console.log('[AUDIO_EXTRACT] Downloading from S3...');
    const getResp = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: mediaKey }));
    const body = await getResp.Body?.transformToByteArray();
    if (!body || body.length === 0) throw new Error('Empty video file on S3');
    await writeFile(inputPath, body);
    console.log('[AUDIO_EXTRACT] Downloaded:', { sizeMB: (body.length / 1024 / 1024).toFixed(1) });

    // Extract audio with ffmpeg
    await new Promise<void>((resolve, reject) => {
      const args = [
        '-y',
        '-t', '600',          // Max 10 minutes
        '-i', inputPath,
        '-vn',                 // No video
        '-map', '0:a:0?',
        '-ac', '1',            // Mono
        '-ar', '16000',        // 16kHz
        '-b:a', '64k',        // 64kbps
        '-f', 'mp3',
        audioPath,
      ];
      const child = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
      let stderr = '';
      child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
      child.on('error', reject);
      child.on('close', (code: number | null) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg failed (${code}): ${stderr.slice(-200)}`));
      });
    });

    const audioBytes = await readFile(audioPath);
    if (audioBytes.length === 0) throw new Error('Audio extraction produced empty file');
    console.log('[AUDIO_EXTRACT] Audio ready:', { sizeMB: (audioBytes.length / 1024 / 1024).toFixed(2) });

    // Upload extracted audio to S3
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: outputKey,
      Body: audioBytes,
      ContentType: 'audio/mpeg',
    }));

    // Generate presigned URL
    const audioUrl = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: outputKey }), { expiresIn: 3600 });

    return {
      audioUrl,
      audioFileName: `${stem}-audio.mp3`,
      audioKey: outputKey,
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

function findFfmpeg(
  nodePath: typeof import('node:path'),
  existsSync: (p: string) => boolean,
): string {
  const configured = (process.env.FFMPEG_PATH || '').trim().replace(/^['"]|['"]$/g, '');
  if (configured && existsSync(configured)) return configured;

  const commandName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  for (const dir of String(process.env.PATH || '').split(nodePath.delimiter)) {
    if (!dir) continue;
    const c = nodePath.join(dir, commandName);
    if (existsSync(c)) return c;
  }

  const ext = process.platform === 'win32' ? '.exe' : '';
  const staticPath = nodePath.join(process.cwd(), 'node_modules', 'ffmpeg-static', `ffmpeg${ext}`);
  if (existsSync(staticPath)) return staticPath;

  for (const pkg of ['compositor-linux-x64-gnu', 'compositor-linux-x64-musl', 'compositor-linux-arm64-gnu', 'compositor-win32-x64-msvc', 'compositor-darwin-x64', 'compositor-darwin-arm64']) {
    const c = nodePath.join(process.cwd(), 'node_modules', '@remotion', pkg, `ffmpeg${ext}`);
    if (existsSync(c)) return c;
    const u = nodePath.join(process.cwd(), 'node_modules', '@remotion', pkg, 'ffmpeg');
    if (existsSync(u)) return u;
  }

  return '';
}
