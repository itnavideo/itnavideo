/**
 * Canvas Effect Presets — generate timeline-driven effects from template data.
 *
 * Usage:
 *   import { buildPromoEffects, buildFinanceEffects } from './canvasEffectPresets';
 *   const effects = buildPromoEffects({ durationFrames: 900 });
 *   <CanvasGraphicsLayer effects={effects} />
 */

import type { CanvasEffect } from './CanvasGraphicsLayer';

// ─── LONG VIDEO PROMO EFFECTS ────────────────────────────────────────────────

export function buildPromoEffects(opts: {
  durationFrames: number;
  thumbnailY?: number;
  titleY?: number;
}): CanvasEffect[] {
  const { durationFrames, thumbnailY = 340, titleY = 680 } = opts;
  return [
    // Thumbnail glow border (pulse throughout)
    { type: 'glow-border', startFrame: 10, endFrame: durationFrames - 30,
      config: { x: 40, y: 60, width: 1000, height: 562, borderRadius: 16, color: '#FFE500' } },
    // Title underline draw-in
    { type: 'underline', startFrame: 20, endFrame: 60,
      config: { x: 140, y: titleY + 60, width: 800, color: '#FF6B35', thickness: 4 } },
    // Sparkles on thumbnail
    { type: 'sparkle', startFrame: 0, endFrame: 90,
      config: { count: 6, color: '#FFE500' } },
    // Progress bar at bottom
    { type: 'progress-bar', startFrame: 0, endFrame: durationFrames,
      config: { x: 40, y: 1890, width: 1000, height: 6, color: '#FF6B35' } },
  ];
}

// ─── FINANCE TEMPLATE EFFECTS ────────────────────────────────────────────────

