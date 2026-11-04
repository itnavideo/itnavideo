// lib/typography/system.ts
// Typography scales, stacks, and contrast styling for Remotion compositions

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  letterSpacing: string;
  fontWeight: number | string;
  opacity?: number;
}

export const TYPE_SCALE: Record<string, TypeStyle> = {
  display: { fontSize: 72, lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 900 },
  headline: { fontSize: 52, lineHeight: 1.2, letterSpacing: '-0.02em', fontWeight: 800 },
  title: { fontSize: 40, lineHeight: 1.25, letterSpacing: '-0.01em', fontWeight: 700 },
  body: { fontSize: 32, lineHeight: 1.35, letterSpacing: 'normal', fontWeight: 600 },
  caption: { fontSize: 24, lineHeight: 1.4, letterSpacing: 'normal', fontWeight: 500 },
};

export function getFontStack(category: string = 'sans'): string {
  if (category === 'serif') return 'Georgia, "Playfair Display", serif';
  if (category === 'mono') return 'ui-monospace, Menlo, Monaco, Consolas, monospace';
  return '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
}

export function findEmphasisWords(text: string, emphasisHint?: string): string[] {
  if (emphasisHint) {
    const hintWords = emphasisHint.toLowerCase().split(/\s+/).filter(Boolean);
    const tokens = text.split(/\s+/);
    return tokens.filter((t) => hintWords.includes(t.toLowerCase().replace(/[^a-z0-9]/g, '')));
  }

  // Auto-detect numbers, uppercase, or strong keywords
  const tokens = text.split(/\s+/);
  return tokens.filter((w) => {
    const clean = w.replace(/[^a-zA-Z0-9]/g, '');
    return /\d/.test(clean) || (clean.length >= 3 && clean === clean.toUpperCase());
  });
}

export function getScaledTypeStyle(scaleName: string, containerWidth: number = 1920): TypeStyle {
  const base = TYPE_SCALE[scaleName] || TYPE_SCALE.body;
  const scaleFactor = containerWidth / 1920;
  return {
    ...base,
    fontSize: Math.round(base.fontSize * Math.max(0.65, Math.min(1.2, scaleFactor))),
  };
}

export function applyContrast(style: TypeStyle, level: 'primary' | 'secondary' | 'muted' = 'primary'): TypeStyle {
  const opacity = level === 'primary' ? 1.0 : level === 'secondary' ? 0.85 : 0.6;
  return { ...style, opacity };
}

export function typeStyleToCSS(style: TypeStyle, color: string = '#FFFFFF'): React.CSSProperties {
  return {
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    fontWeight: style.fontWeight as any,
    color,
    opacity: style.opacity ?? 1,
  };
}

