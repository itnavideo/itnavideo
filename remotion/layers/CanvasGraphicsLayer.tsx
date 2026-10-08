/**
 * CanvasGraphicsLayer — Reusable Canvas-based motion graphics for Remotion templates.
 *
 * Purpose: Generate dynamic visual effects (particles, glows, arrows, gauges, charts,
 * progress bars, highlights) without static assets. Driven by timeline JSON.
 *
 * Usage:
 *   <CanvasGraphicsLayer
 *     effects={[
 *       { type: 'particles', startFrame: 0, endFrame: 120, config: { count: 30, color: '#FFE500' } },
 *       { type: 'glow-pulse', startFrame: 30, endFrame: 90, config: { x: 540, y: 960, radius: 200, color: '#7C5CFC' } },
 *     ]}
 *   />
 *
 * Renders as an absolute-positioned canvas overlay (1080x1920).
 */

import React, { useRef, useEffect } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type CanvasEffectType =
  | 'particles'
  | 'glow-pulse'
  | 'glow-border'
  | 'underline'
  | 'progress-bar'
  | 'gauge'
  | 'counter'
  | 'arrow'
  | 'circle-highlight'
  | 'box-highlight'
  | 'line-draw'
  | 'countdown'
  | 'dot-pattern'
  | 'wave'
  | 'sparkle';

export interface CanvasEffect {
  type: CanvasEffectType;
  startFrame: number;
  endFrame: number;
  config: Record<string, any>;
}

interface CanvasGraphicsLayerProps {
  effects: CanvasEffect[];
  width?: number;
  height?: number;
  zIndex?: number;
}

// ─── HELPER: eased progress within an effect's lifetime ──────────────────────

