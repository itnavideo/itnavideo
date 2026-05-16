import crypto from 'crypto';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import ffmpegStaticPath from 'ffmpeg-static';
import { downloadGoogleDriveFile, isGoogleDriveConfigured } from '../services/assets/googleDriveClient.mjs';
import { blacklistAsset, isAssetBlacklisted } from './assetBlacklist.mjs';
import { buildPythonRenderPlan, renderPythonVideo } from './pythonRendererBridge.mjs';
import { ensureRenderWorkspace, getWorkspaceAssetDir } from './renderWorkspace.mjs';
import { normalizeRenderTimeline } from './pipelineGuards.mjs';
import { notifyTelemetry } from './telemetry.mjs';
import { getVideoPipelineConfig } from './videoPipelineConfig.mjs';

const workspace = ensureRenderWorkspace();
const cacheDir = workspace.processedAssets.cache;
const pipelineConfig = getVideoPipelineConfig();
const profile = {
  width: pipelineConfig.targetWidth,
  height: pipelineConfig.targetHeight,
  audioBitrate: '128k',
  crf: getNumberEnv('FFMPEG_DEFAULT_CRF', 26),
  staticCrf: getNumberEnv('FFMPEG_STATIC_CRF', 30),
  mixedCrf: getNumberEnv('FFMPEG_MIXED_CRF', 28),
  motionCrf: getNumberEnv('FFMPEG_MOTION_CRF', 23),
  preset: process.env.FFMPEG_PRESET || 'ultrafast',
};
const renderScale = profile.width / 1080;
const safeFrames = buildSafeFrames(profile);

ensureRenderWorkspace();

let drawtextSupportPromise = null;

export async function renderVideoWithFFmpeg(dataOrRequest, outputPathArg, optionsArg = {}) {
  const { data, outputPath, options } = normalizeRenderRequest(dataOrRequest, outputPathArg, optionsArg);
  const { voiceoverUrl } = data;
  const timeline = normalizeRenderTimeline(data.timeline, {
    duration: data.timeline?.metadata?.duration,
    title: data.timeline?.scenes?.[0]?.textCard?.headline,
  });
  const totalDuration = Math.max(1, Math.max(...timeline.scenes.map((scene) => scene.end || 0)));
  const assets = await resolveTimelineAssets(timeline, voiceoverUrl);
  const supportsDrawtext = await getFfmpegSupportsDrawtext();
  const totalTimeoutMs = getRenderTimeoutMs();
  const primaryTimeoutMs = getPrimaryRenderTimeoutMs(totalTimeoutMs);

  if (supportsDrawtext && shouldUsePythonFullRenderer()) {
    try {
      await renderPythonVideo({
        timeline,
        assets,
        totalDuration,
        ffmpegPath: getFfmpegPath(),
        profile,
      }, outputPath, {
        timeoutMs: primaryTimeoutMs,
      });
      options.onProgress?.({ percent: 100 });
      return outputPath;
    } catch (error) {
      if (process.env.PYTHON_FULL_RENDER_REQUIRED === '1') throw error;
      console.warn('Python full renderer failed; falling back to Node FFmpeg execution:', error.message);
    }
  }

  const renderPlan = await buildRenderPlan({ timeline, assets, totalDuration, supportsDrawtext });
  const encodingProfile = getDynamicEncodingProfile(assets);
  const args = buildFfmpegArgs(assets, renderPlan, outputPath, encodingProfile);

  try {
    if (options.forceSafeFallback) {
      throw new Error('Forced fallback smoke test: ffmpeg failed intentionally');
    }
    await runFfmpeg(args, {
      totalDuration,
      timeoutMs: primaryTimeoutMs,
      onProgress: options.onProgress,
    });
  } catch (error) {
    if (!shouldUseSafeFallback(error)) throw error;
    console.warn('Primary FFmpeg render failed; retrying safe base MP4 fallback:', error.message);
    void notifyTelemetry({
      type: 'safe_render_fallback',
      reason: error.message,
      recovered: true,
      details: { durationSeconds: totalDuration },
    });
    options.onProgress?.({ percent: 5 });
    await renderSafeBaseVideo({ assets, totalDuration, outputPath, timeoutMs: totalTimeoutMs, onProgress: options.onProgress, encodingProfile });
  }

  return outputPath;
}

