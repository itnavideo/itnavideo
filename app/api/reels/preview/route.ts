/**
 * /api/reels/preview
 *
 * Generates a preview plan (transcript + captions + scene timeline) for any video type.
 * Does NOT start a Lambda render. Does NOT deduct credits.
 * Returns inputProps JSON that can be passed directly to @remotion/player
 * and later sent to /api/reels/jobs for the final render.
 */
import { NextResponse } from 'next/server';
import { createReadUrl } from '@/lib/aws/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';
import {
  REEL_VIDEO_TYPE_REGISTRY,
  type ReelVideoTypeConfig,
  type ReelVideoTypeName,
  type ReelTranscriptSegment,
  type ReelWord,
} from '@/services/ai/reelPlanner';
import { checkRateLimit, getClientIp } from '@/services/rateLimit/inMemoryRateLimiter';
import { buildEnergyTimeline, findBeatPeaks } from '@/lib/audio/energyTimeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120; // preview can take up to 2 min (transcription)

const MAX_RENDER_WINDOW_SECONDS = 60;
const SPEECH_LEAD_SECONDS = 0.65;
const MIN_SPEECH_TOKEN_LENGTH = 2;

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const userId = readString(body.userId);
  const rateLimit = checkRateLimit({
    key: `reels-preview:${userId || ip}`,
    limit: 30,
    windowMs: 15 * 60_000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json({ ok: false, error: 'Too many preview requests. Please wait a minute.' }, { status: 429 });
  }

  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Please log in to preview.' }, { status: 401 });
  }

  const mediaKey = readString(body.mediaKey);
  const fileName = readString(body.fileName);
  const contentType = readString(body.contentType);
  const comparisonImageKeys = Array.isArray(body.comparisonImageKeys)
    ? body.comparisonImageKeys.map((value) => readString(value)).filter(Boolean).slice(0, 2)
    : [];
  const videoTypeNameValue = readString(body.videoTypeName || body.videoType || body.templateName || body.template || body.mode) as ReelVideoTypeName | '';
  const topicTitle = readString(body.topicTitle);
  const subtitleLang = normalizeSubtitleLanguage(readString(body.subtitleOutputLanguage));

  if (!mediaKey) {
    return NextResponse.json({ ok: false, error: 'mediaKey is required.' }, { status: 400 });
  }

  const videoTypeConfig = videoTypeNameValue ? REEL_VIDEO_TYPE_REGISTRY[videoTypeNameValue] : null;
  if (!videoTypeNameValue || !videoTypeConfig) {
    return NextResponse.json({ ok: false, error: 'Unknown video type. Cannot generate preview.' }, { status: 422 });
  }
  const videoTypeName: ReelVideoTypeName = videoTypeNameValue;

  try {
    // 1. Get signed S3 URL (same URL will be used in final render)
    const mediaUrl = await createReadUrl(mediaKey);
    const comparisonImageUrls = videoTypeName === 'comparisonImages'
      ? (await Promise.all(comparisonImageKeys.map((key) => createReadUrl(key)))).map(readString).filter(Boolean).slice(0, 2)
      : [];

    if (videoTypeName === 'comparisonImages' && comparisonImageUrls.length !== 2) {
      return NextResponse.json({ ok: false, error: 'Compare preview needs both left and right images.' }, { status: 422 });
    }

    // 2. Transcribe directly (Groq handles up to 25MB — no clip needed for preview)
    let transcription: {
      transcript: string;
      durationSeconds?: number;
      words?: ReelWord[];
      segments?: ReelTranscriptSegment[];
      languageHint?: 'english' | 'hinglish';
      warning?: string;
      source?: string;
    };

    try {
      transcription = await transcribeMediaUrlWithGroq({
        mediaUrl,
        fileName,
        contentType,
        language: subtitleLang,
      });
    } catch (err) {
      return NextResponse.json({
        ok: false,
        error: 'Could not transcribe audio. Please ensure your file has clear speech.',
        detail: err instanceof Error ? err.message : String(err),
      }, { status: 422 });
    }

    if (!transcription.transcript) {
      return NextResponse.json({
        ok: false,
        error: 'No speech detected. Upload a file with clear audio.',
      }, { status: 422 });
    }

    // 3. Select render window (speech-aware, max 60s)
    const renderWindow = selectRenderWindow(transcription);

    // 4. Build captions from word timestamps
    const captions = buildCompareCaptionsFromGroq(renderWindow);

    // 5. Build video-type-specific preview props
    const inputProps = buildPreviewProps({
      videoTypeName: videoTypeName as ReelVideoTypeName,
      videoTypeConfig,
      body,
      mediaUrl,
      comparisonImageUrls,
      renderWindow,
      captions,
      transcription,
      topicTitle,
    });

    // 6. Build the unified preview timeline JSON
    const previewPlan: PreviewPlan = {
      videoTypeId: videoTypeName as string,
      compositionId: videoTypeConfig.compositionId,
      durationSeconds: renderWindow.durationSeconds,
      mediaSrc: mediaUrl,
      mediaTrimStartSeconds: renderWindow.trimStartSeconds,
      captions,
      scenes: (inputProps.scenes as PreviewPlan['scenes'] | undefined) || [],
      stickers: (inputProps.stickers as PreviewPlan['stickers'] | undefined) || [],
      layout: {
        videoLayout: 'fullscreen',
        captionPosition: readString(body.captionPosition) || 'bottom',
        progressStyle: 'none',
      },
      assets: (inputProps.assets as PreviewPlan['assets'] | undefined) || [],
      userEdits: {},
      inputProps,
      transcript: renderWindow.transcript,
      transcriptWords: renderWindow.words || [],
    };

    return NextResponse.json({ ok: true, preview: previewPlan });
  } catch (err) {
    console.error('[PREVIEW] Error:', err);
    return NextResponse.json({
      ok: false,
      error: 'Preview generation failed. Please try again.',
      detail: process.env.NODE_ENV !== 'production' ? String(err) : undefined,
    }, { status: 500 });
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type PreviewCaption = {
  start: number;
  end: number;
  text: string;
  words?: Array<{ word: string; start: number; end: number }>;
};

export type PreviewPlan = {
  videoTypeId: string;
  compositionId: string;
  durationSeconds: number;
  mediaSrc: string;
  mediaTrimStartSeconds: number;
  captions: PreviewCaption[];
  scenes: unknown[];
  stickers: unknown[];
  layout: {
    videoLayout: string;
    captionPosition: string;
    progressStyle: string;
  };
  assets: unknown[];
  userEdits: Record<string, unknown>;
  inputProps: Record<string, unknown>;
  transcript: string;
  transcriptWords: ReelWord[];
};

// ─── Build preview inputProps per video type ──────────────────────────────────

function buildPreviewProps({
  videoTypeName,
  videoTypeConfig,
  body,
  mediaUrl,
  comparisonImageUrls,
  renderWindow,
  captions,
  transcription,
  topicTitle,
}: {
  videoTypeName: ReelVideoTypeName;
  videoTypeConfig: ReelVideoTypeConfig;
  body: Record<string, unknown>;
  mediaUrl: string;
  comparisonImageUrls: string[];
  renderWindow: ReturnType<typeof selectRenderWindow>;
  captions: PreviewCaption[];
  transcription: { transcript: string; durationSeconds?: number; languageHint?: string };
  topicTitle: string;
}): Record<string, unknown> {
  const base: Record<string, unknown> = {
    mediaSrc: mediaUrl,
    mediaType: 'video',
    mediaTrimStartSeconds: renderWindow.trimStartSeconds,
    sourceAudioVolume: 1,
    durationSeconds: renderWindow.durationSeconds,
    sourceDurationSeconds: transcription.durationSeconds || renderWindow.durationSeconds,
    captions,
    subtitleChunks: captions,
    transcript: renderWindow.transcript,
    topicTitle: topicTitle || '',
    captionStyle: readString(body.captionStyle) || 'Studio Clean',
    captionPosition: readString(body.captionPosition) || 'bottom',
    fontFamily: readString(body.captionFontFamily || body.fontFamily) || undefined,
    fontSize: readString(body.captionFontSize || body.fontSize) || 'large',
    subtitleOutputLanguage: normalizeSubtitleLanguage(readString(body.subtitleOutputLanguage)) || transcription.languageHint || '',
    textColor: readString(body.captionTextColor) || '#ffffff',
    highlightColor: readString(body.captionHighlightColor) || '#facc15',
    backgroundColor: readString(body.captionBackgroundColor) || '#18181B',
    showBackground: body.captionShowBackground !== false,
    videoLayout: 'fullscreen',
    progressStyle: 'none',
    wordClickSound: false,
    videoTypeName,
    templateName: videoTypeName,
    compositionId: videoTypeConfig.compositionId,
  };

  // Video-type-specific additions
  if (videoTypeName === 'DYNAMIC_CREATOR_REEL') {
    const scenes = buildDynamicCreatorScenes(captions, renderWindow.durationSeconds);
    return {
      ...base,
      scenes,
      accentColor: readString(body.accentColor) || '#2563EB',
      backgroundMusic: false,
    };
  }

  if (videoTypeName === 'AUTO_CAPTION_REEL') {
    const energyWords = (renderWindow.words || [])
      .filter(w => w.word && Number.isFinite(w.start) && Number.isFinite(w.end))
      .map(w => ({ word: String(w.word), start: Number(w.start), end: Number(w.end) }));
    const energyTimeline = buildEnergyTimeline(energyWords, renderWindow.durationSeconds, 30);
    const beatPeakFrames = findBeatPeaks(energyTimeline, 0.65, 8);
    return {
      ...base,
      energyTimeline,
      beatPeakFrames,
      backgroundMusic: false,
    };
  }

  if (videoTypeName === 'comparisonImages') {
    const leftTitle = readString(body.compareLeftTitle || body.leftTitle || body.leftLabel) || 'Left';
    const rightTitle = readString(body.compareRightTitle || body.rightTitle || body.rightLabel) || 'Right';
    const overlays = buildCompareOverlayTimeline(captions, renderWindow.durationSeconds, leftTitle, rightTitle);
    return {
      ...base,
      audioUrl: mediaUrl,
      mediaUrl,
      sourceAudioUrl: mediaUrl,
      comparisonImageUrls,
      comparisonImages: comparisonImageUrls,
      imageSources: comparisonImageUrls,
      compareLeftTitle: leftTitle,
      compareRightTitle: rightTitle,
      leftTitle,
      rightTitle,
      creatorHandle: readString(body.creatorHandle || body.handle || body.channelName) || '@itnavideo',
      stickerStyle: readString(body.stickerStyle) || 'explainer',
      stickerScale: Number(body.stickerScale) || 1,
      stickerOffsetX: Number(body.stickerOffsetX) || 0,
      stickerOffsetY: Number(body.stickerOffsetY) || 0,
      captions,
      transcriptSegments: captions,
      overlayTimeline: overlays,
      stickers: overlays.map((overlay) => ({
        id: overlay.id,
        start: overlay.start,
        end: overlay.end,
        pose: overlay.stickerPose,
        character: readString(body.stickerStyle) || 'explainer',
        scale: Number(body.stickerScale) || 1,
        x: Number(body.stickerOffsetX) || 0,
        y: Number(body.stickerOffsetY) || 0,
      })),
      assets: comparisonImageUrls.map((url, index) => ({
        id: index === 0 ? 'left-image' : 'right-image',
        type: 'image',
        role: index === 0 ? 'compare-left' : 'compare-right',
        url,
        label: index === 0 ? leftTitle : rightTitle,
        fit: 'contain',
      })),
      backgroundMusic: false,
    };
  }

  return base;
}

function buildCompareOverlayTimeline(
  captions: PreviewCaption[],
  durationSeconds: number,
  leftTitle: string,
  rightTitle: string,
) {
  const fallback = captions.length > 0 ? captions : [{start: 0, end: Math.max(1, durationSeconds), text: `${leftTitle} vs ${rightTitle}`}];
  const captionBeats = fallback.map((caption, index) => ({
    id: `compare-beat-${index + 1}`,
    start: Number(caption.start ?? 0),
    end: Number(caption.end ?? Math.min(durationSeconds, Number(caption.start ?? 0) + 2.5)),
    text: caption.text,
    body: caption.text,
    title: index === 0 ? `${leftTitle} vs ${rightTitle}` : '',
    stickerPose: pickComparePose(caption.text, index, fallback.length, leftTitle, rightTitle),
  }));
  return stabilizeCompareOverlayTimeline(captionBeats, durationSeconds, leftTitle, rightTitle);
}

function pickComparePose(textValue: string, index: number, total: number, leftTitle: string, rightTitle: string) {
  const text = textValue.toLowerCase();
  if (index === 0) return 'sticker_welcome_intro_explainer';
  if (index >= total - 1) return 'sticker_happy_celebrating_outro';
  if (text.includes('?') || /\b(why|kaise|kya|confus|question)\b/i.test(text)) return 'sticker_questioning_surprised_explainer';
  if (/\b(risk|problem|mistake|warning|issue|loss|avoid|danger)\b/i.test(text)) return 'sticker_warning_issue_explainer';
  if (text.includes(leftTitle.toLowerCase())) return 'sticker_pointing_left_side_explainer';
  if (text.includes(rightTitle.toLowerCase())) return 'sticker_pointing_right_side_explainer';
  if (/\b(vs|compare|difference|better|both|dono|tradeoff)\b/i.test(text)) return 'sticker_comparing_both_sides_explainer';
  return index % 3 === 0
    ? 'sticker_pointing_left_side_explainer'
    : index % 3 === 1
      ? 'sticker_pointing_right_side_explainer'
      : 'sticker_general_explaining_key_point';
}

function stabilizeCompareOverlayTimeline<T extends {id: string; start: number; end: number; text?: string; body?: string; title?: string; stickerPose?: string}>(
  beats: T[],
  durationSeconds: number,
  leftTitle: string,
  rightTitle: string,
) {
  if (!beats.length) return beats;
  const minHoldSeconds = 4;
  const maxHoldSeconds = 6;
  const normalized = beats
    .map((beat, index) => ({
      ...beat,
      start: Math.max(0, Number(beat.start) || 0),
      end: Math.min(durationSeconds, Math.max(Number(beat.end) || 0, Number(beat.start) + 0.6)),
      stickerPose: beat.stickerPose || pickComparePose([beat.text, beat.body, beat.title].filter(Boolean).join(' '), index, beats.length, leftTitle, rightTitle),
    }))
    .filter((beat) => beat.start < durationSeconds && beat.end > beat.start);

  const groups: typeof normalized = [];
  let current: typeof normalized[number] | null = null;
  let texts: string[] = [];

  const flush = () => {
    if (!current) return;
    groups.push({
      ...current,
      text: texts.join(' ').replace(/\s+/g, ' ').trim() || current.text,
      body: texts.join(' ').replace(/\s+/g, ' ').trim() || current.body,
    });
    current = null;
    texts = [];
  };

  normalized.forEach((beat, index) => {
    if (!current) {
      current = {...beat, id: `compare-pose-${groups.length + 1}`};
      texts = [String(beat.text || beat.body || '').trim()].filter(Boolean);
      return;
    }

    const heldFor = current.end - current.start;
    const intentChanged = beat.stickerPose !== current.stickerPose;
    const sentenceEnded = /[.!?]$/.test(texts.join(' ').trim());
    const shouldBreak =
      heldFor >= maxHoldSeconds ||
      (heldFor >= minHoldSeconds && (intentChanged || sentenceEnded)) ||
      index === normalized.length - 1 && heldFor >= minHoldSeconds;

    if (shouldBreak) {
      flush();
      current = {...beat, id: `compare-pose-${groups.length + 1}`};
      texts = [String(beat.text || beat.body || '').trim()].filter(Boolean);
      return;
    }

    current.end = beat.end;
    texts.push(String(beat.text || beat.body || '').trim());
  });

  flush();
  return groups.map((group, index) => ({
    ...group,
    id: `compare-pose-${index + 1}`,
    start: Number(group.start.toFixed(2)),
    end: Number((index === groups.length - 1 ? Math.min(durationSeconds, group.end) : group.end).toFixed(2)),
  })) as T[];
}

// Reuse the same scenes builder logic from jobs route
function buildDynamicCreatorScenes(
  captions: PreviewCaption[],
  totalDuration: number,
): Array<{ type: string; start: number; end: number; text?: string; highlightWord?: string; zoom?: number }> {
  type Scene = { type: 'creator_face' | 'typography' | 'key_point'; start: number; end: number; text?: string; highlightWord?: string; zoom?: number };
  const scenes: Scene[] = [];

  if (captions.length === 0) {
    scenes.push({ type: 'creator_face', start: 0, end: totalDuration, zoom: 1 });
    return scenes;
  }

  const firstCapStart = Number(captions[0].start ?? 0);
  const hookEnd = firstCapStart >= 1.5 ? Math.min(firstCapStart, 2.5)
    : firstCapStart >= 0.3 ? firstCapStart : 0;
  if (hookEnd > 0.2) {
    const hookText = captions[0].text.split(' ').slice(0, 5).join(' ');
    scenes.push({ type: 'typography', start: 0, end: hookEnd, text: hookText, highlightWord: hookText.split(' ').slice(-1)[0] });
  }

  let emphasisCounter = 0;
  for (let i = 0; i < captions.length; i++) {
    const cap = captions[i];
    const prevEnd = scenes.length > 0 ? scenes[scenes.length - 1].end : 0;
    const capStart = Math.max(prevEnd, Number(cap.start ?? 0));
    const capEnd = Math.max(capStart + 0.3, Number(cap.end ?? capStart + 2.5));
    const gap = capStart - prevEnd;
    if (gap > 1.5 && i > 0) {
      const gapText = captions[i - 1].text.split(' ').slice(0, 7).join(' ');
      scenes.push({ type: emphasisCounter++ % 2 === 0 ? 'key_point' : 'typography', start: prevEnd, end: capStart, text: gapText });
    } else if (gap > 0.03 && scenes.length > 0) {
      scenes[scenes.length - 1].end = capStart;
    }
    scenes.push({ type: 'creator_face', start: capStart, end: capEnd, zoom: i % 3 === 0 ? 1.0 : i % 3 === 1 ? 1.08 : 1.14 });
  }

  const last = scenes[scenes.length - 1];
  if (last && last.end < totalDuration - 0.05) {
    const tailDur = totalDuration - last.end;
    if (tailDur > 5) {
      const mid = last.end + tailDur * 0.35;
      const midCap = captions[Math.floor(captions.length / 2)];
      const ctaText = midCap?.text.split(' ').slice(0, 5).join(' ') || 'Follow for more';
      scenes.push({ type: 'typography', start: last.end, end: mid, text: ctaText, highlightWord: ctaText.split(' ')[0] });
      scenes.push({ type: 'creator_face', start: mid, end: totalDuration, zoom: 1.0 });
    } else if (tailDur > 2) {
      scenes.push({ type: 'key_point', start: last.end, end: totalDuration, text: captions[captions.length - 1]?.text || '' });
    } else {
      last.end = totalDuration;
    }
  }

  // Safety sweep
  if (scenes[0]) scenes[0].start = 0;
  if (scenes[scenes.length - 1]) scenes[scenes.length - 1].end = totalDuration;
  const valid = scenes.filter(s => s.end - s.start > 0.03);
  const covered: Scene[] = [];
  for (const s of valid) {
    const pe = covered.length > 0 ? covered[covered.length - 1].end : 0;
    if (s.start > pe + 0.05) covered.push({ type: 'creator_face', start: pe, end: s.start, zoom: 1.0 });
    covered.push(s);
  }
  const lc = covered[covered.length - 1];
  if (lc && lc.end < totalDuration - 0.05) covered.push({ type: 'creator_face', start: lc.end, end: totalDuration, zoom: 1.0 });
  if (covered.length === 0) covered.push({ type: 'creator_face', start: 0, end: totalDuration, zoom: 1.0 });
  return covered;
}

// ─── Helpers (copied from jobs route for consistency) ─────────────────────────

function buildCompareCaptionsFromGroq(renderWindow: {
  transcript: string;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds: number;
}): PreviewCaption[] {
  const words = (renderWindow.words || [])
    .filter(w => w.word && Number.isFinite(w.start) && Number.isFinite(w.end))
    .map(w => ({ start: Math.max(0, Number(w.start)), end: Math.max(Number(w.start) + 0.12, Number(w.end)), word: String(w.word) }));

  if (words.length) {
    const captions: PreviewCaption[] = [];
    let group: typeof words = [];
    const flush = () => {
      if (!group.length) return;
      captions.push({
        start: r(group[0].start),
        end: r(Math.max(group[group.length - 1].end, group[0].start + 0.65)),
        text: group.map(w => w.word).join(' '),
        words: group.map(w => ({ word: w.word, start: r(w.start), end: r(w.end) })),
      });
      group = [];
    };
    for (const word of words) {
      const gs = group[0]?.start ?? word.start;
      if (group.length && (group.length >= 5 || word.end - gs > 1.55)) flush();
      group.push(word);
    }
    flush();
    return captions.filter(c => c.text.trim());
  }

  const segments = (renderWindow.segments || []).filter(s => s.text && Number.isFinite(s.start) && Number.isFinite(s.end));
  if (segments.length) {
    return segments.flatMap(seg => {
      const parts = seg.text.split(/\s+/).filter(Boolean);
      const chunks = Math.max(1, Math.ceil(parts.length / 5));
      const dur = Math.max(0.8, Number(seg.end) - Number(seg.start));
      return Array.from({ length: chunks }, (_, i) => ({
        start: r(Number(seg.start) + (dur / chunks) * i),
        end: r(Number(seg.start) + (dur / chunks) * (i + 1)),
        text: parts.slice(i * 5, (i + 1) * 5).join(' '),
      }));
    }).filter(c => c.text.trim());
  }

  const words2 = renderWindow.transcript.split(/\s+/).filter(Boolean);
  const dur = Math.max(1, renderWindow.durationSeconds || 30);
  const chunks = Math.max(1, Math.ceil(words2.length / 5));
  return Array.from({ length: chunks }, (_, i) => ({
    start: r((dur / chunks) * i),
    end: r((dur / chunks) * (i + 1)),
    text: words2.slice(i * 5, (i + 1) * 5).join(' '),
  })).filter(c => c.text.trim());
}

function selectRenderWindow(transcription: {
  transcript: string;
  durationSeconds?: number;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
}) {
  const sourceDuration = Number.isFinite(transcription.durationSeconds || 0) && (transcription.durationSeconds || 0) > 0
    ? transcription.durationSeconds!
    : MAX_RENDER_WINDOW_SECONDS;
  const wordStart = (transcription.words || [])
    .filter(w => w.word?.trim().length >= MIN_SPEECH_TOKEN_LENGTH)
    .map(w => w.start)
    .find(s => Number.isFinite(s) && s >= 0);
  const segStart = (transcription.segments || [])
    .filter(s => s.text?.trim().length >= MIN_SPEECH_TOKEN_LENGTH)
    .map(s => s.start)
    .find(s => Number.isFinite(s) && s >= 0);
  const speechStart = wordStart ?? segStart ?? 0;
  const trimStart = r(Math.min(Math.max(0, sourceDuration - MAX_RENDER_WINDOW_SECONDS), Math.max(0, speechStart - SPEECH_LEAD_SECONDS)));
  const trimEnd = Math.min(sourceDuration, trimStart + MAX_RENDER_WINDOW_SECONDS);
  const duration = Math.max(1, Math.min(MAX_RENDER_WINDOW_SECONDS, trimEnd - trimStart));

  const shiftWords = (transcription.words || [])
    .filter(w => w.end > trimStart && w.start < trimEnd)
    .map(w => ({ ...w, start: r(Math.max(0, w.start - trimStart)), end: r(Math.min(trimEnd, w.end) - trimStart) }))
    .filter(w => w.word && w.end > w.start);

  const shiftSegs = (transcription.segments || [])
    .filter(s => s.end > trimStart && s.start < trimEnd)
    .map(s => ({ ...s, start: r(Math.max(0, s.start - trimStart)), end: r(Math.min(trimEnd, s.end) - trimStart) }))
    .filter(s => s.text && s.end > s.start);

  const transcript = shiftSegs.map(s => s.text.trim()).filter(Boolean).join(' ')
    || shiftWords.map(w => w.word.trim()).filter(Boolean).join(' ')
    || transcription.transcript || '';

  return {
    transcript,
    words: shiftWords.length ? shiftWords : undefined,
    segments: shiftSegs.length ? shiftSegs : undefined,
    durationSeconds: duration,
    trimStartSeconds: trimStart,
  };
}

function r(v: number) { return Math.round(v * 1000) / 1000; }
function readString(v: unknown): string { return typeof v === 'string' ? v.trim() : ''; }
function normalizeSubtitleLanguage(value: string) {
  const normalized = value.toLowerCase().replace(/[-_\s]+/g, '');
  if (!normalized || normalized === 'auto' || normalized === 'source') return undefined;
  if (normalized === 'english' || normalized === 'en') return 'english';
  if (normalized === 'hinglish' || normalized === 'romanenglish' || normalized === 'romanhindi' || normalized === 'romanurdu' || normalized === 'hindi' || normalized === 'urdu' || normalized === 'hi' || normalized === 'ur') return 'hinglish';
  return undefined;
}
