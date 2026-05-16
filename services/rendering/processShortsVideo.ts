import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import ffmpegStaticPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import {
  SHORTS_CONFIG,
  buildMobileAudioFilter,
  getShortsFilter,
  getVideoStyleConfig,
  type ZoomEvent,
} from './videoStyles';

type ProcessShortsVideoOptions = {
  style?: string;
  subtitlesPath?: string;
  subtitleFilter?: string;
  progressColor?: string;
  timeoutMs?: number;
  autoJumpCuts?: boolean;
  autoZoomEffects?: boolean;
  autoCaptionEffects?: boolean;
  zoomEvents?: ZoomEvent[];
  captionEvents?: KineticCaptionEvent[];
  iconEvents?: IconOverlayEvent[];
  swooshPath?: string;
  jumpCutWorkspaceDir?: string;
  jobId?: string;
  transcriptPath?: string;
  onJumpCut?: (result: JumpCutResult) => void;
  onProgress?: (progress: { percent: number; seconds: number; raw: string }) => void;
};

type JumpCutResult = {
  success: boolean;
  outputPath?: string;
  inputDuration?: number;
  outputDuration?: number;
  removedSeconds?: number;
  cuts?: Array<{ start: number; end: number }>;
  keepRanges?: Array<{ start: number; end: number }>;
  reason?: string;
  error?: string;
};

type TranscriptWord = {
  word?: string;
  text?: string;
  start?: number;
  startTime?: number;
  end?: number;
  endTime?: number;
};

type TranscriptSegment = {
  text?: string;
  start?: number;
  startTime?: number;
  end?: number;
  endTime?: number;
  words?: TranscriptWord[];
};

type KineticCaptionEvent = {
  text: string;
  start: number;
  end: number;
  color?: string;
  fontSize?: number;
  reason?: string;
};

type IconOverlayEvent = {
  keyword: string;
  iconPath?: string;
  start: number;
  end: number;
  position?: 'above' | 'side';
};

export async function processShortsVideo(
  inputPath: string,
  outputPath: string,
  options: ProcessShortsVideoOptions = {},
) {
  let renderInputPath = inputPath;
  let jumpCutPath = '';
  let jumpCutResult: JumpCutResult | null = null;

  if (options.autoJumpCuts) {
    jumpCutPath = getJumpCutOutputPath(options);
    try {
      jumpCutResult = await createJumpCutInput(inputPath, jumpCutPath, options);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Python jump cut failed.';
      console.warn(`Skipping face-camera jump cuts: ${message}`);
      jumpCutResult = { success: false, reason: 'python_jump_cut_unavailable', error: message };
    }
    if (jumpCutResult.success && jumpCutResult.outputPath && fs.existsSync(jumpCutResult.outputPath)) {
      renderInputPath = jumpCutResult.outputPath;
      options.onJumpCut?.(jumpCutResult);
    }
  }

  const duration = await probeVideoDuration(renderInputPath);
  const hasAudio = await probeVideoHasAudio(renderInputPath);
  const style = getVideoStyleConfig(options.style);
  const zoomEvents = getFaceCameraZoomEvents(duration, options);
  const captionEvents = getKineticCaptionEvents(duration, options);
  const iconEvents = getIconOverlayEvents(duration, options);
  const swooshPath = options.autoZoomEffects !== false
    ? getSwooshSoundPath(options.swooshPath)
    : null;
  const args = buildShortsFfmpegArgs({
    inputPath: renderInputPath,
    outputPath,
    duration,
    hasAudio,
    styleName: style.name,
    zoomEvents,
    captionEvents,
    iconEvents,
    swooshPath,
    progressColor: options.progressColor || style.progressColor,
    subtitleFilter: options.subtitleFilter || (options.subtitlesPath ? buildSubtitleFilter(options.subtitlesPath) : null),
  });

  try {
    await runFfmpegWithProgress(args, {
      duration,
      timeoutMs: options.timeoutMs || 15 * 60 * 1000,
      onProgress: options.onProgress,
    });
  } finally {
    if (jumpCutPath && jumpCutPath !== inputPath) cleanupFile(jumpCutPath);
  }

  return { outputPath, duration, jumpCuts: jumpCutResult, zoomEvents, captionEvents, iconEvents, swooshPath };
}

