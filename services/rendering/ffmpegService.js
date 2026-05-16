import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import os from 'os';
import ffmpegStaticPath from 'ffmpeg-static';
import { enrichTimelineWithProfessionalTemplate } from './proVideoTemplates.js';
import { ensureDriveFontsForTimeline, getCachedDriveFontPath } from './googleDriveFonts.js';

const QUALITY_PRESET = process.env.VIDEO_QUALITY_PRESET || process.env.NEXT_PUBLIC_VIDEO_QUALITY_PRESET || '720p';
const TARGET_WIDTH = Number(process.env.TARGET_WIDTH || process.env.RENDER_WIDTH || 720);
const TARGET_HEIGHT = Number(process.env.TARGET_HEIGHT || process.env.RENDER_HEIGHT || 1280);
const RENDER_TIMEOUT_MS = Number(process.env.RENDER_PRIMARY_TIMEOUT_SEC || 0) > 0
  ? Number(process.env.RENDER_PRIMARY_TIMEOUT_SEC) * 1000
  : Number(process.env.RENDER_PRIMARY_TIMEOUT_MS || process.env.RENDER_TIMEOUT_SEC || 120000);

// Config & Paths
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CACHE_DIR = path.join(os.tmpdir(), 'itnavideo-cache'); // Vercel support ke liye /tmp use karein
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const QUALITY_PROFILES = {
  [QUALITY_PRESET]: { 
    width: TARGET_WIDTH, height: TARGET_HEIGHT, fps: 30, 
    videoBitrate: '2200k', maxrate: '2800k', bufsize: '4200k', 
    audioBitrate: '128k', crf: 26, preset: 'ultrafast'
  },
};

/**
 * 1. Optimized Asset Caching
 * Isme fetch timeout aur atomic write handling hai taaki assets corrupt na hon.
 */
async function getCachedAsset(url, fallbackExt = '.mp4') {
  if (!url) return null;
  const hash = crypto.createHash('md5').update(url).digest('hex');
  const ext = path.extname(new URL(url, 'https://local.invalid').pathname) || fallbackExt;
  const cachePath = path.join(CACHE_DIR, `${hash}${ext}`);

  if (fs.existsSync(cachePath) && fs.statSync(cachePath).size > 0) return cachePath;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 1 minute timeout

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok || !response.body) throw new Error(`Fetch failed: ${url}`);

    const tempPath = `${cachePath}.${Date.now()}.tmp`;
    const writer = fs.createWriteStream(tempPath);
    // @ts-ignore
    await finished(Readable.fromWeb(response.body).pipe(writer));
    fs.renameSync(tempPath, cachePath);
    return cachePath;
  } catch (err) {
    console.error(`Asset fetch error: ${url}`, err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 2. Main Render Function
 * Sabhi scenes ko process karke ek final MP4 banata hai.
 */
export async function renderVideoWithFFmpeg(data, outputPath, options = {}) {
  const { timeline, voiceoverUrl } = data;
  const profile = QUALITY_PROFILES[QUALITY_PRESET];
  
  if (!timeline || !timeline.scenes || timeline.scenes.length === 0) {
    throw new Error("Cannot render video: Timeline is empty or invalid.");
  }

  const enrichedTimeline = enrichTimelineWithProfessionalTemplate(timeline, options);
  const totalDuration = Math.max(...enrichedTimeline.scenes.map((s) => s.end || 0));

  await ensureDriveFontsForTimeline(enrichedTimeline);

  // Resolve All Assets
  const assets = await resolveTimelineAssets(enrichedTimeline, voiceoverUrl);
  const filterGraph = buildComplexFilters(enrichedTimeline, assets, profile, totalDuration);

  return new Promise((resolve, reject) => {
    const args = buildFfmpegArgs(assets, filterGraph, outputPath, profile);
    const child = spawn(getFfmpegPath(), args, { windowsHide: true });

    let stderr = '';
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('FFmpeg Render Timed Out (Max 120 seconds)'));
    }, RENDER_TIMEOUT_MS);

    child.stderr.on('data', (chunk) => {
      const line = chunk.toString();
      stderr += line;
      // Progress calculation
      const match = line.match(/time=(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)/);
      if (match && options.onProgress) {
        const time = parseFloat(match[1]) * 3600 + parseFloat(match[2]) * 60 + parseFloat(match[3]);
        const percent = Math.min(99, Math.round((time / totalDuration) * 100));
        options.onProgress({ percent });
      }
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) resolve(outputPath);
      else reject(new Error(`FFmpeg failed (code ${code}): ${stderr.slice(-500)}`));
    });
  });
}

