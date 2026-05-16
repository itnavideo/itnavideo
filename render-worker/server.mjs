import crypto from 'crypto';
import { spawn } from 'child_process';
import express from 'express';
import fs from 'fs';
import path from 'path';
import ffmpegStaticPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import { renderVideoWithFFmpeg } from './ffmpegRenderer.mjs';
import { getPythonRendererHealth } from './pythonRendererBridge.mjs';
import { ensureRenderWorkspace } from './renderWorkspace.mjs';
import { upsertFfmpegJob } from '../services/rendering/ffmpegJobStore.mjs';
import { canWriteSupabaseFromServer, upsertUserProjectFromServer } from '../services/supabase/projectStore.mjs';
import { isGoogleDriveConfigured, listGoogleDriveChildren } from '../services/assets/googleDriveClient.mjs';

const app = express();
const port = Number(process.env.PORT || 10000);
const workspace = ensureRenderWorkspace();
const FOLDER_MIME = 'application/vnd.google-apps.folder';
const DRIVE_VISUAL_CACHE_TTL_MS = 5 * 60 * 1000;
let cachedDriveVisuals = { expiresAt: 0, assets: [] };

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.RENDER_WORKER_CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});
app.use(express.json({ limit: process.env.RENDER_WORKER_BODY_LIMIT || '25mb' }));

app.get('/health', async (_req, res) => {
  const ffmpeg = await getFfmpegHealth();
  const pythonRenderer = await getPythonRendererHealth();
  const config = getWorkerConfigHealth();
  res.json({ ok: ffmpeg.ok && config.ok, service: 'itnavideo-render-worker', ffmpeg, pythonRenderer, config, workspace });
});

app.post('/api/process-video', (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { timeline, voiceoverUrl, jobId, userId } = req.body || {};

  if (!timeline?.scenes?.length) {
    return res.status(400).json({ error: 'timeline.scenes is required' });
  }

  if (!jobId || !userId) {
    return res.status(400).json({ error: 'jobId and userId are required' });
  }

  const configHealth = getWorkerConfigHealth();
  if (!configHealth.ok) {
    return res.status(500).json({ error: 'Render worker is missing required environment variables.', config: configHealth });
  }

  res.status(202).json({
    success: true,
    message: 'Rendering started in background',
    jobId,
  });

  void processVideoInBackground({
    timeline,
    voiceoverUrl,
    jobId,
    userId,
  });
});

app.post('/api/pipeline/start', (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { voiceoverUrl, voiceUrl, jobId, userId } = req.body || {};
  const audioUrl = voiceoverUrl || voiceUrl;

  if (!audioUrl) {
    return res.status(400).json({ error: 'voiceoverUrl is required' });
  }

  if (!jobId || !userId) {
    return res.status(400).json({ error: 'jobId and userId are required' });
  }

  const configHealth = getWorkerConfigHealth();
  if (!configHealth.ok) {
    return res.status(500).json({ error: 'Render worker is missing required environment variables.', config: configHealth });
  }

  res.status(202).json({
    success: true,
    accepted: true,
    message: 'Full video pipeline started in background',
    jobId,
  });

  void processPipelineInBackground({
    ...req.body,
    voiceoverUrl: audioUrl,
    jobId,
    userId,
  });
});

app.listen(port, () => {
  ensureRenderWorkspace();
  console.log(`Itnavideo render worker listening on :${port}`);
});