export async function probeVideoDuration(inputPath: string) {
  const output = await runProcess(getFfprobePath(), [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    inputPath,
  ]);

  const duration = Number.parseFloat(output.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('Could not read video duration with ffprobe.');
  }

  return Math.round(duration * 100) / 100;
}

async function probeVideoHasAudio(inputPath: string) {
  const output = await runProcess(getFfprobePath(), [
    '-v',
    'error',
    '-select_streams',
    'a:0',
    '-show_entries',
    'stream=codec_type',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    inputPath,
  ]);

  return output.stdout.trim() === 'audio';
}

function buildShortsFfmpegArgs({
  inputPath,
  outputPath,
  duration,
  hasAudio,
  styleName,
  zoomEvents,
  captionEvents,
  iconEvents,
  swooshPath,
  progressColor,
  subtitleFilter,
}: {
  inputPath: string;
  outputPath: string;
  duration: number;
  hasAudio: boolean;
  styleName: string;
  zoomEvents: ZoomEvent[];
  captionEvents: KineticCaptionEvent[];
  iconEvents: IconOverlayEvent[];
  swooshPath: string | null;
  progressColor: string;
  subtitleFilter: string | null;
}) {
  const videoFilter = getShortsFilter(styleName, zoomEvents);
  const baseAudioInputIndex = hasAudio ? 0 : 1;
  const swooshInputIndex = swooshPath ? (hasAudio ? 1 : 2) : -1;
  const iconInputStartIndex = 1 + (hasAudio ? 0 : 1) + (swooshPath ? 1 : 0);
  const audioFilter = buildMobileAudioFilter(`${baseAudioInputIndex}:a`);
  const sfxMix = buildSwooshMixFilter(swooshInputIndex, zoomEvents);
  const finalAudioMap = sfxMix ? '[aout_mix]' : '[aout]';
  const visualTail = buildVisualTail({
    duration,
    progressColor,
    subtitleFilter,
    captionEvents,
    iconEvents,
    iconInputStartIndex,
  });

  return [
    '-y',
    '-nostdin',
    '-hide_banner',
    '-stats',
    '-i',
    inputPath,
    ...(hasAudio ? [] : ['-f', 'lavfi', '-t', String(duration), '-i', 'anullsrc=r=44100:cl=stereo']),
    ...(swooshPath ? ['-i', swooshPath] : []),
    ...iconEvents.flatMap((event) => ['-loop', '1', '-framerate', '30', '-i', event.iconPath || '']),
    '-filter_complex',
    [
      videoFilter,
      visualTail,
      audioFilter,
      ...(sfxMix ? [sfxMix] : []),
    ].join(';'),
    '-map',
    '[vout]',
    '-map',
    finalAudioMap,
    '-c:v',
    'libx264',
    '-preset',
    process.env.FFMPEG_PRESET || SHORTS_CONFIG.preset,
    '-crf',
    SHORTS_CONFIG.crf,
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '160k',
    '-movflags',
    '+faststart',
    outputPath,
  ];
}