/**
 * 3. Filter Graph Builder
 * Isme images ko video mein convert karne ka core logic hai.
 */
function buildComplexFilters(timeline, assets, profile, totalDuration) {
  const filters = [];
  const sceneLabels = [];

  // Visual Scenes
  timeline.scenes.forEach((scene, i) => {
    const input = assets.sceneInputs[i];
    if (!input) {
      throw new Error(`Missing FFmpeg input for scene ${i + 1}.`);
    }

    const label = `v${i}`;
    const dur = Math.max(0.5, (scene.end || 0) - (scene.start || 0));
    const template = getSceneTemplate(timeline, scene);
    const background = normalizeFfmpegColor(input.textCard?.backgroundColor || template.backgroundColor || pickTemplateColor(template, i));
    const accentColor = normalizeFfmpegColor(template.accentColor || template.accent_color || input.textCard?.accentColor || '0x38bdf8');
    const overlayOpacity = normalizeOpacity(template.overlayOpacity ?? template.overlay_opacity ?? 0.22);
    const zoom = normalizeZoom(template.slowZoom);
    const textFilter = buildTemplateTextFilters(scene, template, profile, dur, label);

    const baseFilter = input.generatedColor
      ? `[${input.inputIndex}:v]trim=duration=${dur},setpts=PTS-STARTPTS,format=yuv420p[${label}_base]`
      : `[${input.inputIndex}:v]scale=ceil(iw*${zoom}/2)*2:ceil(ih*${zoom}/2)*2,scale=${profile.width}:${profile.height}:force_original_aspect_ratio=increase,crop=${profile.width}:${profile.height},setsar=1,trim=duration=${dur},setpts=PTS-STARTPTS,format=yuv420p[${label}_base]`;

    const readabilityFilter = [
      baseFilter,
      `color=c=black@${overlayOpacity}:s=${profile.width}x${profile.height}:r=${profile.fps}:d=${dur}[${label}_shade]`,
      `[${label}_base][${label}_shade]overlay=0:0:shortest=1[${label}_readable]`,
      ...(template.vignette ? [`[${label}_readable]vignette=angle=PI/5:eval=frame[${label}_vignette]`] : []),
      `[${template.vignette ? `${label}_vignette` : `${label}_readable`}]drawbox=x=72:y=220:w=936:h=8:color=${accentColor}:t=fill${textFilter || ''}[${label}]`,
    ].join(';');

    filters.push(readabilityFilter);
    sceneLabels.push(`[${label}]`);
  });

  if (!sceneLabels.length) {
    throw new Error('Timeline has no scenes to render.');
  }

  // Scene concatenation produces [v_concat].
  filters.push(`${sceneLabels.join('')}concat=n=${sceneLabels.length}:v=1:a=0[v_concat]`);
  
  // Caption/subtitle processing must always produce [v_base] for final mapping.
  const captionData = getTimelineCaptionData(timeline);
  filters.push(buildCaptionFilter(captionData, 'v_concat', 'v_base', getTimelineCaptionStyle(timeline)));

  // Audio mix logic must always produce [a_final] for final mapping.
  const audioInputs = [];
  if (assets.voiceover?.path) {
    filters.push(`[${assets.voiceover.index}:a]volume=1.0[a_voice]`);
    audioInputs.push(`[a_voice]`);
  }
  if (assets.music?.path) {
    filters.push(`[${assets.music.index}:a]volume=0.2,afade=t=out:st=${Math.max(0, totalDuration - 2)}:d=2[a_music]`);
    audioInputs.push(`[a_music]`);
  }

  const audioFilter = audioInputs.length > 0 
    ? `${audioInputs.join('')}amix=inputs=${audioInputs.length}:duration=shortest[a_final]`
    : `anullsrc=r=44100:cl=stereo:d=${totalDuration}[a_final]`;
  
  filters.push(audioFilter);

  return filters.join(';');
}

/**
 * 4. FFmpeg Arguments Construction
 */
