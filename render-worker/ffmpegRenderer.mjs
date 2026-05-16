import crypto from 'crypto';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import ffmpegStaticPath from 'ffmpeg-static';
import { downloadGoogleDriveFile, isGoogleDriveConfigured } from '../services/assets/googleDriveClient.mjs';
import { buildPythonRenderPlan, renderPythonVideo } from './pythonRendererBridge.mjs';
import { ensureRenderWorkspace, getWorkspaceAssetDir } from './renderWorkspace.mjs';

const workspace = ensureRenderWorkspace();
const cacheDir = workspace.processedAssets.cache;
const profile = {
  width: 1080,
  height: 1920,
  audioBitrate: '128k',
  crf: 26,
  preset: process.env.FFMPEG_PRESET || 'ultrafast',
};

const safeFrames = {
  '4:5': { width: 1080, height: 1350, x: 0, y: 285 },
  '1:1': { width: 1080, height: 1080, x: 0, y: 420 },
};

ensureRenderWorkspace();

export async function renderVideoWithFFmpeg(data, outputPath, options = {}) {
  const { timeline, voiceoverUrl } = data;
  const totalDuration = Math.max(...timeline.scenes.map((scene) => scene.end || 0));
  const assets = await resolveTimelineAssets(timeline, voiceoverUrl);

  if (shouldUsePythonFullRenderer()) {
    try {
      await renderPythonVideo({
        timeline,
        assets,
        totalDuration,
        ffmpegPath: getFfmpegPath(),
        profile,
      }, outputPath, {
        timeoutMs: Number(process.env.RENDER_TIMEOUT_MS || 15 * 60 * 1000),
      });
      options.onProgress?.({ percent: 100 });
      return outputPath;
    } catch (error) {
      if (process.env.PYTHON_FULL_RENDER_REQUIRED === '1') throw error;
      console.warn('Python full renderer failed; falling back to Node FFmpeg execution:', error.message);
    }
  }

  const renderPlan = await buildRenderPlan({ timeline, assets, totalDuration });
  const args = buildFfmpegArgs(assets, renderPlan, outputPath);

  await runFfmpeg(args, {
    totalDuration,
    timeoutMs: Number(process.env.RENDER_TIMEOUT_MS || 15 * 60 * 1000),
    onProgress: options.onProgress,
  });

  return outputPath;
}