function buildVisualTail({
  duration,
  progressColor,
  subtitleFilter,
  captionEvents,
  iconEvents,
  iconInputStartIndex,
}: {
  duration: number;
  progressColor: string;
  subtitleFilter: string | null;
  captionEvents: KineticCaptionEvent[];
  iconEvents: IconOverlayEvent[];
  iconInputStartIndex: number;
}) {
  const progressFilter = `drawbox=x=0:y=ih-${SHORTS_CONFIG.progressHeight}:w='iw*t/${duration}':h=${SHORTS_CONFIG.progressHeight}:color=${progressColor}:t=fill`;
  const filters = [`[viral_shorts_v]${progressFilter}${subtitleFilter ? `,${subtitleFilter}` : ''}[caption_base]`];
  let currentLabel = 'caption_base';

  captionEvents.slice(0, Number(process.env.FACE_VIDEO_MAX_CAPTION_EVENTS || 80)).forEach((event, index) => {
    const nextLabel = `caption_text_${index}`;
    filters.push(`[${currentLabel}]${buildKineticDrawtextFilter(event)}[${nextLabel}]`);
    currentLabel = nextLabel;
  });

  iconEvents.slice(0, Number(process.env.FACE_VIDEO_MAX_ICON_EVENTS || 12)).forEach((event, index) => {
    const iconLabel = `keyword_icon_${index}`;
    const nextLabel = `caption_icon_${index}`;
    const size = Number(process.env.FACE_VIDEO_ICON_SIZE || 132);
    const x = event.position === 'side' ? '(W-w)/2+360' : '(W-w)/2';
    const y = event.position === 'side' ? 'H*0.62' : 'H*0.53';
    filters.push(`[${iconInputStartIndex + index}:v]scale=${size}:${size}:force_original_aspect_ratio=decrease,format=rgba[${iconLabel}]`);
    filters.push(`[${currentLabel}][${iconLabel}]overlay=x=${x}:y=${y}:enable='between(t,${roundSeconds(event.start)},${roundSeconds(event.end)})'[${nextLabel}]`);
    currentLabel = nextLabel;
  });

  filters.push(`[${currentLabel}]null[vout]`);
  return filters.join(';');
}

function buildKineticDrawtextFilter(event: KineticCaptionEvent) {
  const text = escapeDrawtext(event.text.toUpperCase());
  const color = event.color || getCaptionColor(event.text);
  const fontSize = Math.max(42, Math.min(96, Math.round(event.fontSize || Number(process.env.FACE_VIDEO_CAPTION_FONT_SIZE || 76))));
  const start = roundSeconds(event.start);
  const end = roundSeconds(event.end);
  const popEnd = roundSeconds(Math.min(end, start + 0.16));
  const y = `if(lt(t\\,${popEnd})\\,h*0.68+(${popEnd}-t)*180\\,h*0.68)`;

  return [
    `drawtext=text='${text}'`,
    `fontcolor=${color}`,
    `fontsize=${fontSize}`,
    'x=(w-text_w)/2',
    `y='${y}'`,
    'borderw=5',
    'bordercolor=black',
    'shadowcolor=black@0.75',
    'shadowx=4',
    'shadowy=4',
    `box=${process.env.FACE_VIDEO_CAPTION_BOX === '1' ? 1 : 0}`,
    'boxcolor=black@0.36',
    'boxborderw=20',
    `alpha='if(lt(t\\,${start})\\,0\\,if(lt(t\\,${popEnd})\\,(t-${start})/max(${popEnd - start}\\,0.001)\\,if(lt(t\\,${end})\\,1\\,0)))'`,
    `enable='between(t,${start},${end})'`,
    'fix_bounds=1',
  ].join(':');
}

function getFaceCameraZoomEvents(duration: number, options: ProcessShortsVideoOptions) {
  if (options.autoZoomEffects === false) return [];

  const explicitEvents = normalizeZoomEvents(options.zoomEvents || [], duration);
  if (explicitEvents.length) return explicitEvents;

  const transcriptEvents = normalizeZoomEvents(getTranscriptZoomEvents(options.transcriptPath), duration);
  if (transcriptEvents.length) return transcriptEvents;

  return buildFallbackZoomEvents(duration);
}