async function processPipelineInBackground(payload) {
  const {
    userId,
    jobId,
    voiceoverUrl,
    title,
    config = {},
    userAssets = [],
    targetDurationSeconds,
  } = payload;

  try {
    await updateRenderStatusBestEffort(userId, jobId, {
      project: {
        status: 'Preparing video plan',
        progress: 35,
        renderProvider: 'render',
      },
      job: {
        status: 'processing',
        progress: 35,
        message: 'Render worker accepted the job and is preparing the video timeline...',
      },
    });

    const timeline = await buildWorkerTimeline({
      title,
      config,
      userAssets,
      targetDurationSeconds,
    });

    await updateRenderStatusBestEffort(userId, jobId, {
      project: {
        status: 'Timeline ready, rendering MP4',
        progress: 68,
        timelineScenes: timeline.scenes.length,
        captions: timeline.captions.length,
        durationSeconds: timeline.metadata.duration,
        timeline,
      },
      job: {
        status: 'rendering',
        progress: 68,
        message: 'Timeline is ready. FFmpeg render is starting...',
      },
    });

    await processVideoInBackground({
      timeline,
      voiceoverUrl,
      jobId,
      userId,
    });
  } catch (error) {
    console.error(`Pipeline job ${jobId} failed:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Video pipeline failed';
    await updateRenderStatusBestEffort(userId, jobId, {
      project: {
        status: 'Needs retry',
        progress: 35,
        error: errorMessage,
      },
      job: {
        status: 'error',
        progress: 35,
        message: errorMessage,
        error: errorMessage,
      },
    }, { attempts: 3, delayMs: 1000 });
  }
}

async function processVideoInBackground({ timeline, voiceoverUrl, jobId, userId }) {
  const outputPath = path.join(workspace.finalOutput, `${safeFileName(jobId)}.mp4`);
  const reportRenderProgress = createProgressReporter(userId, jobId);

  try {
    console.log(`Starting render for Job: ${jobId}`);
    await updateRenderStatusBestEffort(userId, jobId, {
      project: {
        status: 'Rendering MP4',
        progress: 75,
        renderProvider: 'render',
      },
      job: {
        status: 'rendering',
        progress: 75,
        message: 'Dedicated worker is rendering the MP4...',
      },
    });

    await renderVideoWithFFmpeg(
      { timeline, voiceoverUrl, quality: '1080p' },
      outputPath,
      {
        quality: '1080p',
        onProgress: ({ percent }) => {
          void reportRenderProgress(percent);
        },
      },
    );
    await assertRenderableVideoOutput(outputPath);

    await updateRenderStatusBestEffort(userId, jobId, {
      project: {
        status: 'Saving final video',
        progress: 97,
      },
      job: {
        status: 'uploading',
        progress: 97,
        message: 'Uploading final video...',
      },
    });

    const cloudinaryUrl = await uploadToCloudinary(outputPath, jobId);

    await updateRenderStatusBestEffort(userId, jobId, {
      project: {
        status: 'Video ready',
        progress: 100,
        videoUrl: cloudinaryUrl,
        renderUrl: cloudinaryUrl,
        completedAt: new Date().toISOString(),
      },
      job: {
        status: 'ready',
        progress: 100,
        message: 'Video ready.',
        videoUrl: cloudinaryUrl,
      },
    }, { attempts: 4, delayMs: 1500 });

    console.log(`Job ${jobId} finished successfully.`);
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Render failed';
    await updateRenderStatusBestEffort(userId, jobId, {
      project: {
        status: 'Needs retry',
        progress: 72,
        error: errorMessage,
      },
      job: {
        status: 'error',
        progress: 72,
        message: 'Render failed. Please retry.',
        error: errorMessage,
      },
    });
  } finally {
    cleanupFile(outputPath);
  }
}

async function buildWorkerTimeline({ title, config = {}, userAssets = [], targetDurationSeconds }) {
  const duration = clampNumber(Number(targetDurationSeconds || config.targetDurationSeconds || config.durationSeconds || 45), 8, 60);
  const sceneCount = Math.max(3, Math.min(8, Math.ceil(duration / 8)));
  const segment = duration / sceneCount;
  const cleanTitle = String(title || 'Your video').replace(/\.[^.]+$/, '').trim() || 'Your video';
  const uploadedAssets = Array.isArray(userAssets) ? userAssets.filter((asset) => typeof asset?.url === 'string') : [];
  const driveAssets = await pickWorkerDriveVisuals({
    query: `${cleanTitle} ${config.editingStyle || ''} ${config.mood || ''}`,
    limit: Math.max(sceneCount, 6),
  });
  const assets = uploadedAssets.length ? uploadedAssets : driveAssets;
  const palette = pickWorkerPalette(config.editingStyle || config.mood);
  const captions = buildWorkerCaptions(cleanTitle, duration, sceneCount);

  const scenes = Array.from({ length: sceneCount }, (_, index) => {
    const start = roundTime(index * segment);
    const end = roundTime(index === sceneCount - 1 ? duration : (index + 1) * segment);
    const asset = assets.length ? assets[index % assets.length] : null;

    return {
      id: `scene_${index + 1}`,
      start,
      end,
      role: getWorkerSceneRole(index, sceneCount),
      source: buildWorkerSceneSource(asset, cleanTitle),
      crop: {
        safeFrame: '4:5',
      },
      textCard: {
        headline: index === 0 ? cleanTitle : getWorkerHeadline(index),
        body: getWorkerSceneBody(index, config),
        backgroundColor: palette.background[index % palette.background.length],
        accentColor: palette.accent[index % palette.accent.length],
      },
    };
  });

  return {
    version: '1.0',
    metadata: {
      mode: 'render_worker_pipeline',
      duration,
      fps: 30,
      aspectRatio: config.aspectRatio || 'Portrait (9:16)',
      editingStyle: config.editingStyle || 'reels_pacing',
      quality: config.quality || '1080p',
    },
    scenes,
    captions,
    music: [],
    effects: [],
    transitions: scenes.slice(1).map((scene) => ({
      at: scene.start,
      type: 'cut',
    })),
  };
}

function buildWorkerSceneSource(asset, fallbackQuery) {
  if (!asset) {
    return {
      type: 'text_card',
      url: null,
      query: fallbackQuery,
    };
  }

  if (asset.driveFileId) {
    return {
      type: asset.type === 'video' ? 'drive_video' : 'drive_image',
      url: asset.url || null,
      driveFileId: asset.driveFileId,
      mimeType: asset.mimeType,
      assetId: asset.title || asset.driveFileId,
      query: asset.title || fallbackQuery,
    };
  }

  return {
    type: asset.type === 'video' ? 'uploaded_video' : 'uploaded_image',
    url: asset.url,
    query: asset.filename || asset.title || fallbackQuery,
  };
}

async function pickWorkerDriveVisuals({ query, limit }) {
  try {
    const assets = await getWorkerDriveVisuals();
    if (!assets.length) return [];

    return assets
      .map((asset) => ({
        asset,
        score: scoreWorkerAsset(asset, query),
      }))
      .sort((a, b) => b.score - a.score || a.asset.title.localeCompare(b.asset.title))
      .slice(0, limit)
      .map(({ asset }) => asset);
  } catch (error) {
    console.warn('Drive visual lookup failed; falling back to text-card scenes:', error);
    return [];
  }
}

async function getWorkerDriveVisuals() {
  if (cachedDriveVisuals.expiresAt > Date.now()) return cachedDriveVisuals.assets;
  if (!isGoogleDriveConfigured() || !process.env.GOOGLE_DRIVE_ASSET_LIBRARY_FOLDER_ID) {
    cachedDriveVisuals = { expiresAt: Date.now() + DRIVE_VISUAL_CACHE_TTL_MS, assets: [] };
    return cachedDriveVisuals.assets;
  }

  const assets = await walkWorkerDriveFolder(process.env.GOOGLE_DRIVE_ASSET_LIBRARY_FOLDER_ID, [], 0);
  cachedDriveVisuals = {
    expiresAt: Date.now() + DRIVE_VISUAL_CACHE_TTL_MS,
    assets,
  };
  return assets;
}

async function walkWorkerDriveFolder(folderId, folderPath, depth) {
  if (depth > 5) return [];

  const items = await listGoogleDriveChildren(folderId);
  const results = [];

  for (const item of items || []) {
    if (item.mimeType === FOLDER_MIME) {
      results.push(...await walkWorkerDriveFolder(item.id, [...folderPath, item.name], depth + 1));
      continue;
    }

    const asset = toWorkerDriveVisual(item, folderPath);
    if (asset) results.push(asset);
  }

  return results;
}

function toWorkerDriveVisual(item, folderPath) {
  const name = String(item?.name || '');
  const mimeType = String(item?.mimeType || '');
  const ext = path.extname(name).toLowerCase();
  const folderText = folderPath.join(' ').toLowerCase();

  const isVideo = ['.mp4', '.mov', '.webm', '.m4v'].includes(ext) || mimeType.startsWith('video/');
  const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext) || mimeType.startsWith('image/');
  if (!isVideo && !isImage) return null;

  if (folderText.includes('font') || folderText.includes('sound') || folderText.includes('sfx') || folderText.includes('music')) {
    return null;
  }

  const title = path.basename(name, ext).replace(/[-_]+/g, ' ').trim() || name;
  return {
    type: isVideo ? 'video' : 'image',
    title,
    driveFileId: item.id,
    mimeType,
    tags: tokenizeWorkerAsset(`${title} ${name} ${folderPath.join(' ')}`),
  };
}

function scoreWorkerAsset(asset, query) {
  const queryTokens = tokenizeWorkerAsset(query);
  if (!queryTokens.length) return 1;

  const tagSet = new Set(asset.tags || []);
  const matches = queryTokens.filter((token) => tagSet.has(token)).length;
  const titleMatch = queryTokens.some((token) => String(asset.title || '').toLowerCase().includes(token)) ? 1 : 0;
  return matches * 3 + titleMatch + (asset.type === 'video' ? 1 : 0);
}

function tokenizeWorkerAsset(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function buildWorkerCaptions(title, duration, sceneCount) {
  const parts = [
    title,
    'AI is turning your audio into a short video',
    'Captions, visuals, and pacing are added automatically',
    'Your final MP4 is prepared for Reels and Shorts',
  ];
  const cueLength = Math.max(2.5, Math.min(5, duration / Math.max(sceneCount, 1)));

  return Array.from({ length: sceneCount }, (_, index) => {
    const start = roundTime(index * (duration / sceneCount));
    const end = roundTime(Math.min(duration, start + cueLength));
    return {
      id: `caption_${index + 1}`,
      start,
      end,
      text: parts[index % parts.length],
    };
  });
}

function getWorkerSceneRole(index, sceneCount) {
  if (index === 0) return 'Hook';
  if (index === sceneCount - 1) return 'Final beat';
  return `Point ${index}`;
}

function getWorkerHeadline(index) {
  const headlines = ['Key moment', 'Visual beat', 'Important point', 'Story shift', 'Final push'];
  return headlines[index % headlines.length];
}

function getWorkerSceneBody(index, config = {}) {
  const style = String(config.editingStyle || 'short-form').replace(/_/g, ' ');
  const bodies = [
    `Edited in ${style} style with clean mobile pacing.`,
    'Built as a portrait video with readable captions.',
    'Designed for quick scrolling viewers.',
    'Exported as a 1080p social video.',
  ];
  return bodies[index % bodies.length];
}

function pickWorkerPalette(style = '') {
  const normalized = String(style).toLowerCase();
  if (normalized.includes('luxury')) {
    return {
      background: ['0x09090b', '0x111827', '0x1f2937', '0x0f172a'],
      accent: ['0xfbbf24', '0xf59e0b', '0xeab308', '0x38bdf8'],
    };
  }
  if (normalized.includes('cinematic')) {
    return {
      background: ['0x0f172a', '0x111827', '0x172554', '0x101014'],
      accent: ['0x38bdf8', '0x818cf8', '0x5eead4', '0xf472b6'],
    };
  }
  return {
    background: ['0x101014', '0x052e2b', '0x111827', '0x0f172a'],
    accent: ['0x5eead4', '0x38bdf8', '0xfbbf24', '0xa78bfa'],
  };
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function roundTime(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function createProgressReporter(userId, jobId) {
  let lastProgress = 0;
  let lastWriteAt = 0;
  let pending = Promise.resolve();

  return async (percent) => {
    const progress = Math.max(75, Math.min(96, Math.round(75 + percent * 0.21)));
    const now = Date.now();
    const shouldWrite = progress >= 96 || progress - lastProgress >= 3 || now - lastWriteAt >= 10_000;

    if (!shouldWrite) return;

    lastProgress = progress;
    lastWriteAt = now;
    const message = progress >= 92 ? 'Finalizing MP4...' : 'Rendering MP4...';
    pending = pending.catch(() => undefined).then(() => updateRenderStatusBestEffort(userId, jobId, {
      project: {
        status: progress >= 92 ? 'Finalizing MP4' : 'Rendering MP4',
        progress,
      },
      job: {
        status: 'rendering',
        progress,
        message,
      },
    }));
    await pending;
  };
}

async function uploadToCloudinary(filePath, jobId) {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.');
  }

  const folder = process.env.CLOUDINARY_RENDERS_FOLDER || 'itnavideo/renders';
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `render_${safeFileName(jobId)}_${timestamp}`;
  const signature = signCloudinaryParams({ folder, public_id: publicId, timestamp }, config.apiSecret);

  const formData = new FormData();
  const fileBuffer = fs.readFileSync(filePath);
  formData.append('file', new Blob([fileBuffer]), `${publicId}.mp4`);
  formData.append('api_key', config.apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/video/upload`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || `Cloudinary upload failed: ${response.status}`);
  }

  if (result.resource_type && result.resource_type !== 'video') {
    throw new Error(`Cloudinary accepted final render as ${result.resource_type}, not video.`);
  }

  return result.secure_url;
}