export async function prefetchTimelineAssets(timelineInput, options = {}) {
  const timeline = normalizeRenderTimeline(timelineInput, {
    duration: timelineInput?.metadata?.duration,
    title: timelineInput?.scenes?.[0]?.textCard?.headline,
  });
  const sources = timeline.scenes
    .map((scene) => scene.source || {})
    .filter((source) => isRenderableSceneSource(source));
  const uniqueSources = dedupeSources(sources);
  const startedAt = Date.now();
  const results = await Promise.allSettled(uniqueSources.map(async (source) => {
    const assetPath = await resolveSceneAssetPath(source, true);
    return {
      source: source.driveFileId || source.assetId || source.url || source.query || 'unknown',
      cached: Boolean(assetPath),
      assetPath,
    };
  }));
  const cached = results.filter((result) => result.status === 'fulfilled' && result.value.cached).length;
  const failed = results.length - cached;

  if (failed > 0) {
    void notifyTelemetry({
      type: 'asset_prefetch_partial',
      jobId: options.jobId,
      reason: `${failed} assets were not prefetched`,
      recovered: true,
      details: { total: results.length, cached, failed },
    });
  }

  return {
    total: results.length,
    cached,
    failed,
    durationMs: Date.now() - startedAt,
  };
}

function normalizeRenderRequest(dataOrRequest, outputPathArg, optionsArg = {}) {
  const isObjectContract = isPlainObject(dataOrRequest)
    && typeof dataOrRequest.outputPath === 'string'
    && isPlainObject(dataOrRequest.timeline);
  const data = isObjectContract
    ? { timeline: dataOrRequest.timeline, voiceoverUrl: dataOrRequest.voiceoverUrl, quality: dataOrRequest.quality }
    : dataOrRequest;
  const outputPath = isObjectContract ? dataOrRequest.outputPath : outputPathArg;
  const options = {
    ...(isObjectContract && isPlainObject(dataOrRequest.options) ? dataOrRequest.options : {}),
    ...(isPlainObject(optionsArg) ? optionsArg : {}),
  };

  if (!isPlainObject(data) || !isPlainObject(data.timeline)) {
    throw new Error('renderVideoWithFFmpeg requires a timeline object.');
  }

  if (!outputPath || typeof outputPath !== 'string') {
    throw new Error('renderVideoWithFFmpeg requires an outputPath string.');
  }

  return { data, outputPath, options };
}

function dedupeSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    const key = source.driveFileId || source.assetId || source.url || JSON.stringify(source);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function getRenderTimeoutMs() {
  return pipelineConfig.renderTimeoutMs;
}

function getPrimaryRenderTimeoutMs(totalTimeoutMs) {
  const configured = pipelineConfig.primaryRenderTimeoutMs;
  return Math.max(45_000, Math.min(totalTimeoutMs, configured));
}

function shouldUseSafeFallback(error) {
  if (process.env.DISABLE_SAFE_RENDER_FALLBACK === '1') return false;
  const message = String(error?.message || '').toLowerCase();
  return message.includes('timed out') || message.includes('ffmpeg failed') || message.includes('python full renderer failed');
}

async function renderSafeBaseVideo({ assets, totalDuration, outputPath, timeoutMs, onProgress, encodingProfile = getDynamicEncodingProfile(assets) }) {
  const duration = Math.max(1, Number(totalDuration || 0));
  const args = [
    '-y',
    '-hide_banner',
    '-f',
    'lavfi',
    '-t',
    String(duration),
    '-i',
    `color=c=0x101014:s=${profile.width}x${profile.height}:r=30`,
  ];

  if (assets.voiceover?.path) {
    args.push('-i', assets.voiceover.path);
  } else {
    args.push('-f', 'lavfi', '-t', String(duration), '-i', `anullsrc=r=44100:cl=stereo`);
  }

  args.push(
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-t',
    String(duration),
    '-c:v',
    'libx264',
    '-preset',
    'ultrafast',
    '-threads',
    getFfmpegThreadCount(),
    '-crf',
    String(Math.max(encodingProfile.crf, profile.mixedCrf)),
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    profile.audioBitrate,
    '-shortest',
    '-movflags',
    '+faststart',
    outputPath,
  );

  await runFfmpeg(args, {
    totalDuration: duration,
    timeoutMs: Math.max(60_000, timeoutMs),
    onProgress,
  });
}