function normalizeZoomEvents(events: ZoomEvent[], duration: number) {
  const minSpacing = Number(process.env.FACE_VIDEO_ZOOM_MIN_SPACING_SECONDS || 2.2);
  const defaultDuration = Number(process.env.FACE_VIDEO_ZOOM_EVENT_DURATION_SECONDS || 0.55);
  const defaultScale = Number(process.env.FACE_VIDEO_ZOOM_SCALE || 1.12);
  const output: ZoomEvent[] = [];
  let lastStart = -Infinity;

  events
    .map((event) => ({
      ...event,
      start: roundSeconds(Number(event.start)),
      duration: roundSeconds(Number(event.duration || defaultDuration)),
      scale: roundSeconds(Number(event.scale || defaultScale)),
    }))
    .filter((event) => Number.isFinite(event.start) && event.start >= 0.15 && event.start < duration - 0.2)
    .sort((a, b) => a.start - b.start)
    .forEach((event, index) => {
      if (event.start - lastStart < minSpacing) return;
      output.push({
        ...event,
        direction: event.direction || (index % 2 === 0 ? 'in' : 'out'),
      });
      lastStart = event.start;
    });

  return output.slice(0, Number(process.env.FACE_VIDEO_MAX_ZOOM_EVENTS || 32));
}

function getTranscriptZoomEvents(transcriptPath?: string) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return [];

  try {
    const transcript = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
    const segments = getTranscriptSegments(transcript);
    const words = getTranscriptWords(transcript, segments);
    const events: ZoomEvent[] = [];

    segments.forEach((segment) => {
      const start = getStartSeconds(segment);
      if (start !== null) {
        events.push({ start, scale: 1.1, reason: 'sentence_start' });
      }
    });

    words.forEach((word) => {
      const text = normalizeWord(word.word || word.text || '');
      const start = getStartSeconds(word);
      if (start === null || !isHighEnergyWord(text)) return;
      events.push({
        start,
        scale: getHighEnergyScale(text),
        reason: `keyword:${text}`,
      });
    });

    return events;
  } catch (error) {
    console.warn(`Could not read zoom transcript ${transcriptPath}:`, error);
    return [];
  }
}

function getTranscriptSegments(transcript: any): TranscriptSegment[] {
  if (Array.isArray(transcript?.segments)) return transcript.segments;
  if (Array.isArray(transcript?.transcript?.segments)) return transcript.transcript.segments;
  if (Array.isArray(transcript?.items)) return transcript.items;
  return [];
}

function getTranscriptWords(transcript: any, segments: TranscriptSegment[]) {
  if (Array.isArray(transcript?.words)) return transcript.words as TranscriptWord[];
  if (Array.isArray(transcript?.transcript?.words)) return transcript.transcript.words as TranscriptWord[];
  return segments.flatMap((segment) => Array.isArray(segment.words) ? segment.words : []);
}

function getStartSeconds(value: { start?: number; startTime?: number }) {
  const start = Number(value.start ?? value.startTime);
  return Number.isFinite(start) ? start : null;
}

function getEndSeconds(value: { end?: number; endTime?: number }) {
  const end = Number(value.end ?? value.endTime);
  return Number.isFinite(end) ? end : null;
}

function getKineticCaptionEvents(duration: number, options: ProcessShortsVideoOptions) {
  if (options.autoCaptionEffects === false) return [];

  const explicitEvents = normalizeCaptionEvents(options.captionEvents || [], duration);
  if (explicitEvents.length) return explicitEvents;

  const transcript = readTranscript(options.transcriptPath);
  if (!transcript) return [];

  const segments = getTranscriptSegments(transcript);
  const words = getTranscriptWords(transcript, segments);
  const events = words.length
    ? words.map((word) => {
      const text = String(word.word || word.text || '').trim();
      const start = getStartSeconds(word);
      const end = getEndSeconds(word);
      return {
        text,
        start: start ?? 0,
        end: end ?? ((start ?? 0) + Math.min(0.72, Math.max(0.32, text.length * 0.055))),
        color: getCaptionColor(text),
        reason: isHighEnergyWord(normalizeWord(text)) ? 'keyword' : 'word',
      };
    })
    : buildSegmentCaptionEvents(segments);

  return normalizeCaptionEvents(events, duration);
}