async function assertRenderableVideoOutput(filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 10_000) {
    throw new Error('FFmpeg output file is missing or too small. Final video was not generated.');
  }

  const probe = await runCommand(getWorkerFfprobePath(), [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=codec_type,width,height,duration',
    '-of',
    'json',
    filePath,
  ], 10_000);
  const data = JSON.parse(probe || '{}');
  const stream = Array.isArray(data.streams) ? data.streams[0] : null;

  if (stream?.codec_type !== 'video' || Number(stream.width) <= 0 || Number(stream.height) <= 0) {
    throw new Error('FFmpeg output does not contain a valid video stream. Refusing to upload audio-only MP4.');
  }
}

async function updateProject(userId, jobId, data) {
  await upsertUserProjectFromServer(userId, jobId, {
    ...data,
    ownerId: userId,
    updatedAt: new Date().toISOString(),
  });
}

async function updateProjectWithRetry(userId, jobId, data, options = {}) {
  const attempts = Math.max(1, Number(options.attempts || 3));
  const delayMs = Math.max(250, Number(options.delayMs || 1000));
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await updateProject(userId, jobId, data);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`Supabase project update attempt ${attempt}/${attempts} failed for ${jobId}:`, error);
      if (attempt < attempts) await wait(delayMs * attempt);
    }
  }

  throw lastError || new Error('Supabase project update failed.');
}