async function buildRenderPlan({ timeline, assets, totalDuration, supportsDrawtext }) {
  if (!supportsDrawtext || !shouldUsePythonRenderer()) {
    return {
      engine: 'node',
      filterGraph: buildComplexFilters(timeline, assets, totalDuration, { supportsDrawtext }),
      videoMap: '[v_base]',
      audioMap: '[a_final]',
    };
  }

  try {
    return await buildPythonRenderPlan({ timeline, assets, totalDuration });
  } catch (error) {
    if (process.env.PYTHON_RENDERER_REQUIRED === '1') throw error;
    console.warn('Python renderer unavailable; falling back to Node filter builder:', error.message);
    return {
      engine: 'node-fallback',
      filterGraph: buildComplexFilters(timeline, assets, totalDuration, { supportsDrawtext }),
      videoMap: '[v_base]',
      audioMap: '[a_final]',
    };
  }
}

function shouldUsePythonRenderer() {
  return process.env.PYTHON_RENDER_ENGINE === '1';
}

function shouldUsePythonFullRenderer() {
  return process.env.PYTHON_FULL_RENDER === '1';
}

async function resolveTimelineAssets(timeline, voiceoverUrl) {
  const allInputs = [];
  const sceneInputs = [];

  for (const scene of timeline.scenes) {
    const source = scene.source || {};
    const duration = Math.max(0.5, (scene.end || 0) - (scene.start || 0));
    const textCard = scene.textCard || buildFallbackTextCard(scene, sceneInputs.length);
    const safeFrame = getSafeFrame(scene.crop?.safeFrame);
    const canRenderSource = isRenderableSceneSource(source);
    const assetPath = await resolveSceneAssetPath(source, canRenderSource);
    const renderableAssetPath = assetPath && isRenderableAssetPath(assetPath) ? assetPath : null;

    const input = {
      inputIndex: allInputs.length,
      duration,
      textCard,
      safeFrame,
      ...(renderableAssetPath
        ? {
            path: renderableAssetPath,
            isImage: source.type?.includes('image') || /\.(jpe?g|png|webp|gif)$/i.test(renderableAssetPath),
          }
        : {
            generatedColor: normalizeFfmpegColor(textCard.backgroundColor || pickFallbackColor(sceneInputs.length)),
            isImage: false,
          }),
    };
    sceneInputs.push(input);
    allInputs.push(input);
  }

  let voiceover = null;
  if (voiceoverUrl) {
    const voiceoverPath = await getCachedAsset(voiceoverUrl, '.mp3');
    if (!voiceoverPath) throw new Error('Could not download voiceover asset.');
    const normalizedVoiceoverPath = await normalizeVoiceoverAudio(voiceoverPath);
    voiceover = { path: normalizedVoiceoverPath, index: allInputs.length };
    allInputs.push(voiceover);
  }

  return { allInputs, sceneInputs, voiceover };
}

async function normalizeVoiceoverAudio(inputPath) {
  const stat = fs.statSync(inputPath);
  const hash = crypto
    .createHash('md5')
    .update(`${inputPath}:${stat.size}:${stat.mtimeMs}`)
    .digest('hex');
  const outputPath = path.join(cacheDir, `voice_${hash}_16k_mono.wav`);

  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) return outputPath;

  try {
    await runFfmpeg([
      '-y',
      '-hide_banner',
      '-i',
      inputPath,
      '-vn',
      '-ac',
      '1',
      '-ar',
      '16000',
      '-c:a',
      'pcm_s16le',
      outputPath,
    ], {
      totalDuration: 0,
      timeoutMs: Number(process.env.AUDIO_NORMALIZE_TIMEOUT_MS || 60_000),
    });

    return outputPath;
  } catch (error) {
    console.warn('Audio normalization failed; continuing with original source audio:', error.message);
    return inputPath;
  }
}