async function buildRenderPlan({ timeline, assets, totalDuration }) {
  if (!shouldUsePythonRenderer()) {
    return {
      engine: 'node',
      filterGraph: buildComplexFilters(timeline, assets, totalDuration),
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
      filterGraph: buildComplexFilters(timeline, assets, totalDuration),
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
    voiceover = { path: voiceoverPath, index: allInputs.length };
    allInputs.push(voiceover);
  }

  return { allInputs, sceneInputs, voiceover };
}

async function resolveSceneAssetPath(source, canRenderSource) {
  if (!canRenderSource) return null;

  try {
    if (source.driveFileId) {
      return await getCachedDriveAsset(source.driveFileId, source.url || source.assetId || source.mimeType || source.type);
    }

    if (source.url) {
      return await getCachedAsset(source.url, source.type?.includes('image') ? '.jpg' : '.mp4');
    }
  } catch (error) {
    console.warn('Scene asset unavailable; using generated text card fallback:', error);
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
  const ext = getUrlExtension(url) || fallbackExt;
  const cachePath = path.join(getWorkspaceAssetDir(ext), `${hash}${ext}`);

  if (fs.existsSync(cachePath) && fs.statSync(cachePath).size > 0) return cachePath;

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

function buildComplexFilters(timeline, assets, totalDuration) {
  const filters = [];
  const sceneLabels = [];

  timeline.scenes.forEach((scene, index) => {
    const input = assets.sceneInputs[index];
    const label = `v${index}`;
    const duration = Math.max(0.5, (scene.end || 0) - (scene.start || 0));

    const frame = input.safeFrame;
    const baseFilter = `[${input.inputIndex}:v]scale=${frame.width}:${frame.height}:force_original_aspect_ratio=decrease,pad=${frame.width}:${frame.height}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,trim=duration=${duration},setpts=PTS-STARTPTS,format=yuv420p[${label}_safe];color=c=black:s=${profile.width}x${profile.height}:r=30:d=${duration}[${label}_canvas];[${label}_canvas][${label}_safe]overlay=x=${frame.x}:y=${frame.y}:shortest=1`;
    const textFilter = buildTextCardFilter(input.textCard, label);
    filters.push(`${baseFilter}${textFilter}`);
    sceneLabels.push(`[${label}]`);
  });

  filters.push(`${sceneLabels.join('')}concat=n=${sceneLabels.length}:v=1:a=0[v_concat]`);
  filters.push(buildCaptionFilter(timeline.captions || [], 'v_concat', 'v_base'));

  if (assets.voiceover) {
    filters.push(`[${assets.voiceover.index}:a]volume=1.0,atrim=duration=${totalDuration}[a_final]`);
  } else {
    filters.push(`anullsrc=r=44100:cl=stereo:d=${totalDuration}[a_final]`);
  }

  return filters.join(';');
}

function buildFfmpegArgs(assets, renderPlan, outputPath) {
  const args = ['-y', '-hide_banner'];
  const filterGraph = typeof renderPlan === 'string' ? renderPlan : renderPlan.filterGraph;
  const videoMap = typeof renderPlan === 'string' ? '[v_base]' : renderPlan.videoMap || '[v_base]';
  const audioMap = typeof renderPlan === 'string' ? '[a_final]' : renderPlan.audioMap || '[a_final]';

  assets.allInputs.forEach((input) => {
    if (input.generatedColor) {
      args.push('-f', 'lavfi', '-t', String(input.duration), '-i', `color=c=${input.generatedColor}:s=${profile.width}x${profile.height}:r=30`);
      return;
    }

    if (input.isImage) args.push('-loop', '1', '-t', String(input.duration));
    args.push('-i', input.path);
  });

  args.push(
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
    '0',
    '-crf',
    String(profile.crf),
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

function runFfmpeg(args, { totalDuration, timeoutMs, onProgress }) {
  return new Promise((resolve, reject) => {
    const child = spawn(getFfmpegPath(), args, { windowsHide: true });
    let stderr = '';
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stderr.on('data', (chunk) => {
      const raw = chunk.toString();
      stderr += raw;

      const seconds = parseFfmpegSeconds(raw);
      if (seconds !== null && totalDuration > 0) {
        onProgress?.({ percent: Math.min(99, Math.round((seconds / totalDuration) * 100)) });
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

function parseFfmpegSeconds(value) {
  const match = value.match(/time=(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)/);
  if (!match) return null;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

function getFfmpegPath() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  if (ffmpegStaticPath && fs.existsSync(ffmpegStaticPath)) return ffmpegStaticPath;
  return process.env.FFMPEG_PATH || 'ffmpeg';
}

function getUrlExtension(url) {
  try {
    return path.extname(new URL(url).pathname);
  } catch {
    return '';
  }
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

function buildTextCardFilter(textCard, outputLabel) {
  if (!textCard) return `[${outputLabel}]`;

  const headline = splitText(textCard.headline || 'Your idea becomes a video', 22).slice(0, 3);
  const body = splitText(textCard.body || '', 34).slice(0, 2);
  const accent = normalizeFfmpegColor(textCard.accentColor || '0x5eead4');
  const design = getReadableTextDesign(textCard);

  const filters = [
    `drawbox=x=72:y=230:w=936:h=10:color=${accent}:t=fill`,
    ...headline.map((line, index) => (
      `drawtext=text='${escapeDrawtext(line)}':fontcolor=${design.headlineColor}:fontsize=78:x=72:y=${310 + index * 92}:borderw=3:bordercolor=${design.strokeColor}:box=1:boxcolor=${design.panelColor}:boxborderw=18`
    )),
    ...body.map((line, index) => (
      `drawtext=text='${escapeDrawtext(line)}':fontcolor=${design.bodyColor}:fontsize=42:x=72:y=${640 + index * 58}:borderw=2:bordercolor=${design.strokeColor}`
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

function buildCaptionFilter(captions, inputLabel, outputLabel) {
  const cues = normalizeCaptions(captions);
  if (!cues.length) return `[${inputLabel}]null[${outputLabel}]`;

  const drawFilters = cues.flatMap((cue) => {
    const lines = splitText(cue.text, 28).slice(0, 2);
    const baseY = lines.length > 1 ? 1390 : 1438;

    return lines.map((line, lineIndex) => (
      `drawtext=text='${escapeDrawtext(line)}':fontcolor=white:fontsize=62:x=(w-text_w)/2:y=${baseY + lineIndex * 74}:box=1:boxcolor=black@0.58:boxborderw=24:enable='between(t,${cue.start},${cue.end})'`
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
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines.length ? lines : ['Your idea becomes a video'];
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