function buildSegmentCaptionEvents(segments: TranscriptSegment[]) {
  const events: KineticCaptionEvent[] = [];

  segments.forEach((segment) => {
    const text = String(segment.text || '').trim();
    const start = getStartSeconds(segment);
    const end = getEndSeconds(segment);
    if (!text || start === null || end === null || end <= start) return;

    const words = text.split(/\s+/).filter(Boolean).slice(0, 12);
    const step = Math.max(0.32, (end - start) / Math.max(words.length, 1));
    words.forEach((word, index) => {
      const wordStart = start + index * step;
      events.push({
        text: word,
        start: wordStart,
        end: Math.min(end, wordStart + Math.min(0.8, step * 1.15)),
        color: getCaptionColor(word),
        reason: 'segment_word',
      });
    });
  });

  return events;
}

function normalizeCaptionEvents(events: KineticCaptionEvent[], duration: number) {
  return events
    .map((event) => ({
      ...event,
      text: String(event.text || '').trim().split(/\s+/).slice(0, 3).join(' '),
      start: roundSeconds(Number(event.start)),
      end: roundSeconds(Number(event.end)),
      fontSize: event.fontSize,
      color: normalizeColor(event.color) || getCaptionColor(event.text),
    }))
    .filter((event) => event.text && Number.isFinite(event.start) && Number.isFinite(event.end) && event.end > event.start && event.start < duration)
    .map((event) => ({
      ...event,
      end: roundSeconds(Math.min(duration, Math.max(event.start + 0.25, event.end))),
    }))
    .slice(0, Number(process.env.FACE_VIDEO_MAX_CAPTION_EVENTS || 80));
}

function getIconOverlayEvents(duration: number, options: ProcessShortsVideoOptions) {
  if (options.autoCaptionEffects === false) return [];

  const explicitEvents = normalizeIconEvents(options.iconEvents || [], duration);
  if (explicitEvents.length) return explicitEvents;

  const transcript = readTranscript(options.transcriptPath);
  if (!transcript) return [];

  const segments = getTranscriptSegments(transcript);
  const words = getTranscriptWords(transcript, segments);
  const keywordEvents = words.map((word) => {
    const text = normalizeWord(word.word || word.text || '');
    const start = getStartSeconds(word);
    const end = getEndSeconds(word);
    const iconPath = getKeywordIconPath(text);
    if (!text || start === null || !iconPath) return null;
    return {
      keyword: text,
      iconPath,
      start,
      end: end ?? start + 0.8,
      position: 'above' as const,
    };
  }).filter(Boolean) as IconOverlayEvent[];

  return normalizeIconEvents(keywordEvents, duration);
}

function normalizeIconEvents(events: IconOverlayEvent[], duration: number) {
  const minSpacing = Number(process.env.FACE_VIDEO_ICON_MIN_SPACING_SECONDS || 2.4);
  const output: IconOverlayEvent[] = [];
  let lastStart = -Infinity;

  events
    .map((event) => ({
      ...event,
      keyword: normalizeWord(event.keyword),
      iconPath: event.iconPath || getKeywordIconPath(event.keyword),
      start: roundSeconds(Number(event.start)),
      end: roundSeconds(Number(event.end || Number(event.start) + 0.9)),
      position: event.position || 'above',
    }))
    .filter((event) => event.keyword && event.iconPath && fs.existsSync(event.iconPath) && event.end > event.start && event.start < duration)
    .sort((a, b) => a.start - b.start)
    .forEach((event) => {
      if (event.start - lastStart < minSpacing) return;
      output.push({
        ...event,
        end: roundSeconds(Math.min(duration, Math.max(event.start + 0.55, event.end))),
      });
      lastStart = event.start;
    });

  return output.slice(0, Number(process.env.FACE_VIDEO_MAX_ICON_EVENTS || 12));
}

function readTranscript(transcriptPath?: string) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
  } catch (error) {
    console.warn(`Could not read transcript ${transcriptPath}:`, error);
    return null;
  }
}

function buildFallbackZoomEvents(duration: number) {
  const interval = Number(process.env.FACE_VIDEO_ZOOM_INTERVAL_SECONDS || 4);
  const eventDuration = Number(process.env.FACE_VIDEO_ZOOM_EVENT_DURATION_SECONDS || 0.55);
  const scale = Number(process.env.FACE_VIDEO_ZOOM_SCALE || 1.12);
  const events: ZoomEvent[] = [];

  for (let start = 0.6; start < duration - 0.4; start += interval) {
    events.push({
      start: roundSeconds(start),
      duration: eventDuration,
      scale: events.length % 2 === 0 ? scale : Math.max(1.08, scale - 0.03),
      direction: events.length % 2 === 0 ? 'in' : 'out',
      reason: 'fallback_interval',
    });
  }

  return normalizeZoomEvents(events, duration);
}