export function buildFinanceEffects(opts: {
  durationFrames: number;
  cibilScore?: number;
  loanAmount?: number;
  emiAmount?: number;
  interestRate?: number;
}): CanvasEffect[] {
  const { durationFrames, cibilScore, loanAmount, emiAmount, interestRate } = opts;
  const effects: CanvasEffect[] = [];

  // CIBIL score gauge
  if (cibilScore) {
    effects.push({ type: 'gauge', startFrame: 15, endFrame: 90,
      config: { x: 540, y: 900, radius: 160, value: cibilScore, max: 900, min: 300,
        color: cibilScore >= 750 ? '#22C55E' : cibilScore >= 600 ? '#F59E0B' : '#EF4444',
        label: 'CIBIL Score' } });
    effects.push({ type: 'glow-pulse', startFrame: 15, endFrame: 90,
      config: { x: 540, y: 900, radius: 220,
        color: cibilScore >= 750 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)' } });
  }

  // Loan amount counter
  if (loanAmount) {
    effects.push({ type: 'counter', startFrame: 30, endFrame: 100,
      config: { x: 540, y: 1200, value: loanAmount, prefix: '₹', color: '#FFE500', fontSize: 68 } });
  }

  // EMI progress bar
  if (emiAmount) {
    effects.push({ type: 'progress-bar', startFrame: 60, endFrame: 150,
      config: { x: 80, y: 1400, width: 920, height: 12, color: '#5B6FFF' } });
  }

  // Interest rate meter (arrow pointing to rate zone)
  if (interestRate) {
    effects.push({ type: 'gauge', startFrame: 20, endFrame: 80,
      config: { x: 540, y: 1100, radius: 120, value: interestRate, max: 24, min: 0,
        color: interestRate <= 9 ? '#22C55E' : interestRate <= 15 ? '#F59E0B' : '#EF4444',
        label: '% Rate' } });
  }

  // Sparkle on big numbers
  effects.push({ type: 'sparkle', startFrame: 0, endFrame: 60,
    config: { count: 10, color: '#FFE500' } });

  return effects;
}

// ─── AUTO CAPTION EFFECTS ────────────────────────────────────────────────────

export function buildCaptionEffects(opts: {
  captions: { start: number; end: number; text: string }[];
  fps: number;
  highlightColor?: string;
  style?: 'underline' | 'glow' | 'box';
}): CanvasEffect[] {
  const { captions, fps, highlightColor = '#FF6B35', style = 'underline' } = opts;
  const effects: CanvasEffect[] = [];

  captions.forEach((cap, i) => {
    const sf = Math.round(cap.start * fps);
    const ef = Math.round(cap.end * fps);

    // Underline draw-in on each caption chunk
    if (style === 'underline' || style === 'glow') {
      effects.push({ type: 'underline', startFrame: sf, endFrame: sf + 12,
        config: { x: 100, y: 1760, width: 880, color: highlightColor, thickness: 3 } });
    }

    // Box highlight on every 3rd caption for emphasis
    if (style === 'box' && i % 3 === 0) {
      effects.push({ type: 'box-highlight', startFrame: sf, endFrame: ef,
        config: { x: 80, y: 1710, width: 920, height: 100, color: highlightColor, borderRadius: 12 } });
    }

    // Glow pulse on first caption
    if (i === 0) {
      effects.push({ type: 'glow-pulse', startFrame: sf, endFrame: sf + 20,
        config: { x: 540, y: 1760, radius: 200, color: `${highlightColor}33` } });
    }
  });

  return effects;
}

// ─── EXPLAINER / COMPARE EFFECTS ─────────────────────────────────────────────

export function buildCompareEffects(opts: {
  durationFrames: number;
  fps: number;
  leftTitle?: string;
  rightTitle?: string;
  accentColor?: string;
}): CanvasEffect[] {
  const { durationFrames, accentColor = '#7C5CFC' } = opts;
  return [
    // Arrow pointing left
    { type: 'arrow', startFrame: 30, endFrame: 60,
      config: { x1: 540, y1: 1100, x2: 180, y2: 1100, color: '#5B6FFF' } },
    // Arrow pointing right
    { type: 'arrow', startFrame: 30, endFrame: 60,
      config: { x1: 540, y1: 1100, x2: 900, y2: 1100, color: '#9B82FF' } },
    // VS circle highlight
    { type: 'circle-highlight', startFrame: 0, endFrame: 45,
      config: { x: 540, y: 860, radius: 70, color: accentColor } },
    // Dot pattern background
    { type: 'dot-pattern', startFrame: 0, endFrame: durationFrames,
      config: { spacing: 50, dotSize: 1.5, color: 'rgba(124,92,252,0.8)' } },
    // Wave at bottom
    { type: 'wave', startFrame: 0, endFrame: durationFrames,
      config: { y: 1820, amplitude: 20, color: `${accentColor}22`, speed: 0.05 } },
  ];
}

// ─── GENERIC INTRO EFFECTS (works on any template) ───────────────────────────

export function buildIntroEffects(opts: {
  durationFrames: number;
  primaryColor?: string;
}): CanvasEffect[] {
  const { durationFrames, primaryColor = '#FF6B35' } = opts;
  return [
    // Particle burst at start
    { type: 'particles', startFrame: 0, endFrame: 45,
      config: { x: 540, y: 200, count: 24, color: primaryColor, spread: 0.6 } },
    // Glow pulse intro
    { type: 'glow-pulse', startFrame: 0, endFrame: 30,
      config: { x: 540, y: 200, radius: 300, color: `${primaryColor}22` } },
    // Progress bar at bottom
    { type: 'progress-bar', startFrame: 0, endFrame: durationFrames,
      config: { x: 0, y: 1916, width: 1080, height: 4, color: primaryColor } },
  ];
}

// ─── KEYWORD-BASED AUTO BUILDER ───────────────────────────────────────────────
// Detects finance/explainer/promo patterns from transcript and returns fitting effects

export function autoDetectCanvasEffects(opts: {
  transcript?: string;
  topic?: string;
  templateType: 'autoCaption' | 'compare' | 'longVideoPromo';
  durationFrames: number;
  fps: number;
  primaryColor?: string;
}): CanvasEffect[] {
  const { transcript = '', topic = '', templateType, durationFrames, fps, primaryColor = '#FF6B35' } = opts;
  const text = (transcript + ' ' + topic).toLowerCase();

  const isFinance = /cibil|loan|emi|interest|₹|credit|insurance|tax|income|salary|invest|mutual|sip/i.test(text);
  const isExplainer = /vs|compare|versus|difference|better|konsa|kaunsa|versus/i.test(text);

  const effects: CanvasEffect[] = buildIntroEffects({ durationFrames, primaryColor });

  if (templateType === 'longVideoPromo') {
    effects.push(...buildPromoEffects({ durationFrames }));
  }

  if (templateType === 'compare' || isExplainer) {
    effects.push(...buildCompareEffects({ durationFrames, fps }));
  }

  if (isFinance) {
    const loanMatch = text.match(/(\d+)\s*(?:lakh|lac|lacs)/i);
    const cibilMatch = text.match(/(\d{3})\s*(?:cibil|score)/i);
    effects.push(...buildFinanceEffects({
      durationFrames,
      cibilScore: cibilMatch ? parseInt(cibilMatch[1]) : undefined,
      loanAmount: loanMatch ? parseInt(loanMatch[1]) * 100000 : undefined,
    }));
  }

  return effects;
}
