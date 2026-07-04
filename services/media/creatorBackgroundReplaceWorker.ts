import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import ffmpegStatic from 'ffmpeg-static';
import {createReadUrl, uploadTemporaryMediaObject} from '@/lib/aws/mediaStorage';

export type CreatorBackgroundReplaceSettings = {
  backgroundFit: 'cover' | 'contain';
  backgroundScale: number;
  backgroundX: number;
  backgroundY: number;
  creatorScale: number;
  creatorX: number;
  creatorY: number;
};

export type CreatorBackgroundReplaceResult = {
  bucket: string;
  key: string;
  outputUrl: string;
  renderId: string;
  durationSeconds: number;
};

type CreatorBackgroundReplaceWorkerStatus = {
  ok: boolean;
  mode: 'remote' | 'local' | 'missing-remote-worker' | 'remote-worker-not-ready';
  reasonCode?: 'BACKGROUND_REPLACE_WORKER_NOT_CONFIGURED' | 'BACKGROUND_REPLACE_WORKER_NOT_READY';
  message?: string;
  detail?: string;
  retryable?: boolean;
};

export function getCreatorBackgroundReplaceWorkerStatus() {
  const remoteWorkerUrl = cleanEnvValue(process.env.CREATOR_BG_REPLACE_WORKER_URL || process.env.BACKGROUND_REPLACE_WORKER_URL);
  if (remoteWorkerUrl) return {ok: true, mode: 'remote' as const};
  if (isVercelRuntime()) {
    return {
      ok: false,
      mode: 'missing-remote-worker' as const,
      reasonCode: 'BACKGROUND_REPLACE_WORKER_NOT_CONFIGURED' as const,
      message: 'Creator Background Replace worker is not configured. Set CREATOR_BG_REPLACE_WORKER_URL before enabling this template in production.',
      retryable: false,
    };
  }
  return {ok: true, mode: 'local' as const};
}

export async function verifyCreatorBackgroundReplaceWorkerReady(): Promise<CreatorBackgroundReplaceWorkerStatus> {
  const baseStatus = getCreatorBackgroundReplaceWorkerStatus();
  if (!baseStatus.ok || baseStatus.mode !== 'remote') return baseStatus;

  const healthUrl = cleanEnvValue(process.env.CREATOR_BG_REPLACE_WORKER_HEALTH_URL || process.env.BACKGROUND_REPLACE_WORKER_HEALTH_URL);
  if (!healthUrl) return baseStatus;

  const attempts = Math.max(1, Math.min(3, Number(process.env.CREATOR_BG_REPLACE_HEALTH_RETRIES || 2) || 2));
  let lastDetail = '';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = await probeWorkerHealth(healthUrl);
    if (result.ok) return baseStatus;
    lastDetail = `attempt ${attempt}/${attempts}: ${result.detail}`;
    if (attempt < attempts) await wait(350 * attempt);
  }

  return {
    ok: false,
    mode: 'remote-worker-not-ready',
    reasonCode: 'BACKGROUND_REPLACE_WORKER_NOT_READY',
    message: 'Creator Background Replace worker health check failed.',
    detail: lastDetail,
    retryable: true,
  };
}

