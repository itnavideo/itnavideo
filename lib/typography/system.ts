import React from 'react';

export const TYPE_SCALE = {
  display: { fontSize: 72, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em' },
  heading: { fontSize: 52, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em' },
  body: { fontSize: 36, fontWeight: 600, lineHeight: 1.3, letterSpacing: '0em' },
};

export function getFontStack() {
  return 'Inter, system-ui, -apple-system, sans-serif';
}

export function findEmphasisWords(text: string, manualEmphasis?: string[]): string[] {
  if (manualEmphasis && manualEmphasis.length > 0) return manualEmphasis;
  if (!text) return [];
  const words = text.split(/\s+/).filter(Boolean);
  return words.filter((w) => w.length > 5 || /^[A-Z]/.test(w));
}

export function typeStyleToCSS(style: any, color = '#FFFFFF'): React.CSSProperties {
  return {
    fontSize: style?.fontSize || 36,
    fontWeight: style?.fontWeight || 700,
    lineHeight: style?.lineHeight || 1.2,
    letterSpacing: style?.letterSpacing || 'normal',
    color,
  };
}

export function applyContrast(style: any, mode: 'primary' | 'secondary' = 'primary') {
  return {
    ...style,
    opacity: mode === 'secondary' ? 0.75 : 1,
  };
}

export function getScaledTypeStyle(type: 'display' | 'heading' | 'body', width = 1080) {
  const base = TYPE_SCALE[type] || TYPE_SCALE.body;
  const scale = width / 1080;
  return {
    ...base,
    fontSize: Math.round(base.fontSize * scale),
  };
}
