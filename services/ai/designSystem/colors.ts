export type DesignColorPlan = {
  backgroundColor: string;
  accentColor: string;
  headlineColor: string;
  bodyColor: string;
  strokeColor: string;
  panelColor: string;
  contrastMode: 'light_on_dark' | 'dark_on_light';
};

const DARK_TEXT = '0x111827';
const LIGHT_TEXT = '0xffffff';
const DARK_STROKE = '0x000000';
const LIGHT_STROKE = '0xffffff';

const STYLE_PALETTES: Record<string, Array<{ backgroundColor: string; accentColor: string }>> = {
  luxury_edit: [
    { backgroundColor: '0x111827', accentColor: '0xfbbf24' },
    { backgroundColor: '0x0f172a', accentColor: '0xfacc15' },
  ],
  slow_cinematic: [
    { backgroundColor: '0x101014', accentColor: '0x38bdf8' },
    { backgroundColor: '0x0f172a', accentColor: '0x5eead4' },
  ],
  meme_style: [
    { backgroundColor: '0xfffbeb', accentColor: '0xdc2626' },
    { backgroundColor: '0xeff6ff', accentColor: '0x2563eb' },
  ],
  fast_cuts: [
    { backgroundColor: '0x0f172a', accentColor: '0x22d3ee' },
    { backgroundColor: '0xf8fafc', accentColor: '0x7c3aed' },
  ],
  reels_pacing: [
    { backgroundColor: '0xf8fafc', accentColor: '0x0f766e' },
    { backgroundColor: '0xf0fdf4', accentColor: '0x7c3aed' },
  ],
  youtube_documentary: [
    { backgroundColor: '0xf8fafc', accentColor: '0x1d4ed8' },
    { backgroundColor: '0x111827', accentColor: '0x93c5fd' },
  ],
};

export function buildTextCardDesign(input: {
  selectedStyle: string;
  role: string;
  index: number;
}): DesignColorPlan {
  const base = pickBasePalette(input);
  return enforceContrast(base.backgroundColor, base.accentColor);
}

export function enforceContrast(backgroundColor: string, accentColor: string): DesignColorPlan {
  const bg = normalizeHex(backgroundColor);
  const accent = normalizeHex(accentColor);
  const darkContrast = getContrastRatio(bg, DARK_TEXT);
  const lightContrast = getContrastRatio(bg, LIGHT_TEXT);
  const useLightText = lightContrast >= darkContrast;

  return {
    backgroundColor: toFfmpegColor(bg),
    accentColor: getContrastRatio(bg, accent) >= 3 ? toFfmpegColor(accent) : useLightText ? '0x5eead4' : '0x0f766e',
    headlineColor: useLightText ? LIGHT_TEXT : DARK_TEXT,
    bodyColor: useLightText ? '0xe5e7eb' : '0x1f2937',
    strokeColor: useLightText ? DARK_STROKE : LIGHT_STROKE,
    panelColor: useLightText ? 'black@0.42' : 'white@0.72',
    contrastMode: useLightText ? 'light_on_dark' : 'dark_on_light',
  };
}

export function getContrastRatio(colorA: string, colorB: string) {
  const a = getRelativeLuminance(normalizeHex(colorA));
  const b = getRelativeLuminance(normalizeHex(colorB));
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function pickBasePalette(input: { selectedStyle: string; role: string; index: number }) {
  if (input.role === 'hook') return { backgroundColor: '0xf8fafc', accentColor: '0x0f766e' };
  if (input.role === 'cta') return { backgroundColor: '0xeff6ff', accentColor: '0x2563eb' };

  const palettes = STYLE_PALETTES[input.selectedStyle] || STYLE_PALETTES.reels_pacing;
  return palettes[input.index % palettes.length];
}

function getRelativeLuminance(hexColor: string) {
  const [r, g, b] = hexToRgb(hexColor).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hexColor: string) {
  const raw = normalizeHex(hexColor).slice(1);
  return [
    Number.parseInt(raw.slice(0, 2), 16),
    Number.parseInt(raw.slice(2, 4), 16),
    Number.parseInt(raw.slice(4, 6), 16),
  ];
}

function normalizeHex(value: string) {
  const raw = String(value || '').trim();
  if (/^0x[0-9a-f]{6}$/i.test(raw)) return `#${raw.slice(2)}`.toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
  return '#101014';
}

function toFfmpegColor(hexColor: string) {
  return `0x${normalizeHex(hexColor).slice(1)}`;
}