function getProgress(frame: number, start: number, end: number): number {
  if (frame < start) return 0;
  if (frame >= end) return 1;
  return (frame - start) / (end - start);
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Seeded pseudo-random for deterministic particles
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ─── EFFECT RENDERERS ────────────────────────────────────────────────────────

function renderParticles(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = getProgress(frame, start, end);
  const count = config.count || 20;
  const color = config.color || '#FFE500';
  const maxRadius = config.maxRadius || 4;
  const spread = config.spread || 1;
  const cx = config.x ?? 540;
  const cy = config.y ?? 960;

  for (let i = 0; i < count; i++) {
    const seed = i * 7.31;
    const angle = seededRandom(seed) * Math.PI * 2;
    const dist = seededRandom(seed + 1) * 400 * spread * easeOut(progress);
    const x = cx + Math.cos(angle + frame * 0.01) * dist;
    const y = cy + Math.sin(angle + frame * 0.01) * dist;
    const r = seededRandom(seed + 2) * maxRadius * (1 - progress * 0.5);
    const alpha = Math.max(0, 1 - progress * 1.2) * 0.8;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color.replace(')', `,${alpha})`).replace('rgb', 'rgba');
    if (!color.includes('rgba')) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function renderGlowPulse(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = getProgress(frame, start, end);
  const x = config.x ?? 540;
  const y = config.y ?? 960;
  const baseRadius = config.radius || 150;
  const color = config.color || 'rgba(124, 92, 252, 0.3)';
  const pulse = Math.sin(progress * Math.PI) * 0.4 + 0.6;
  const radius = baseRadius * pulse;

  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function renderGlowBorder(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = getProgress(frame, start, end);
  const x = config.x ?? 40;
  const y = config.y ?? 60;
  const w = config.width ?? 1000;
  const h = config.height ?? 562;
  const radius = config.borderRadius ?? 16;
  const color = config.color || '#FFE500';
  const pulse = 0.4 + Math.sin(frame * 0.06) * 0.3;
  const alpha = Math.sin(progress * Math.PI) * pulse;

  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = config.lineWidth || 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

function renderUnderline(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = easeOut(getProgress(frame, start, end));
  const x = config.x ?? 100;
  const y = config.y ?? 700;
  const maxWidth = config.width ?? 880;
  const color = config.color || '#FF6B35';
  const thickness = config.thickness || 4;

  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + maxWidth * progress, y);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function renderProgressBar(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = easeInOut(getProgress(frame, start, end));
  const x = config.x ?? 60;
  const y = config.y ?? 1800;
  const w = config.width ?? 960;
  const h = config.height || 8;
  const bgColor = config.bgColor || 'rgba(255,255,255,0.1)';
  const fillColor = config.color || '#FF6B35';
  const radius = h / 2;

  // Background track
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();

  // Fill
  const fillW = w * progress;
  if (fillW > 0) {
    ctx.fillStyle = fillColor;
    ctx.shadowColor = fillColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(x, y, fillW, h, radius);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Glowing orb at tip
  if (fillW > 4) {
    ctx.beginPath();
    ctx.arc(x + fillW, y + h / 2, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = fillColor;
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function renderGauge(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = easeOut(getProgress(frame, start, end));
  const cx = config.x ?? 540;
  const cy = config.y ?? 1200;
  const radius = config.radius || 160;
  const value = (config.value ?? 750) * progress;
  const maxValue = config.max || 900;
  const minValue = config.min || 300;
  const color = config.color || '#22C55E';
  const label = config.label || '';

  const startAngle = Math.PI * 0.75;
  const endAngle = Math.PI * 2.25;
  const valueAngle = startAngle + ((value - minValue) / (maxValue - minValue)) * (endAngle - startAngle);

  // Background arc
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();

  // Value arc
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, valueAngle);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Center value text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(Math.round(value).toString(), cx, cy - 10);

  // Label
  if (label) {
    ctx.font = '600 20px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(label, cx, cy + 30);
  }
}

function renderCounter(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = easeOut(getProgress(frame, start, end));
  const x = config.x ?? 540;
  const y = config.y ?? 960;
  const targetValue = config.value ?? 10000;
  const prefix = config.prefix || '₹';
  const suffix = config.suffix || '';
  const color = config.color || '#FFE500';
  const fontSize = config.fontSize || 72;

  const currentValue = Math.round(targetValue * progress);
  const text = `${prefix}${currentValue.toLocaleString('en-IN')}${suffix}`;

  ctx.font = `900 ${fontSize}px system-ui`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

function renderArrow(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = easeOut(getProgress(frame, start, end));
  const x1 = config.x1 ?? 200;
  const y1 = config.y1 ?? 900;
  const x2 = config.x2 ?? 880;
  const y2 = config.y2 ?? 900;
  const color = config.color || '#FF6B35';
  const headSize = config.headSize || 16;

  const dx = (x2 - x1) * progress;
  const dy = (y2 - y1) * progress;
  const ex = x1 + dx;
  const ey = y1 + dy;

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  // Arrowhead
  if (progress > 0.1) {
    const angle = Math.atan2(dy, dx);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headSize * Math.cos(angle - 0.4), ey - headSize * Math.sin(angle - 0.4));
    ctx.lineTo(ex - headSize * Math.cos(angle + 0.4), ey - headSize * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function renderCircleHighlight(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = easeOut(getProgress(frame, start, end));
  const cx = config.x ?? 540;
  const cy = config.y ?? 960;
  const radius = config.radius || 80;
  const color = config.color || '#FF3D3D';

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.globalAlpha = Math.sin(getProgress(frame, start, end) * Math.PI);
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * progress, 0, Math.PI * 2 * progress);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function renderBoxHighlight(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = easeOut(getProgress(frame, start, end));
  const x = config.x ?? 100;
  const y = config.y ?? 800;
  const w = config.width ?? 880;
  const h = config.height ?? 200;
  const color = config.color || '#5B6FFF';
  const radius = config.borderRadius || 12;
  const alpha = Math.sin(getProgress(frame, start, end) * Math.PI) * 0.8;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = alpha;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(x, y, w * progress, h, radius);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

function renderLineDraw(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = easeOut(getProgress(frame, start, end));
  const points: [number, number][] = config.points || [[100, 960], [540, 800], [980, 960]];
  const color = config.color || '#22D3EE';

  if (points.length < 2) return;
  const totalSegments = points.length - 1;
  const drawnSegments = progress * totalSegments;

  ctx.strokeStyle = color;
  ctx.lineWidth = config.lineWidth || 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);

  for (let i = 0; i < totalSegments; i++) {
    if (i >= drawnSegments) break;
    const segProgress = Math.min(1, drawnSegments - i);
    const [sx, sy] = points[i];
    const [ex, ey] = points[i + 1];
    ctx.lineTo(sx + (ex - sx) * segProgress, sy + (ey - sy) * segProgress);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function renderCountdown(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = getProgress(frame, start, end);
  const cx = config.x ?? 540;
  const cy = config.y ?? 960;
  const totalSeconds = config.seconds || 10;
  const remaining = Math.ceil(totalSeconds * (1 - progress));
  const color = config.color || '#FF6B35';
  const radius = config.radius || 100;

  // Circle countdown
  const angle = -Math.PI / 2 + (1 - progress) * Math.PI * 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, angle, false);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Number
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 64px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(remaining.toString(), cx, cy);
}

function renderDotPattern(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = getProgress(frame, start, end);
  const alpha = Math.sin(progress * Math.PI) * 0.15;
  const color = config.color || 'rgba(255,255,255,1)';
  const spacing = config.spacing || 40;
  const dotSize = config.dotSize || 2;
  const offsetX = (frame * 0.3) % spacing;
  const offsetY = (frame * 0.2) % spacing;

  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  for (let x = offsetX; x < 1080; x += spacing) {
    for (let y = offsetY; y < 1920; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function renderWave(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = getProgress(frame, start, end);
  const y = config.y ?? 1700;
  const amplitude = config.amplitude || 30;
  const color = config.color || 'rgba(124, 92, 252, 0.3)';
  const speed = config.speed || 0.04;
  const alpha = Math.sin(progress * Math.PI);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  for (let x = 0; x <= 1080; x += 4) {
    const waveY = y + Math.sin(x * 0.01 + frame * speed) * amplitude;
    if (x === 0) ctx.moveTo(x, waveY);
    else ctx.lineTo(x, waveY);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function renderSparkle(
  ctx: CanvasRenderingContext2D, frame: number,
  start: number, end: number, config: Record<string, any>
) {
  const progress = getProgress(frame, start, end);
  const count = config.count || 8;
  const color = config.color || '#FFE500';
  const alpha = Math.sin(progress * Math.PI) * 0.9;

  ctx.globalAlpha = alpha;
  for (let i = 0; i < count; i++) {
    const seed = i * 13.7;
    const x = seededRandom(seed) * 1080;
    const y = seededRandom(seed + 1) * 1920;
    const size = 3 + seededRandom(seed + 2) * 6;
    const twinkle = Math.sin(frame * 0.15 + i * 2) * 0.5 + 0.5;

    ctx.fillStyle = color;
    ctx.globalAlpha = alpha * twinkle;

    // 4-point star
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.3, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size * 0.3, y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x, y + size * 0.3);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y - size * 0.3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── EFFECT DISPATCHER ───────────────────────────────────────────────────────

function renderEffect(
  ctx: CanvasRenderingContext2D,
  frame: number,
  effect: CanvasEffect
) {
  const { type, startFrame, endFrame, config } = effect;
  if (frame < startFrame || frame > endFrame) return;

  switch (type) {
    case 'particles':
      return renderParticles(ctx, frame, startFrame, endFrame, config);
    case 'glow-pulse':
      return renderGlowPulse(ctx, frame, startFrame, endFrame, config);
    case 'glow-border':
      return renderGlowBorder(ctx, frame, startFrame, endFrame, config);
    case 'underline':
      return renderUnderline(ctx, frame, startFrame, endFrame, config);
    case 'progress-bar':
      return renderProgressBar(ctx, frame, startFrame, endFrame, config);
    case 'gauge':
      return renderGauge(ctx, frame, startFrame, endFrame, config);
    case 'counter':
      return renderCounter(ctx, frame, startFrame, endFrame, config);
    case 'arrow':
      return renderArrow(ctx, frame, startFrame, endFrame, config);
    case 'circle-highlight':
      return renderCircleHighlight(ctx, frame, startFrame, endFrame, config);
    case 'box-highlight':
      return renderBoxHighlight(ctx, frame, startFrame, endFrame, config);
    case 'line-draw':
      return renderLineDraw(ctx, frame, startFrame, endFrame, config);
    case 'countdown':
      return renderCountdown(ctx, frame, startFrame, endFrame, config);
    case 'dot-pattern':
      return renderDotPattern(ctx, frame, startFrame, endFrame, config);
    case 'wave':
      return renderWave(ctx, frame, startFrame, endFrame, config);
    case 'sparkle':
      return renderSparkle(ctx, frame, startFrame, endFrame, config);
  }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const CanvasGraphicsLayer: React.FC<CanvasGraphicsLayerProps> = ({
  effects,
  width = 1080,
  height = 1920,
  zIndex = 10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Render active effects for this frame
    for (const effect of effects) {
      if (frame >= effect.startFrame && frame <= effect.endFrame) {
        ctx.save();
        renderEffect(ctx, frame, effect);
        ctx.restore();
      }
    }
  }, [frame, effects, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: 'none',
        zIndex,
      }}
    />
  );
};

export default CanvasGraphicsLayer;
