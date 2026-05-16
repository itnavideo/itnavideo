export type VideoStyleName = 'classic' | 'cinematic' | 'clean';

export type VideoStyleConfig = {
  name: VideoStyleName;
  label: 'Classic' | 'Cinematic' | 'Clean';
  description: string;
  progressColor: string;
};

export type ZoomEvent = {
  start: number;
  duration?: number;
  scale?: number;
  direction?: 'in' | 'out';
  reason?: string;
};

export const SHORTS_CONFIG = {
  width: 1080,
  height: 1920,
  zoomScale: 1.1,
  zoomInterval: 6,
  zoomDuration: 3,
  preset: 'veryfast',
  crf: '23',
  progressHeight: 6,
  audioFilters: [
    'compand=attacks=0:decays=0.25:points=-80/-80|-30/-18|-12/-8|0/-1',
    'loudnorm=I=-16:TP=-1.5:LRA=11',
  ],
} as const;

export const videoStyles: Record<VideoStyleName, VideoStyleConfig> = {
  classic: {
    name: 'classic',
    label: 'Classic',
    description: 'Blurred auto-fill background, centered original video, face glow, and rhythmic jump zoom.',
    progressColor: '0x5eead4',
  },
  cinematic: {
    name: 'cinematic',
    label: 'Cinematic',
    description: 'Classic Shorts treatment with higher contrast, film tone, and a subtle vignette.',
    progressColor: '0xfbbf24',
  },
  clean: {
    name: 'clean',
    label: 'Clean',
    description: 'Solid black 9:16 canvas, scaled-to-fit source video, and sharpening without blurred background.',
    progressColor: '0x38bdf8',
  },
};

export function getVideoStyleConfig(style: unknown): VideoStyleConfig {
  const normalized = normalizeStyleName(style);
  return videoStyles[normalized];
}

export function getShortsFilter(style: unknown, zoomEvents: ZoomEvent[] = []) {
  const styleConfig = getVideoStyleConfig(style);

  if (styleConfig.name === 'clean') {
    return buildCleanShortsFilter(zoomEvents);
  }

  return buildBlurredShortsFilter(styleConfig.name, zoomEvents);
}

export function buildMobileAudioFilter(inputLabel = '0:a') {
  return `[${inputLabel}]${SHORTS_CONFIG.audioFilters.join(',')}[aout]`;
}

function buildBlurredShortsFilter(style: 'classic' | 'cinematic', zoomEvents: ZoomEvent[]) {
  const { width, height } = SHORTS_CONFIG;
  const foregroundFilters = style === 'cinematic'
    ? [
      'unsharp=5:5:0.45:3:3:0.20',
      'curves=preset=medium_contrast',
      'eq=contrast=1.14:saturation=1.05:brightness=0.02',
    ]
    : [
      'unsharp=5:5:0.45:3:3:0.20',
      'curves=preset=lighter',
      'eq=contrast=1.06:saturation=1.08',
    ];
  const compositeFilters = style === 'cinematic'
    ? ['vignette=angle=PI/5:mode=backward']
    : [];

  return [
    `[0:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},boxblur=24:2,eq=brightness=-0.08:saturation=1.05[shorts_bg]`,
    `[0:v]scale=${width}:${height}:force_original_aspect_ratio=decrease[shorts_fg_fit]`,
    `[shorts_fg_fit]${foregroundFilters.join(',')}[shorts_fg]`,
    `[shorts_bg][shorts_fg]overlay=x=(W-w)/2:y=(H-h)/2:eval=frame[shorts_composite]`,
    `[shorts_composite]${[getDynamicCanvasZoomFilter(zoomEvents), 'setsar=1', ...compositeFilters].join(',')}[viral_shorts_v]`,
  ].join(';');
}

function buildCleanShortsFilter(zoomEvents: ZoomEvent[]) {
  const { width, height } = SHORTS_CONFIG;

  return [
    `color=c=black:s=${width}x${height}:r=30[shorts_bg]`,
    `[0:v]scale=${width}:${height}:force_original_aspect_ratio=decrease[shorts_fg_fit]`,
    '[shorts_fg_fit]unsharp=5:5:0.50:3:3:0.20,eq=contrast=1.04:saturation=1.04[shorts_fg]',
    `[shorts_bg][shorts_fg]overlay=x=(W-w)/2:y=(H-h)/2:eval=frame,${getDynamicCanvasZoomFilter(zoomEvents)},setsar=1[viral_shorts_v]`,
  ].join(';');
}

function getDynamicCanvasZoomFilter(zoomEvents: ZoomEvent[] = []) {
  const { width, height } = SHORTS_CONFIG;
  const zoomExpr = getZoomExpression(zoomEvents);
  return `scale=w='${width}*${zoomExpr}':h='${height}*${zoomExpr}':eval=frame,crop=${width}:${height}`;
}

function getZoomExpression(zoomEvents: ZoomEvent[]) {
  const normalizedEvents = zoomEvents
    .map((event) => ({
      start: roundFilterNumber(event.start),
      duration: roundFilterNumber(event.duration || 0.55),
      scale: roundFilterNumber(event.scale || (event.direction === 'out' ? 1.08 : 1.12)),
    }))
    .filter((event) => event.start >= 0 && event.duration > 0 && event.scale > 1)
    .slice(0, 24);

  if (!normalizedEvents.length) {
    return getFallbackZoomExpression();
  }

  return normalizedEvents.reduce((expression, event) => {
    const pulse = `if(between(t\\,${event.start}\\,${roundFilterNumber(event.start + event.duration)})\\,1+(${roundFilterNumber(event.scale - 1)})*sin((t-${event.start})/${event.duration}*PI)\\,1)`;
    return `max(${expression}\\,${pulse})`;
  }, '1');
}

function getFallbackZoomExpression() {
  const { zoomScale, zoomInterval, zoomDuration } = SHORTS_CONFIG;
  const zoomWindowStart = zoomInterval - zoomDuration;
  return `if(between(mod(t\\,${zoomInterval})\\,${zoomWindowStart}\\,${zoomInterval})\\,${zoomScale}\\,1)`;
}

function roundFilterNumber(value: number) {
  return Math.round(value * 1000) / 1000;
}

function normalizeStyleName(style: unknown): VideoStyleName {
  const normalized = String(style || '').trim().toLowerCase();

  if (normalized === 'cinematic') return 'cinematic';
  if (normalized === 'clean') return 'clean';
  if (normalized === 'classic' || normalized === 'social') return 'classic';

  return 'classic';
}