function buildSwooshMixFilter(swooshInputIndex: number, zoomEvents: ZoomEvent[]) {
  if (swooshInputIndex < 0 || !zoomEvents.length) return '';

  const maxSfx = Number(process.env.FACE_VIDEO_MAX_SWOOSH_EVENTS || 16);
  const duration = Number(process.env.FACE_VIDEO_SWOOSH_DURATION_SECONDS || 0.45);
  const volume = Number(process.env.FACE_VIDEO_SWOOSH_VOLUME || 0.22);
  const sfxFilters = zoomEvents.slice(0, maxSfx).map((event, index) => {
    const delayMs = Math.max(0, Math.round(event.start * 1000));
    return `[${swooshInputIndex}:a]atrim=0:${duration},asetpts=PTS-STARTPTS,volume=${volume},adelay=${delayMs}|${delayMs}[sfx${index}]`;
  });
  const labels = zoomEvents.slice(0, maxSfx).map((_, index) => `[sfx${index}]`).join('');

  return [
    ...sfxFilters,
    `[aout]${labels}amix=inputs=${Math.min(maxSfx, zoomEvents.length) + 1}:duration=first:dropout_transition=0[aout_mix]`,
  ].join(';');
}

function getSwooshSoundPath(explicitPath?: string) {
  if (explicitPath && fs.existsSync(explicitPath)) return explicitPath;
  if (process.env.FACE_VIDEO_SWOOSH_PATH && fs.existsSync(process.env.FACE_VIDEO_SWOOSH_PATH)) {
    return process.env.FACE_VIDEO_SWOOSH_PATH;
  }

  const soundEffectsDir = path.join(process.cwd(), 'assets_library', 'sound_effects');
  if (!fs.existsSync(soundEffectsDir)) return null;

  const match = fs.readdirSync(soundEffectsDir)
    .filter((fileName) => /\.(mp3|wav|m4a|aac|ogg)$/i.test(fileName))
    .find((fileName) => /(swoosh|whoosh|swish|transition|pop)/i.test(fileName));

  return match ? path.join(soundEffectsDir, match) : null;
}

function isHighEnergyWord(word: string) {
  return new Set([
    'stop',
    'important',
    'lekin',
    'but',
    'wait',
    'listen',
    'secret',
    'mistake',
    'warning',
    'problem',
    'solution',
    'now',
    'watch',
    'dhyan',
    'zaroori',
    'galti',
    'ruk',
    'dekho',
  ]).has(word);
}

function getHighEnergyScale(word: string) {
  return ['stop', 'important', 'warning', 'secret', 'zaroori'].includes(word) ? 1.15 : 1.12;
}

function getCaptionColor(text: string) {
  const word = normalizeWord(text);
  if (['money', 'cash', 'dollar', 'profit', 'sale', 'price', 'paisa'].includes(word)) return '0xFFFF00';
  if (['stop', 'warning', 'mistake', 'problem', 'galti', 'danger'].includes(word)) return '0xFF3B30';
  if (['secret', 'important', 'zaroori', 'solution', 'win', 'growth'].includes(word)) return '0x00FFFF';
  return ['0xFFFF00', '0x00FFFF', '0xFFFFFF'][Math.abs(hashText(word)) % 3];
}