async function resolveSceneAssetPath(source, canRenderSource) {
  if (!canRenderSource) return null;

  try {
    if (await isAssetBlacklisted(source)) {
      void notifyTelemetry({
        type: 'blacklisted_asset_skipped',
        assetId: source.driveFileId || source.assetId || source.url,
        reason: 'asset is blacklisted from previous render failure',
        recovered: true,
      });
      return null;
    }

    if (source.driveFileId) {
      return await getCachedDriveAsset(
        source.driveFileId,
        `${source.url || ''} ${source.filename || ''} ${source.mimeType || ''} ${source.assetId || ''} ${source.type || ''}`,
      );
    }

    if (source.url) {
      return await getCachedAsset(source.url, source.type?.includes('image') ? '.jpg' : '.mp4');
    }
  } catch (error) {
    console.warn('Scene asset unavailable; using generated text card fallback:', error);
    await blacklistAsset(source, error?.message || 'scene_asset_unavailable', {
      type: source?.type,
      mimeType: source?.mimeType,
      query: source?.query,
    });
    void notifyTelemetry({
      type: 'asset_fallback',
      assetId: source?.driveFileId || source?.assetId || source?.url,
      reason: error?.message || 'scene asset unavailable',
      recovered: true,
    });
  }

  return null;
}

function isRenderableSceneSource(source) {
  const sourceType = String(source?.type || '').toLowerCase();
  const mimeType = String(source?.mimeType || '').toLowerCase();
  const hint = `${source?.url || ''} ${source?.assetId || ''} ${source?.query || ''}`.toLowerCase();

  if (sourceType.includes('graphic')) return false;
  if (mimeType.includes('svg') || mimeType.includes('json') || mimeType.includes('lottie')) return false;
  if (/\.(svg|json|lottie)(?:$|[?#])/i.test(hint)) return false;

  return sourceType.includes('video') || sourceType.includes('image');
}

function isRenderableAssetPath(assetPath) {
  return /\.(jpe?g|png|webp|gif|mp4|mov|webm|m4v)$/i.test(assetPath);
}

async function getCachedAsset(url, fallbackExt = '.mp4') {
  if (!url) return null;

  const hash = crypto.createHash('md5').update(url).digest('hex');
  const ext = getUrlExtension(url) || getDataUrlExtension(url) || fallbackExt;
  const cachePath = path.join(getWorkspaceAssetDir(ext), `${hash}${ext}`);

  if (fs.existsSync(cachePath) && fs.statSync(cachePath).size > 0) return cachePath;

  if (String(url).startsWith('file://')) {
    const sourcePath = fileURLToPath(url);
    if (!fs.existsSync(sourcePath) || fs.statSync(sourcePath).size <= 0) {
      void notifyTelemetry({
        type: 'local_file_asset_missing',
        assetId: url,
        reason: 'file asset missing or empty',
        recovered: true,
      });
      throw new Error(`Local asset does not exist: ${sourcePath}`);
    }

    fs.copyFileSync(sourcePath, cachePath);
    return cachePath;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.ASSET_FETCH_TIMEOUT_MS || 60_000));

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok || !response.body) throw new Error(`Asset fetch failed: ${response.status}`);

    const tempPath = `${cachePath}.${Date.now()}.tmp`;
    const writer = fs.createWriteStream(tempPath);
    await finished(Readable.fromWeb(response.body).pipe(writer));
    fs.renameSync(tempPath, cachePath);
    return cachePath;
  } finally {
    clearTimeout(timeout);
  }
}

async function getCachedDriveAsset(fileId, hint = '') {
  if (!fileId || !isGoogleDriveConfigured()) return null;

  const ext = getUrlExtension(String(hint)) || extensionFromHint(String(hint)) || '.bin';
  const cachePath = path.join(cacheDir, `drive_${safeCacheName(fileId)}${ext}`);

  if (fs.existsSync(cachePath) && fs.statSync(cachePath).size > 0) return cachePath;

  const response = await withTimeout(
    downloadGoogleDriveFile(fileId),
    Number(process.env.DRIVE_ASSET_FETCH_TIMEOUT_MS || process.env.ASSET_FETCH_TIMEOUT_MS || 60_000),
    `Drive asset fetch timed out for ${fileId}`,
  );
  const tempPath = `${cachePath}.${Date.now()}.tmp`;
  const writer = fs.createWriteStream(tempPath);
  await finished(Readable.fromWeb(response.body).pipe(writer));
  fs.renameSync(tempPath, cachePath);
  return cachePath;
}

function withTimeout(promise, timeoutMs, message) {
  let timeout;

  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]).finally(() => clearTimeout(timeout));
}