async function updateFfmpegJobWithRetry(data, options = {}) {
  const attempts = Math.max(1, Number(options.attempts || 3));
  const delayMs = Math.max(250, Number(options.delayMs || 1000));
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await upsertFfmpegJob(data);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`FFmpeg job update attempt ${attempt}/${attempts} failed for ${data.jobId}:`, error);
      if (attempt < attempts) await wait(delayMs * attempt);
    }
  }

  throw lastError || new Error('FFmpeg job update failed.');
}

async function updateRenderStatusBestEffort(userId, jobId, updates, options = {}) {
  const attempts = Math.max(1, Number(options.attempts || 1));
  const delayMs = Math.max(250, Number(options.delayMs || 1000));
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const writes = [];

    if (updates.project) {
      writes.push(updateProject(userId, jobId, updates.project));
    }

    if (updates.job) {
      writes.push(upsertFfmpegJob({ userId, jobId, ...updates.job }));
    }

    const results = await Promise.allSettled(writes);
    const failed = results.filter((result) => result.status === 'rejected');
    if (!failed.length) return;

    lastError = failed[0].reason;
    failed.forEach((failure) => {
      console.warn(`Status write failed for ${jobId} attempt ${attempt}/${attempts}:`, failure.reason);
    });

    if (attempt < attempts) await wait(delayMs * attempt);
  }

  if (lastError) {
    console.warn(`Continuing after status sync failure for ${jobId}:`, lastError);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCloudinaryConfig() {
  if (process.env.CLOUDINARY_URL) {
    const parsed = new URL(process.env.CLOUDINARY_URL);
    return {
      cloudName: parsed.hostname,
      apiKey: parsed.username,
      apiSecret: parsed.password,
    };
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return null;
  }

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

function getWorkerConfigHealth() {
  const cloudinary = Boolean(getCloudinaryConfig());
  const supabase = canWriteSupabaseFromServer();

  return {
    ok: cloudinary && supabase,
    supabase,
    cloudinary,
    workerSecret: Boolean(process.env.RENDER_WORKER_SECRET),
  };
}

async function getFfmpegHealth() {
  const ffmpegPath = getWorkerFfmpegPath();

  try {
    const versionOutput = await runCommand(ffmpegPath, ['-version'], 5000);
    const filtersOutput = await runCommand(ffmpegPath, ['-hide_banner', '-filters'], 5000);
    const codecsOutput = await runCommand(ffmpegPath, ['-hide_banner', '-codecs'], 5000);
    const combined = `${versionOutput}\n${filtersOutput}\n${codecsOutput}`;

    return {
      ok: hasAllFfmpegCapabilities(combined),
      path: ffmpegPath,
      version: versionOutput.split(/\r?\n/)[0] || 'unknown',
      capabilities: {
        libx264: combined.includes('libx264'),
        aac: /\bDEAIL\.\s+aac\b|\bEA...\s+aac\b/.test(combined),
        drawtext: combined.includes(' drawtext '),
        subtitles: combined.includes(' subtitles '),
        libass: combined.includes('--enable-libass') || combined.includes(' ass '),
        freetype: combined.includes('--enable-libfreetype') || combined.includes('drawtext'),
      },
    };
  } catch (error) {
    return {
      ok: false,
      path: ffmpegPath,
      error: error instanceof Error ? error.message : 'FFmpeg health check failed',
    };
  }
}

function hasAllFfmpegCapabilities(output) {
  return output.includes('libx264') &&
    output.includes(' drawtext ') &&
    output.includes(' subtitles ') &&
    (output.includes('--enable-libass') || output.includes(' ass '));
}

function getWorkerFfmpegPath() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  if (ffmpegStaticPath && fs.existsSync(ffmpegStaticPath)) return ffmpegStaticPath;
  return process.env.FFMPEG_PATH || 'ffmpeg';
}

function getWorkerFfprobePath() {
  if (process.env.FFPROBE_PATH && fs.existsSync(process.env.FFPROBE_PATH)) return process.env.FFPROBE_PATH;
  if (ffprobeStatic.path && fs.existsSync(ffprobeStatic.path)) return ffprobeStatic.path;
  return process.env.FFPROBE_PATH || 'ffprobe';
}

function runCommand(command, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let output = '';
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      output += chunk.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (timedOut) reject(new Error(`${path.basename(command)} health check timed out.`));
      else if (code === 0) resolve(output);
      else reject(new Error(`${path.basename(command)} health check exited with code ${code}: ${output.slice(-1000)}`));
    });
  });
}

function signCloudinaryParams(params, apiSecret) {
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return crypto.createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

function isAuthorized(req) {
  const secret = process.env.RENDER_WORKER_SECRET;
  if (!secret) return true;
  return req.get('authorization') === `Bearer ${secret}`;
}

function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.warn(`Cleanup failed for ${filePath}:`, error);
  }
}

function safeFileName(value) {
  return String(value || 'render').replace(/[^a-z0-9_-]/gi, '_').slice(0, 120);
}