function normalizeColor(color?: string) {
  const value = String(color || '').trim();
  if (!value) return '';
  if (/^#[0-9a-f]{6}$/i.test(value)) return `0x${value.slice(1)}`;
  if (/^0x[0-9a-f]{6}$/i.test(value)) return value;
  if (/^[a-z]+$/i.test(value)) return value;
  return '';
}

function getKeywordIconPath(keyword: string) {
  const normalized = normalizeWord(keyword);
  if (!normalized) return null;

  const iconDir = path.join(process.cwd(), 'assets_library', 'icons');
  if (!fs.existsSync(iconDir)) return null;

  const aliases: Record<string, string[]> = {
    money: ['money', 'dollar', 'cash', 'coin', 'rupee'],
    cash: ['money', 'dollar', 'cash', 'coin', 'rupee'],
    dollar: ['money', 'dollar', 'cash', 'coin'],
    paisa: ['money', 'rupee', 'cash', 'coin'],
    profit: ['profit', 'growth', 'chart', 'money'],
    growth: ['growth', 'chart', 'up', 'rocket'],
    stop: ['stop', 'warning', 'alert'],
    warning: ['warning', 'alert', 'stop'],
    mistake: ['mistake', 'warning', 'cross'],
    galti: ['mistake', 'warning', 'cross'],
    important: ['important', 'star', 'alert'],
    zaroori: ['important', 'star', 'alert'],
    secret: ['secret', 'lock', 'key'],
    idea: ['idea', 'bulb', 'light'],
    solution: ['solution', 'check', 'tick', 'idea'],
    problem: ['problem', 'warning', 'question'],
    time: ['time', 'clock', 'timer'],
  };
  const searchTerms = [normalized, ...(aliases[normalized] || [])];
  const iconFiles = fs.readdirSync(iconDir)
    .filter((fileName) => /\.(png|webp|jpg|jpeg)$/i.test(fileName));

  const match = iconFiles.find((fileName) => {
    const lower = fileName.toLowerCase();
    return searchTerms.some((term) => lower.includes(term));
  });

  return match ? path.join(iconDir, match) : null;
}

function normalizeWord(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '').trim();
}

function roundSeconds(value: number) {
  return Math.round(value * 100) / 100;
}

function hashText(value: string) {
  return Array.from(value || 'caption').reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0);
}

function escapeDrawtext(value: string) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/%/g, '\\%')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]');
}

function runFfmpegWithProgress(
  args: string[],
  options: {
    duration: number;
    timeoutMs: number;
    onProgress?: ProcessShortsVideoOptions['onProgress'];
  },
) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(getFfmpegPath(), args, { windowsHide: true });
    let stderr = '';
    let timedOut = false;
    let lastPercent = -1;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, options.timeoutMs);

    child.stderr.on('data', (chunk) => {
      const raw = chunk.toString();
      stderr += raw;

      const seconds = parseFfmpegTime(raw);
      if (seconds === null) return;

      const percent = Math.max(0, Math.min(99, Math.floor((seconds / options.duration) * 100)));
      if (percent <= lastPercent) return;

      lastPercent = percent;
      console.log(`FFmpeg progress: ${percent}%`);
      options.onProgress?.({ percent, seconds, raw });
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);

      if (timedOut) {
        reject(new Error(`FFmpeg timed out after ${Math.round(options.timeoutMs / 1000)} seconds.`));
        return;
      }

      if (code === 0) {
        options.onProgress?.({ percent: 100, seconds: options.duration, raw: 'complete' });
        resolve();
        return;
      }

      reject(new Error(`FFmpeg exited with code ${code}: ${stderr.slice(-4000)}`));
    });
  });
}