function buildComplexFilters(timeline, assets, totalDuration, options = {}) {
  const filters = [];
  const sceneLabels = [];
  const supportsDrawtext = options.supportsDrawtext !== false;

  timeline.scenes.forEach((scene, index) => {
    const input = assets.sceneInputs[index];
    const label = `v${index}`;
    const duration = Math.max(0.5, (scene.end || 0) - (scene.start || 0));

    const frame = input.safeFrame;
    const baseFilter = `[${input.inputIndex}:v]scale=${frame.width}:${frame.height}:force_original_aspect_ratio=decrease,pad=${frame.width}:${frame.height}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,trim=duration=${duration},setpts=PTS-STARTPTS,format=yuv420p[${label}_safe];color=c=black:s=${profile.width}x${profile.height}:r=30:d=${duration}[${label}_canvas];[${label}_canvas][${label}_safe]overlay=x=${frame.x}:y=${frame.y}:shortest=1`;
    const textFilter = buildTextCardFilter(input.textCard, label, { supportsDrawtext });
    filters.push(`${baseFilter}${textFilter}`);
    sceneLabels.push(`[${label}]`);
  });

  filters.push(`${sceneLabels.join('')}concat=n=${sceneLabels.length}:v=1:a=0[v_concat]`);
  filters.push(buildCaptionFilter(timeline.captions || [], 'v_concat', 'v_base', { supportsDrawtext }));

  if (assets.voiceover) {
    filters.push(`[${assets.voiceover.index}:a]volume=1.0,atrim=duration=${totalDuration}[a_final]`);
  } else {
    filters.push(`anullsrc=r=44100:cl=stereo:d=${totalDuration}[a_final]`);
  }

  return filters.join(';');
}

function buildFfmpegArgs(assets, renderPlan, outputPath, encodingProfile = getDynamicEncodingProfile(assets)) {
  const args = ['-y', '-hide_banner'];
  const filterGraph = typeof renderPlan === 'string' ? renderPlan : renderPlan.filterGraph;
  const videoMap = typeof renderPlan === 'string' ? '[v_base]' : renderPlan.videoMap || '[v_base]';
  const audioMap = typeof renderPlan === 'string' ? '[a_final]' : renderPlan.audioMap || '[a_final]';
  const ffmpegThreads = getFfmpegThreadCount();

  assets.allInputs.forEach((input) => {
    if (input.generatedColor) {
      args.push('-f', 'lavfi', '-t', String(input.duration), '-i', `color=c=${input.generatedColor}:s=${profile.width}x${profile.height}:r=30`);
      return;
    }

    if (input.isImage) args.push('-loop', '1', '-t', String(input.duration));
    args.push('-i', input.path);
  });

  args.push(
    '-filter_threads',
    '1',
    '-filter_complex_threads',
    '1',
    '-filter_complex',
    filterGraph,
    '-map',
    videoMap,
    '-map',
    audioMap,
    '-c:v',
    'libx264',
    '-preset',
    profile.preset,
    '-threads',
    ffmpegThreads,
    '-crf',
    String(encodingProfile.crf),
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    profile.audioBitrate,
    '-movflags',
    '+faststart',
    outputPath,
  );

  return args;
}

function getDynamicEncodingProfile(assets) {
  const sceneInputs = Array.isArray(assets?.sceneInputs) ? assets.sceneInputs : [];
  const sceneCount = Math.max(1, sceneInputs.length);
  const videoScenes = sceneInputs.filter((input) => input.path && !input.isImage && !input.generatedColor).length;
  const imageScenes = sceneInputs.filter((input) => input.path && input.isImage).length;
  const generatedScenes = sceneInputs.filter((input) => input.generatedColor).length;
  const videoRatio = videoScenes / sceneCount;
  const staticRatio = (imageScenes + generatedScenes) / sceneCount;
  const transitionPressure = sceneCount >= 10 ? 0.08 : 0;
  const complexity = Math.min(1, videoRatio + transitionPressure);
  const crf = pickDynamicCrf({ complexity, staticRatio, videoRatio });

  return {
    crf,
    complexity,
    videoScenes,
    imageScenes,
    generatedScenes,
  };
}

function pickDynamicCrf({ complexity, staticRatio, videoRatio }) {
  if (videoRatio >= 0.65 || complexity >= 0.72) return clampCrf(profile.motionCrf);
  if (staticRatio >= 0.85) return clampCrf(profile.staticCrf);
  return clampCrf(profile.mixedCrf);
}