export async function processCreatorBackgroundReplace({
  backgroundImageUrl,
  creatorVideoUrl,
  durationSeconds,
  fileName,
  settings,
  userId,
}: {
  backgroundImageUrl: string;
  creatorVideoUrl: string;
  durationSeconds: number;
  fileName: string;
  settings: CreatorBackgroundReplaceSettings;
  userId: string;
}): Promise<CreatorBackgroundReplaceResult> {
  const remoteWorkerUrl = cleanEnvValue(process.env.CREATOR_BG_REPLACE_WORKER_URL || process.env.BACKGROUND_REPLACE_WORKER_URL);
  const configuredMaxSeconds = Number(process.env.CREATOR_BG_REPLACE_MAX_SECONDS || 60);
  const maxSeconds = Number.isFinite(configuredMaxSeconds) ? Math.max(1, Math.min(60, Math.round(configuredMaxSeconds))) : 60;
  const safeSeconds = Math.max(1, Math.min(maxSeconds, Math.round(Number(durationSeconds) || 60)));

  if (remoteWorkerUrl) {
    return processRemoteCreatorBackgroundReplace({
      backgroundImageUrl,
      creatorVideoUrl,
      durationSeconds: safeSeconds,
      fileName,
      remoteWorkerUrl,
      settings,
      userId,
    });
  }

  if (isVercelRuntime()) {
    throw new Error('Creator Background Replace needs an AWS worker URL. Set CREATOR_BG_REPLACE_WORKER_URL in Vercel and keep Python/FFmpeg on AWS.');
  }

  const pythonPath = findPythonPath();
  const ffmpegPath = findFfmpegPath();
  if (!ffmpegPath) {
    throw new Error('FFmpeg is unavailable. Set FFMPEG_PATH or install ffmpeg on the worker.');
  }

  const processorPath = path.join(process.cwd(), 'scripts', 'creator-background-replace.py');
  if (!existsSync(processorPath)) {
    throw new Error('Creator background replacement processor is missing.');
  }

  const workDir = await mkdtemp(path.join(tmpdir(), 'itnavideo-bg-replace-'));
  const stem = sanitizeFileStem(fileName || 'creator-video');
  const inputVideoPath = path.join(workDir, `${stem}-input${extensionFromUrl(fileName, '.mp4')}`);
  const backgroundPath = path.join(workDir, `${stem}-background${extensionFromUrl(backgroundImageUrl, '.jpg')}`);
  const settingsPath = path.join(workDir, `${stem}-settings.json`);
  const outputPath = path.join(workDir, `${stem}-background-replaced.mp4`);

  try {
    const [videoBytes, backgroundBytes] = await Promise.all([
      downloadBytes(creatorVideoUrl, 'creator video'),
      downloadBytes(backgroundImageUrl, 'background image'),
    ]);
    await Promise.all([
      writeFile(inputVideoPath, videoBytes),
      writeFile(backgroundPath, backgroundBytes),
      writeFile(settingsPath, JSON.stringify(settings, null, 2)),
    ]);

    await runProcess(pythonPath, [
      processorPath,
      '--input-video',
      inputVideoPath,
      '--background-image',
      backgroundPath,
      '--output-video',
      outputPath,
      '--settings',
      settingsPath,
      '--ffmpeg',
      ffmpegPath,
      '--max-seconds',
      String(safeSeconds),
    ]);

    const outputBytes = await readFile(outputPath);
    const renderId = `creator-bg-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const upload = await uploadTemporaryMediaObject({
      body: outputBytes,
      contentType: 'video/mp4',
      fileName: `${stem}-background-replaced.mp4`,
      mode: 'video',
      purpose: 'creator-background-replace',
      userId,
    });

    return {
      bucket: upload.bucket,
      key: upload.key,
      outputUrl: await createReadUrl(upload.key, 60 * 60 * 48),
      renderId,
      durationSeconds: safeSeconds,
    };
  } finally {
    await rm(workDir, {recursive: true, force: true});
  }
}

async function processRemoteCreatorBackgroundReplace({
  backgroundImageUrl,
  creatorVideoUrl,
  durationSeconds,
  fileName,
  remoteWorkerUrl,
  settings,
  userId,
}: {
  backgroundImageUrl: string;
  creatorVideoUrl: string;
  durationSeconds: number;
  fileName: string;
  remoteWorkerUrl: string;
  settings: CreatorBackgroundReplaceSettings;
  userId: string;
}): Promise<CreatorBackgroundReplaceResult> {
  const renderId = `creator-bg-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const headers: Record<string, string> = {'Content-Type': 'application/json'};
  const secret = cleanEnvValue(process.env.CREATOR_BG_REPLACE_WORKER_SECRET || process.env.RENDER_WORKER_SECRET);
  if (secret) headers.Authorization = `Bearer ${secret}`;

  const response = await fetch(remoteWorkerUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jobId: renderId,
      creatorVideoUrl,
      backgroundImageUrl,
      durationSeconds,
      fileName,
      settings,
      userId,
    }),
  });

  const payload = await readJsonPayload(response);
  if (!response.ok || payload.ok === false) {
    const message = readPayloadString(payload.error || payload.message) || `AWS background worker failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  const key = readPayloadString(payload.key || payload.outputKey || payload.outName);
  const outputUrl = readPayloadString(payload.outputFile || payload.outputUrl || payload.url) || (key ? await createReadUrl(key, 60 * 60 * 48) : '');
  if (!outputUrl) throw new Error('AWS background worker finished without an output URL.');

  return {
    bucket: readPayloadString(payload.bucketName || payload.bucket) || 'aws-background-worker',
    key,
    outputUrl,
    renderId: readPayloadString(payload.renderId) || renderId,
    durationSeconds: Number(payload.durationSeconds) || durationSeconds,
  };
}

function findPythonPath() {
  const configured = cleanEnvValue(process.env.CREATOR_BG_REPLACE_PYTHON || process.env.PYTHON_PATH);
  if (configured) return configured;
  return process.platform === 'win32' ? 'python' : 'python3';
}

function findFfmpegPath() {
  const configured = cleanEnvValue(process.env.FFMPEG_PATH);
  if (configured && existsSync(configured)) return configured;
  if (ffmpegStatic && existsSync(ffmpegStatic)) return ffmpegStatic;
  return process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
}

async function downloadBytes(url: string, label: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not download ${label}. HTTP ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

function runProcess(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {stdio: ['ignore', 'pipe', 'pipe']});
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      const detail = (stderr || stdout).trim().slice(-2000);
      reject(new Error(`Background replacement worker failed with code ${code}.${detail ? ` ${detail}` : ''}`));
    });
  });
}

function extensionFromUrl(value: string, fallback: string) {
  const ext = path.extname(String(value || '').split('?')[0] || '').toLowerCase();
  return ext && ext.length <= 8 ? ext : fallback;
}

function sanitizeFileStem(value: string) {
  const stem = path.basename(value, path.extname(value))
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);
  return stem || 'creator-video';
}

function cleanEnvValue(value?: string) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function isVercelRuntime() {
  return process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV || process.env.NOW_REGION);
}

async function readJsonPayload(response: Response): Promise<Record<string, unknown>> {
  try {
    const value = await response.json();
    return value && typeof value === 'object' ? value as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function readPayloadString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

async function probeWorkerHealth(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {Accept: 'application/json'},
      signal: controller.signal,
    });
    const payload = await readJsonPayload(response);
    if (response.ok && payload.ok !== false) return {ok: true, detail: `HTTP ${response.status}`};
    const detail = readPayloadString(payload.error || payload.message || payload.status) || response.statusText || 'health check failed';
    return {ok: false, detail: `HTTP ${response.status} ${detail}`.trim()};
  } catch (error) {
    return {ok: false, detail: error instanceof Error ? error.message : 'health check request failed'};
  } finally {
    clearTimeout(timeout);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