function buildFfmpegArgs(assets, filters, outputPath, profile) {
  const args = ['-y', '-hide_banner', '-loglevel', 'warning', '-stats'];

  // Add all inputs
  assets.allInputs.forEach((input) => {
    if (input.generatedColor) {
      args.push('-f', 'lavfi', '-t', String(input.duration), '-i', `color=c=${input.generatedColor}:s=${profile.width}x${profile.height}:r=${profile.fps}`);
      return;
    }
    if (input.isImage) args.push('-loop', '1', '-t', String(input.duration));
    args.push('-i', input.path);
  });

  args.push(
    '-filter_complex', filters,
    '-map', '[v_base]',
    '-map', '[a_final]',
    '-c:v', 'libx264',
    '-preset', profile.preset,
    '-crf', String(profile.crf),
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', profile.audioBitrate,
    '-movflags', '+faststart',
    outputPath
  );

  return args;
}

/**
 * 5. Asset Resolver
 */
async function resolveTimelineAssets(timeline, voiceoverUrl) {
  const allInputs = [];
  const sceneInputs = [];

  for (const [index, scene] of timeline.scenes.entries()) {
    const source = scene.source || {};
    const textCard = scene.textCard || buildFallbackTextCard(scene, index);
    const duration = Math.max(0.5, (scene.end || 0) - (scene.start || 0));
    const assetUrl = source.url;
    const assetPath = assetUrl
      ? await getCachedAsset(assetUrl, String(source.type || '').includes('image') ? '.jpg' : '.mp4')
      : null;
    const input = assetPath
      ? {
          path: assetPath,
          inputIndex: allInputs.length,
          isImage: String(source.type || '').includes('image') || /\.(jpe?g|png|webp|gif)$/i.test(assetPath),
          duration,
          textCard,
          proTemplate: scene.proTemplate,
        }
      : {
          inputIndex: allInputs.length,
          generatedColor: normalizeFfmpegColor(textCard.backgroundColor || scene.proTemplate?.backgroundColor || pickFallbackColor(index)),
          isImage: false,
          duration,
          textCard,
          proTemplate: scene.proTemplate,
        };

    sceneInputs.push(input);
    allInputs.push(input);
  }

  let voiceover = null;
  if (voiceoverUrl) {
    const path = await getCachedAsset(voiceoverUrl, '.mp3');
    if (path) {
      voiceover = { path, index: allInputs.length };
      allInputs.push(voiceover);
    } else {
      console.warn('Voiceover asset could not be fetched. Rendering with silent audio fallback.');
    }
  }

  // Resolve music if present in timeline metadata
  let music = null;
  if (timeline.metadata?.musicUrl) {
    const path = await getCachedAsset(timeline.metadata.musicUrl, '.mp3');
    if (path) {
      music = { path, index: allInputs.length };
      allInputs.push(music);
    } else {
      console.warn('Music asset could not be fetched. Continuing without music.');
    }
  }

  return { allInputs, sceneInputs, voiceover, music };
}

function getFfmpegPath() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  if (ffmpegStaticPath && fs.existsSync(ffmpegStaticPath)) return ffmpegStaticPath;
  return process.env.FFMPEG_PATH || 'ffmpeg';
}

function getSceneTemplate(timeline, scene) {
  return {
    ...(timeline?.metadata?.template || {}),
    ...(scene?.proTemplate || {}),
  };
}

function buildTemplateTextFilters(scene, template, profile, duration, label) {
  const textCard = scene.textCard || {};
  const headline = splitText(textCard.headline || template.text_content || scene.shortHeadline || scene.role || 'Your idea becomes a video', 24).slice(0, 3);
  const body = splitText(textCard.body || scene.summary || scene.source?.query || '', 34).slice(0, 2);
  const eyebrow = textCard.eyebrow ? splitText(textCard.eyebrow, 28).slice(0, 1) : [];
  const fontPath = getCachedDriveFontPath(template);
  const fontOption = fontPath ? `:fontfile='${escapeFontFilePath(fontPath)}'` : '';
  const align = template.textAlign || template.text_align || 'center';
  const box = getTextBox(profile, template, align, headline, body, eyebrow);
  const headlineSize = getDynamicFontSize(headline.join(' '), 86, 58);
  const bodySize = getDynamicFontSize(body.join(' '), 46, 36);
  const headlineColor = normalizeFfmpegColor(textCard.headlineColor || template.headlineColor || '0xf8fafc');
  const bodyColor = normalizeFfmpegColor(textCard.bodyColor || '0xe5e7eb');
  const accentColor = normalizeFfmpegColor(textCard.accentColor || template.accentColor || template.accent_color || '0x38bdf8');
  const shadowColor = normalizePanelColor(template.shadowColor || 'black@0.65');
  const animation = template.animationStyle || template.animation_style || 'fade_slide';
  const filters = [];
  let y = box.y;

  for (const line of eyebrow) {
    filters.push(...buildAnimatedDrawtextPasses({
      text: line.toUpperCase(),
      x: box.xExpression,
      y,
      fontSize: 32,
      color: accentColor,
      shadowColor,
      fontOption,
      duration,
      animation,
      lineLabel: label,
    }));
    y += 54;
  }

  headline.forEach((line, index) => {
    filters.push(...buildAnimatedDrawtextPasses({
      text: line,
      x: box.xExpression,
      y: y + index * Math.round(headlineSize * 1.12),
      fontSize: headlineSize,
      color: headlineColor,
      shadowColor,
      fontOption,
      duration,
      animation,
      lineLabel: label,
    }));
  });

  y += headline.length * Math.round(headlineSize * 1.12) + 42;

  body.forEach((line, index) => {
    filters.push(...buildAnimatedDrawtextPasses({
      text: line,
      x: box.xExpression,
      y: y + index * Math.round(bodySize * 1.35),
      fontSize: bodySize,
      color: bodyColor,
      shadowColor,
      fontOption,
      duration,
      animation: 'fade_slide',
      lineLabel: label,
    }));
  });

  return filters.length ? `,${filters.join(',')}` : '';
}

