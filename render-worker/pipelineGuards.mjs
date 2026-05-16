import fs from 'fs';
import path from 'path';
import { ensureRenderWorkspace } from './renderWorkspace.mjs';
import { getVideoPipelineConfig } from './videoPipelineConfig.mjs';

const DEFAULT_DURATION_SECONDS = 30;
const MAX_SCENES = 24;
const MAX_CAPTIONS = 180;
const CAPTION_LINE_MAX_CHARS = 20;
const TEXT_CARD_HEADLINE_MAX_CHARS = 22;
const TEXT_CARD_BODY_MAX_CHARS = 34;
const pipelineConfig = getVideoPipelineConfig();

export function normalizeRenderTimeline(input, options = {}) {
  const fallbackTitle = sanitizeDisplayText(options.title || 'Your video') || 'Your video';
  const requestedDuration = clampNumber(
    Number(input?.metadata?.duration || options.duration || DEFAULT_DURATION_SECONDS),
    1,
    pipelineConfig.maxDurationSec,
  );
  const rawScenes = Array.isArray(input?.scenes) ? input.scenes : [];
  const scenes = normalizeScenes(rawScenes, requestedDuration, fallbackTitle);
  const duration = roundTime(Math.max(...scenes.map((scene) => scene.end), requestedDuration));
  const captions = normalizeCaptions(input?.captions, duration, fallbackTitle);

  return {
    ...(input || {}),
    metadata: {
      ...(input?.metadata || {}),
      duration,
      fps: clampNumber(Number(input?.metadata?.fps || 30), 24, 60),
      aspectRatio: input?.metadata?.aspectRatio || 'Portrait (9:16)',
      quality: input?.metadata?.quality || pipelineConfig.qualityPreset,
    },
    scenes,
    captions,
  };
}

export function sanitizeDisplayText(value, fallback = '') {
  const cleaned = String(value || '')
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || fallback;
}

export function wrapDisplayText(value, maxChars = CAPTION_LINE_MAX_CHARS, maxLines = 2, fallback = '') {
  const text = sanitizeDisplayText(value, fallback);
  if (!text) return '';

  const lines = splitTextForSafeZone(text, maxChars).slice(0, maxLines);
  return lines.join('\n');
}

export function createRenderReport({ userId, jobId, mode = 'render_worker' }) {
  const workspace = ensureRenderWorkspace();
  const reportPath = path.join(workspace.processedAssets.root, `render-report-${safeFileName(jobId)}.json`);
  const report = {
    userId,
    jobId,
    mode,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    stages: [],
  };

  return {
    path: reportPath,
    stage(name, data = {}) {
      report.stages.push({
        name,
        at: new Date().toISOString(),
        ...redactReportData(data),
      });
      writeJsonSafe(reportPath, report);
    },
    finish(status, data = {}) {
      report.finishedAt = new Date().toISOString();
      report.status = status;
      Object.assign(report, redactReportData(data));
      writeJsonSafe(reportPath, report);
    },
  };
}

function normalizeScenes(rawScenes, requestedDuration, fallbackTitle) {
  if (!rawScenes.length) {
    return [buildFallbackScene(0, 0, requestedDuration, fallbackTitle)];
  }

  let cursor = 0;
  return rawScenes
    .slice(0, MAX_SCENES)
    .map((scene, index) => {
      const start = Number(scene?.start);
      const end = Number(scene?.end);
      const safeStart = Number.isFinite(start) && start >= cursor ? start : cursor;
      const safeEnd = Number.isFinite(end) && end > safeStart ? end : safeStart + 4;
      cursor = roundTime(safeEnd);

      return {
        ...scene,
        id: sanitizeDisplayText(scene?.id, `scene_${index + 1}`).replace(/[^a-zA-Z0-9_-]+/g, '_'),
        start: roundTime(safeStart),
        end: roundTime(safeEnd),
        role: sanitizeDisplayText(scene?.role, index === 0 ? 'Hook' : `Scene ${index + 1}`),
        source: normalizeSceneSource(scene?.source),
        crop: {
          ...(scene?.crop || {}),
          safeFrame: scene?.crop?.safeFrame || '4:5',
        },
        textCard: normalizeTextCard(scene?.textCard, scene, index, fallbackTitle),
      };
    })
    .filter((scene) => scene.end > scene.start);
}