function parseFfmpegTime(value: string) {
  const match = value.match(/time=(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  return hours * 3600 + minutes * 60 + seconds;
}

function buildSubtitleFilter(subtitlesPath: string) {
  const escapedSubtitlePath = escapeFilterPath(subtitlesPath);
  return `subtitles=filename='${escapedSubtitlePath}'`;
}

function runProcess(command: string, args: string[], timeoutMs = 60_000) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);

      if (timedOut) {
        reject(new Error(`${path.basename(command)} timed out after ${Math.round(timeoutMs / 1000)} seconds.`));
        return;
      }

      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(command)} exited with code ${code}: ${stderr.slice(-4000)}`));
    });
  });
}

async function createJumpCutInput(inputPath: string, outputPath: string, options: ProcessShortsVideoOptions): Promise<JumpCutResult> {
  const requestPath = `${outputPath}.jumpcut.request.json`;
  const responsePath = `${outputPath}.jumpcut.response.json`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(requestPath, JSON.stringify({
    inputPath,
    outputPath,
    ffmpegPath: getFfmpegPath(),
    ffprobePath: getFfprobePath(),
    transcriptPath: options.transcriptPath,
    minSilenceDuration: Number(process.env.FACE_VIDEO_MIN_SILENCE_SECONDS || 0.5),
    silenceThresholdDb: process.env.FACE_VIDEO_SILENCE_THRESHOLD_DB || '-38dB',
    silencePadding: Number(process.env.FACE_VIDEO_SILENCE_PADDING_SECONDS || 0.08),
    maxSilenceCutDuration: Number(process.env.FACE_VIDEO_MAX_SILENCE_CUT_SECONDS || 4),
    preset: process.env.FFMPEG_PRESET || SHORTS_CONFIG.preset,
    crf: SHORTS_CONFIG.crf,
  }), 'utf8');

  try {
    await runProcess(getPythonPath(), [getJumpCutScriptPath(), requestPath, responsePath], Number(process.env.FACE_VIDEO_JUMP_CUT_TIMEOUT_MS || options.timeoutMs || 15 * 60 * 1000));
    const result = JSON.parse(fs.readFileSync(responsePath, 'utf8')) as JumpCutResult;
    if (!result.success) throw new Error(result.error || 'Python jump cut failed.');
    return result;
  } finally {
    cleanupFile(requestPath);
    cleanupFile(responsePath);
  }
}

function getJumpCutOutputPath(options: ProcessShortsVideoOptions) {
  const workspaceRoot = options.jumpCutWorkspaceDir || process.env.RENDER_WORKSPACE_DIR || path.join(os.tmpdir(), 'itnavideo-render-workspace');
  const outputDir = path.join(workspaceRoot, 'processed_assets', 'audio_cuts');
  const baseName = String(options.jobId || `jump_${Date.now()}`).replace(/[^a-z0-9_-]/gi, '_').slice(0, 120);
  return path.join(outputDir, `${baseName}_jumpcut.mp4`);
}

function getJumpCutScriptPath() {
  return path.join(process.cwd(), 'render-worker', 'python_jump_cutter.py');
}

function getPythonPath() {
  const configuredPythonPath = process.env.PYTHON_PATH?.trim();
  if (configuredPythonPath && commandExists(configuredPythonPath)) return configuredPythonPath;

  const localAppData = process.env.LOCALAPPDATA;
  const candidates = [
    localAppData ? path.join(localAppData, 'Programs', 'Python', 'Python312', 'python.exe') : '',
    localAppData ? path.join(localAppData, 'Programs', 'Python', 'Python313', 'python.exe') : '',
    process.platform === 'win32' ? 'python.exe' : 'python3',
    'python',
  ].filter(Boolean);

  return candidates.find(commandExists) || 'python';
}

function commandExists(command: string) {
  if (!command) return false;
  if (path.isAbsolute(command) || command.includes(path.sep) || command.includes('/')) {
    return fs.existsSync(command);
  }

  const result = spawnSync(command, ['--version'], { stdio: 'ignore', windowsHide: true });
  return !result.error && result.status === 0;
}

function getFfmpegPath() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  if (ffmpegStaticPath && fs.existsSync(ffmpegStaticPath)) return ffmpegStaticPath;
  return 'ffmpeg';
}

function getFfprobePath() {
  if (process.env.FFPROBE_PATH && fs.existsSync(process.env.FFPROBE_PATH)) return process.env.FFPROBE_PATH;
  if (ffprobeStatic.path && fs.existsSync(ffprobeStatic.path)) return ffprobeStatic.path;
  return 'ffprobe';
}

function escapeFilterPath(filePath: string) {
  return filePath.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'");
}

function cleanupFile(filePath: string) {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.warn(`Cleanup failed for ${filePath}:`, error);
  }
}