function buildAnimatedDrawtextPasses({ text, x, y, fontSize, color, shadowColor, fontOption, duration, animation }) {
  const escapedText = escapeDrawtext(text);
  const alpha = escapeFilterExpression(getAlphaExpression(animation, duration));
  const animatedY = escapeFilterExpression(getAnimatedYExpression(y, animation));
  
  // Separate common options from positional/animated ones to avoid redundancy or parser errors
  const common = `text='${escapedText}'${fontOption}:fontsize=${fontSize}`;

  return [
    `drawtext=${common}:fontcolor=${shadowColor}:borderw=0:x=${x}+5:y=${animatedY}+5:alpha='${alpha}'`,
    `drawtext=${common}:fontcolor=${color}:borderw=1:bordercolor=${shadowColor}:x=${x}:y=${animatedY}:alpha='${alpha}'`,
  ];
}

function buildCaptionFilter(captions, inputLabel, outputLabel, style = {}) {
  const cues = normalizeCaptions(captions);
  if (!cues.length) return `[${inputLabel}]null[${outputLabel}]`;

  const fontColor = normalizeDrawtextColor(style.fontColor || style.captionColor || style.color || 'white');
  const boxColor = normalizePanelColor(style.boxColor || style.captionBoxColor || 'black@0.58');
  const fontSize = normalizeCaptionFontSize(style.fontSize || style.captionFontSize, 58);
  const boxBorderWidth = normalizeInteger(style.boxBorderWidth || style.captionBoxBorderWidth, 22, 8, 42);

  const drawFilters = cues.flatMap((cue) => {
    const lines = splitText(cue.text, 30).slice(0, 2);
    const baseY = lines.length > 1 ? 1410 : 1468;

    return lines.map((line, index) => (
      `drawtext=text='${escapeDrawtext(line)}':fontcolor=${fontColor}:fontsize=${fontSize}:x=(w-text_w)/2:y=${baseY + index * 70}:box=1:boxcolor=${boxColor}:boxborderw=${boxBorderWidth}:enable='between(t,${cue.start},${cue.end})'`
    ));
  });

  return `[${inputLabel}]${drawFilters.join(',')}[${outputLabel}]`;
}

function getTimelineCaptionStyle(timeline) {
  const template = timeline?.metadata?.template || {};
  const subtitleStyle = timeline?.subtitlePlan?.style || {};
  const captionStyle = timeline?.captionStyle || timeline?.metadata?.captionStyle || {};

  return {
    ...template,
    ...(typeof captionStyle === 'object' ? captionStyle : {}),
    ...(typeof subtitleStyle === 'object' ? subtitleStyle : {}),
  };
}

function getTimelineCaptionData(timeline) {
  if (Array.isArray(timeline?.captions)) return timeline.captions;
  if (Array.isArray(timeline?.subtitlePlan)) return timeline.subtitlePlan;
  if (Array.isArray(timeline?.subtitlePlan?.cues)) return timeline.subtitlePlan.cues;
  if (Array.isArray(timeline?.subtitles)) return timeline.subtitles;
  return [];
}