function normalizeCaptions(rawCaptions, duration, fallbackTitle) {
  const captions = Array.isArray(rawCaptions) ? rawCaptions : [];
  const normalized = captions
    .slice(0, MAX_CAPTIONS)
    .map((caption, index) => {
      const start = clampNumber(Number(caption?.start), 0, duration);
      const rawEnd = Number(caption?.end);
      const end = Number.isFinite(rawEnd) && rawEnd > start ? rawEnd : start + 2.5;

      return {
        id: sanitizeDisplayText(caption?.id, `caption_${index + 1}`).replace(/[^a-zA-Z0-9_-]+/g, '_'),
        start: roundTime(start),
        end: roundTime(Math.min(duration, Math.max(start + 0.25, end))),
        text: wrapDisplayText(caption?.text, CAPTION_LINE_MAX_CHARS, 2, fallbackTitle).slice(0, 220),
      };
    })
    .filter((caption) => caption.text && caption.end > caption.start);

  if (normalized.length) return normalized;

  return [{
    id: 'caption_1',
    start: 0,
    end: Math.min(duration, 4),
    text: wrapDisplayText(fallbackTitle, CAPTION_LINE_MAX_CHARS, 2, 'Your video'),
  }];
}

function normalizeSceneSource(source) {
  const url = typeof source?.url === 'string' ? source.url.trim() : null;
  const driveFileId = typeof source?.driveFileId === 'string' ? source.driveFileId.trim() : '';
  const type = sanitizeDisplayText(source?.type, url || driveFileId ? 'uploaded_image' : 'text_card').toLowerCase();

  if (!url && !driveFileId) {
    return {
      type: 'text_card',
      url: null,
      query: sanitizeDisplayText(source?.query, 'text card'),
    };
  }

  return {
    ...(source || {}),
    type,
    url,
    driveFileId,
    query: sanitizeDisplayText(source?.query || source?.assetId || source?.filename, 'visual'),
    filename: sanitizeDisplayText(source?.filename || source?.fileName, ''),
    mimeType: sanitizeDisplayText(source?.mimeType, ''),
  };
}

function normalizeTextCard(textCard, scene, index, fallbackTitle) {
  return {
    ...(textCard || {}),
    headline: wrapDisplayText(textCard?.headline || scene?.role, TEXT_CARD_HEADLINE_MAX_CHARS, 3, index === 0 ? fallbackTitle : `Scene ${index + 1}`).slice(0, 120),
    body: wrapDisplayText(textCard?.body || scene?.source?.query, TEXT_CARD_BODY_MAX_CHARS, 2, 'AI-built visual scene from your voiceover.').slice(0, 220),
    backgroundColor: normalizeColor(textCard?.backgroundColor, index),
    accentColor: normalizeColor(textCard?.accentColor, index + 1),
  };
}

function buildFallbackScene(index, start, end, title) {
  return {
    id: `scene_${index + 1}`,
    start: roundTime(start),
    end: roundTime(Math.max(start + 1, end)),
    role: 'Fallback',
    source: {
      type: 'text_card',
      url: null,
      query: title,
    },
    crop: {
      safeFrame: '4:5',
    },
    textCard: {
      headline: title,
      body: 'Your audio is being turned into a clean video.',
      backgroundColor: '0x101014',
      accentColor: '0x5eead4',
    },
  };
}

function normalizeColor(value, index) {
  const raw = String(value || '').trim();
  if (/^0x[0-9a-f]{6}$/i.test(raw)) return raw;
  if (/^#[0-9a-f]{6}$/i.test(raw)) return `0x${raw.slice(1)}`;
  return ['0x101014', '0x052e2b', '0x111827', '0x0f172a'][index % 4];
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function roundTime(value) {
  return Math.round(Number(value || 0) * 1000) / 1000;
}

function splitTextForSafeZone(value, maxChars) {
  const words = sanitizeDisplayText(value).split(' ').filter(Boolean);
  const lines = [];
  let line = '';

  for (const word of words) {
    const chunks = chunkLongWord(word, maxChars);
    for (const chunk of chunks) {
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
  return lines.length ? lines : ['Your video'];
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

function writeJsonSafe(filePath, value) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
  } catch (error) {
    console.warn(`Render report write failed for ${filePath}:`, error);
  }
}

function redactReportData(data) {
  const next = { ...(data || {}) };
  for (const key of Object.keys(next)) {
    if (/secret|token|authorization|apiKey|api_key|signature/i.test(key)) {
      next[key] = '[redacted]';
    }
  }
  return next;
}

function safeFileName(value) {
  return String(value || 'render').replace(/[^a-z0-9_-]/gi, '_').slice(0, 120);
}