function clampCrf(value) {
  return Math.max(18, Math.min(35, Math.round(Number(value) || profile.crf)));
}

function getNumberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getFfmpegThreadCount() {
  const value = Number(process.env.FFMPEG_THREADS || 1);
  if (!Number.isFinite(value) || value < 1) return '1';
  return String(Math.min(2, Math.floor(value)));
}

function runFfmpeg(args, { totalDuration, timeoutMs, onProgress }) {
  return new Promise((resolve, reject) => {
    const child = spawn(getFfmpegPath(), args, {
      detached: process.platform !== 'win32',
      windowsHide: true,
    });
    let stderr = '';
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      killProcessTree(child);
    }, timeoutMs);

    child.stderr.on('data', (chunk) => {
      const raw = chunk.toString();
      stderr += raw;

      const progress = parseFfmpegProgress(raw);
      if (progress.seconds !== null && totalDuration > 0) {
        onProgress?.({
          percent: Math.min(99, Math.round((progress.seconds / totalDuration) * 100)),
          seconds: progress.seconds,
          frame: progress.frame,
          fps: progress.fps,
          speed: progress.speed,
        });
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);

      if (timedOut) {
        reject(new Error(`FFmpeg timed out after ${Math.round(timeoutMs / 1000)} seconds.`));
        return;
      }

      if (code === 0) {
        onProgress?.({ percent: 100 });
        resolve();
        return;
      }

      reject(new Error(`FFmpeg failed with code ${code}: ${stderr.slice(-4000)}`));
    });
  });
}

function killProcessTree(child) {
  if (!child?.pid) return;

  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { windowsHide: true, stdio: 'ignore' });
      return;
    }

    process.kill(-child.pid, 'SIGKILL');
  } catch (error) {
    try {
      child.kill('SIGKILL');
    } catch {
      // Ignore cleanup failures; the original timeout error is more useful.
    }
  }
}

function parseFfmpegProgress(value) {
  const match = value.match(/time=(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)/);
  const frame = value.match(/frame=\s*(\d+)/);
  const fps = value.match(/fps=\s*([\d.]+)/);
  const speed = value.match(/speed=\s*([^\s]+)/);

  return {
    seconds: match ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) : null,
    frame: frame ? Number(frame[1]) : undefined,
    fps: fps ? Number(fps[1]) : undefined,
    speed: speed ? speed[1] : undefined,
  };
}

function getFfmpegPath() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  if (ffmpegStaticPath && fs.existsSync(ffmpegStaticPath)) return ffmpegStaticPath;
  return process.env.FFMPEG_PATH || 'ffmpeg';
}

function buildSafeFrames(renderProfile) {
  const square = Math.min(renderProfile.width, renderProfile.height);
  const fourByFiveHeight = Math.min(renderProfile.height, Math.round((renderProfile.width * 5) / 4));

  return {
    '4:5': {
      width: renderProfile.width,
      height: fourByFiveHeight,
      x: 0,
      y: Math.round((renderProfile.height - fourByFiveHeight) / 2),
    },
    '1:1': {
      width: square,
      height: square,
      x: Math.round((renderProfile.width - square) / 2),
      y: Math.round((renderProfile.height - square) / 2),
    },
  };
}

function px(value) {
  return Math.max(1, Math.round(Number(value) * renderScale));
}

async function getFfmpegSupportsDrawtext() {
  if (!drawtextSupportPromise) {
    drawtextSupportPromise = runCommand(getFfmpegPath(), ['-hide_banner', '-filters'], 5000)
      .then((output) => output.includes(' drawtext '))
      .catch((error) => {
        console.warn('Could not inspect FFmpeg filters; disabling drawtext overlays:', error.message);
        return false;
      });
  }

  return drawtextSupportPromise;
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
      if (timedOut) reject(new Error(`${path.basename(command)} filter check timed out.`));
      else if (code === 0) resolve(output);
      else reject(new Error(`${path.basename(command)} filter check exited with code ${code}: ${output.slice(-1000)}`));
    });
  });
}

function getUrlExtension(url) {
  try {
    return path.extname(new URL(url).pathname);
  } catch {
    return '';
  }
}