function normalizeCaptions(captions) {
  const items = Array.isArray(captions) ? captions : Array.isArray(captions?.cues) ? captions.cues : [];
  if (!items.length) return [];

  return items
    .map((caption) => ({
      text: String(caption?.text || '').trim(),
      start: roundTime(Number(caption?.start)),
      end: roundTime(Number(caption?.end)),
    }))
    .filter((caption) => caption.text && Number.isFinite(caption.start) && Number.isFinite(caption.end) && caption.end > caption.start)
    .slice(0, 140);
}

function getTextBox(profile, template, align, headline, body, eyebrow) {
  const safeZone = template.safeZone || template.safe_zone || {};
  const marginX = Math.round(profile.width * Number(safeZone.x || 0.1));
  const top = Math.round(profile.height * Number(safeZone.top || 0.16));
  const bottom = Math.round(profile.height * Number(safeZone.bottom || 0.24));
  const lineCount = headline.length + body.length + eyebrow.length;
  const estimatedHeight = 74 * Math.max(1, headline.length) + 58 * body.length + 54 * eyebrow.length + 42;

  if (align === 'top_left') {
    return { xExpression: marginX, y: top };
  }

  if (align === 'bottom_center') {
    return { xExpression: '(w-text_w)/2', y: Math.max(top, profile.height - bottom - estimatedHeight) };
  }

  return {
    xExpression: '(w-text_w)/2',
    y: Math.max(top, Math.round((profile.height - estimatedHeight) / 2) - Math.max(0, lineCount - 3) * 12),
  };
}

function getDynamicFontSize(text, maxSize, minSize) {
  const length = String(text || '').length;
  if (length > 96) return minSize;
  if (length > 72) return Math.max(minSize, maxSize - 20);
  if (length > 48) return Math.max(minSize, maxSize - 12);
  return maxSize;
}

function getAlphaExpression(animation, duration) {
  if (animation === 'typewriter') return `if(lt(t,0.18),0,if(lt(t,${Math.min(0.65, duration / 3)}),0.88,1))`;
  return `min(1,max(0,t/0.35))*if(gt(t,${Math.max(0.4, duration - 0.28)}),max(0,(${duration}-t)/0.28),1)`;
}

function getAnimatedYExpression(y, animation) {
  if (animation === 'fade_slide') return `${y}+(1-min(1,max(0,t/0.45)))*44`;
  return String(y);
}

function buildFallbackTextCard(scene, index) {
  return {
    eyebrow: index === 0 ? 'Itnavideo' : `Scene ${index + 1}`,
    headline: scene?.role || scene?.source?.query || 'Your idea becomes a video',
    body: 'Clean professional fallback scene.',
    backgroundColor: pickFallbackColor(index),
    accentColor: index % 2 === 0 ? '0x38bdf8' : '0xfbbf24',
  };
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

function pickTemplateColor(template, index) {
  return template.backgroundColor || template.background_color || template.backgroundPalette?.[index % template.backgroundPalette.length] || pickFallbackColor(index);
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

function normalizePanelColor(value) {
  const raw = String(value || '').trim();
  if (/^(black|white|0x[0-9a-f]{6}|#[0-9a-f]{6})(@\d?(?:\.\d+)?)?$/i.test(raw)) {
    return raw.startsWith('#') ? normalizeFfmpegColor(raw) : raw;
  }

  return 'black@0.65';
}

function normalizeDrawtextColor(value) {
  const raw = String(value || '').trim();
  if (/^(black|white|yellow|cyan|red|green|blue|orange|gold|0x[0-9a-f]{6}|#[0-9a-f]{6})$/i.test(raw)) {
    return raw.startsWith('#') ? normalizeFfmpegColor(raw) : raw;
  }

  return 'white';
}

function normalizeCaptionFontSize(value, fallback) {
  return normalizeInteger(value, fallback, 36, 88);
}

function normalizeInteger(value, fallback, min, max) {
  const numeric = Math.round(Number(value));
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, numeric));
}

function normalizeOpacity(value) {
  const opacity = Number(value);
  if (!Number.isFinite(opacity)) return 0.22;
  return Math.max(0.05, Math.min(0.55, opacity));
}

function normalizeZoom(value) {
  const zoom = Number(value);
  if (!Number.isFinite(zoom)) return 1;
  return Math.max(1, Math.min(1.12, zoom));
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

function escapeFontFilePath(value) {
  return String(value).replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'");
}

function escapeFilterExpression(value) {
  return String(value).replace(/,/g, '\\,');
}

function roundTime(value) {
  return Math.round(value * 1000) / 1000;
}