function getDataUrlExtension(value) {
  const match = String(value || '').match(/^data:([^;,]+)/i);
  const mimeType = String(match?.[1] || '').toLowerCase();
  if (mimeType.includes('wav')) return '.wav';
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) return '.mp3';
  if (mimeType.includes('mp4')) return '.mp4';
  if (mimeType.includes('quicktime')) return '.mov';
  if (mimeType.includes('webm')) return '.webm';
  if (mimeType.includes('png')) return '.png';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return '.jpg';
  if (mimeType.includes('webp')) return '.webp';
  return '';
}

function extensionFromHint(value) {
  const normalized = value.toLowerCase();
  if (normalized.includes('png')) return '.png';
  if (normalized.includes('jpeg') || normalized.includes('jpg')) return '.jpg';
  if (normalized.includes('webp')) return '.webp';
  if (normalized.includes('gif')) return '.gif';
  if (normalized.includes('mp4')) return '.mp4';
  if (normalized.includes('quicktime') || normalized.includes('mov')) return '.mov';
  if (normalized.includes('webm')) return '.webm';
  if (normalized.includes('mpeg') || normalized.includes('mp3')) return '.mp3';
  if (normalized.includes('wav')) return '.wav';
  return '';
}

function safeCacheName(value) {
  return String(value || 'asset').replace(/[^a-z0-9_-]/gi, '_').slice(0, 100);
}

function getSafeFrame(value) {
  return safeFrames[value] || safeFrames['4:5'];
}

function buildTextCardFilter(textCard, outputLabel, options = {}) {
  if (!textCard) return `[${outputLabel}]`;

  const accent = normalizeFfmpegColor(textCard.accentColor || '0x5eead4');
  if (options.supportsDrawtext === false) {
    return `,drawbox=x=${px(72)}:y=${px(230)}:w=${px(936)}:h=${px(10)}:color=${accent}:t=fill[${outputLabel}]`;
  }

  const headline = splitText(textCard.headline || 'Your idea becomes a video', 22).slice(0, 3);
  const body = splitText(textCard.body || '', 34).slice(0, 2);
  const design = getReadableTextDesign(textCard);

  const filters = [
    `drawbox=x=${px(72)}:y=${px(230)}:w=${px(936)}:h=${px(10)}:color=${accent}:t=fill`,
    ...headline.map((line, index) => (
      `drawtext=text='${escapeDrawtext(line)}':fontcolor=${design.headlineColor}:fontsize=${px(78)}:x=${px(72)}:y=${px(310 + index * 92)}:borderw=${px(3)}:bordercolor=${design.strokeColor}:box=1:boxcolor=${design.panelColor}:boxborderw=${px(18)}`
    )),
    ...body.map((line, index) => (
      `drawtext=text='${escapeDrawtext(line)}':fontcolor=${design.bodyColor}:fontsize=${px(42)}:x=${px(72)}:y=${px(640 + index * 58)}:borderw=${px(2)}:bordercolor=${design.strokeColor}`
    )),
  ];

  return `,${filters.join(',')}[${outputLabel}]`;
}

function getReadableTextDesign(textCard) {
  const background = normalizeHexColor(textCard.backgroundColor || '0x101014');
  const useLightText = getContrastRatio(background, '#ffffff') >= getContrastRatio(background, '#111827');

  return {
    headlineColor: normalizeFfmpegColor(textCard.headlineColor || (useLightText ? '0xffffff' : '0x111827')),
    bodyColor: normalizeFfmpegColor(textCard.bodyColor || (useLightText ? '0xe5e7eb' : '0x1f2937')),
    strokeColor: normalizeFfmpegColor(textCard.strokeColor || (useLightText ? '0x000000' : '0xffffff')),
    panelColor: normalizePanelColor(textCard.panelColor || (useLightText ? 'black@0.42' : 'white@0.72')),
  };
}

function getContrastRatio(colorA, colorB) {
  const a = getRelativeLuminance(colorA);
  const b = getRelativeLuminance(colorB);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(color) {
  const channels = hexToRgb(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function hexToRgb(color) {
  const raw = normalizeHexColor(color).slice(1);
  return [
    Number.parseInt(raw.slice(0, 2), 16),
    Number.parseInt(raw.slice(2, 4), 16),
    Number.parseInt(raw.slice(4, 6), 16),
  ];
}

function buildCaptionFilter(captions, inputLabel, outputLabel, options = {}) {
  if (options.supportsDrawtext === false) return `[${inputLabel}]null[${outputLabel}]`;

  const cues = normalizeCaptions(captions);
  if (!cues.length) return `[${inputLabel}]null[${outputLabel}]`;

  const drawFilters = cues.flatMap((cue) => {
    const lines = splitText(cue.text, 28).slice(0, 2);
    const baseY = px(lines.length > 1 ? 1390 : 1438);

    return lines.map((line, lineIndex) => (
      `drawtext=text='${escapeDrawtext(line)}':fontcolor=white:fontsize=${px(62)}:x=(w-text_w)/2:y=${baseY + lineIndex * px(74)}:box=1:boxcolor=black@0.58:boxborderw=${px(24)}:enable='between(t,${cue.start},${cue.end})'`
    ));
  });

  return `[${inputLabel}]${drawFilters.join(',')}[${outputLabel}]`;
}

function normalizeCaptions(captions) {
  if (!Array.isArray(captions)) return [];

  return captions
    .map((caption) => ({
      text: String(caption?.text || '').trim(),
      start: roundTime(Number(caption?.start)),
      end: roundTime(Number(caption?.end)),
    }))
    .filter((caption) => caption.text && Number.isFinite(caption.start) && Number.isFinite(caption.end) && caption.end > caption.start)
    .slice(0, 120);
}

function buildFallbackTextCard(scene, index) {
  const backgroundColor = pickFallbackColor(index);
  const useLightText = getContrastRatio(backgroundColor, '#ffffff') >= getContrastRatio(backgroundColor, '#111827');

  return {
    headline: scene?.textCard?.headline || scene?.role || `Scene ${index + 1}`,
    body: scene?.textCard?.body || scene?.source?.query || 'AI-built visual scene from your voiceover.',
    backgroundColor,
    accentColor: index % 2 === 0 ? '0x5eead4' : '0xfbbf24',
    headlineColor: useLightText ? '0xffffff' : '0x111827',
    bodyColor: useLightText ? '0xe5e7eb' : '0x1f2937',
    strokeColor: useLightText ? '0x000000' : '0xffffff',
    panelColor: useLightText ? 'black@0.42' : 'white@0.72',
  };
}

function pickFallbackColor(index) {
  return ['0x101014', '0x0f172a', '0x111827', '0x172554'][index % 4];
}

function normalizeFfmpegColor(value) {
  const raw = String(value || '').trim();
  if (/^0x[0-9a-f]{6}$/i.test(raw)) return raw;
  if (/^#[0-9a-f]{6}$/i.test(raw)) return `0x${raw.slice(1)}`;
  return '0x101014';
}

function normalizeHexColor(value) {
  const raw = String(value || '').trim();
  if (/^0x[0-9a-f]{6}$/i.test(raw)) return `#${raw.slice(2)}`.toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
  return '#101014';
}

function normalizePanelColor(value) {
  const raw = String(value || '').trim();
  if (/^(black|white|0x[0-9a-f]{6}|#[0-9a-f]{6})(@\d?(?:\.\d+)?)?$/i.test(raw)) {
    return raw.startsWith('#') ? normalizeFfmpegColor(raw) : raw;
  }

  return 'black@0.42';
}

function splitText(value, maxChars) {
  const words = String(value || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let line = '';

  for (const word of words) {
    for (const chunk of chunkLongWord(word, maxChars)) {
      const next = line ? `${line} ${chunk}` : chunk;
      if (next.length > maxChars && line) {
        lines.push(line);
        line = chunk;
      } else {
        line = next;
      }
    }
  }

  if (line) lines.push(line);
  return lines.length ? lines : ['Your idea becomes a video'];
}

function chunkLongWord(word, maxChars) {
  const safeWord = String(word || '');
  if (safeWord.length <= maxChars) return [safeWord];

  const chunks = [];
  for (let index = 0; index < safeWord.length; index += maxChars) {
    chunks.push(safeWord.slice(index, index + maxChars));
  }
  return chunks;
}

function escapeDrawtext(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    .replace(/'/g, "\\'")
    .replace(/%/g, '\\%')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]');
}

function roundTime(value) {
  return Math.round(value * 1000) / 1000;
}
