import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { FacelessGraphicItem, SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export type Props = {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
};

/**
 * 9:16 Vertical Faceless Graphic Scene (1080×1920)
 * SVG viewBox = "0 0 540 960" — native 9:16 coordinate space.
 * (The 16:9 variant lives in its own file with its own layout constants.)
 */

// ── Canvas + safe zones ────────────────────────────────────────
// Platform UI (captions, like/share rail, username) covers the top and bottom
// of vertical video, so charts are centred inside a safe band.
export const VB_W = 540;
export const VB_H = 960;
const SAFE_TOP = 150;
const SAFE_BOTTOM = 800;
const SAFE_CENTER_Y = (SAFE_TOP + SAFE_BOTTOM) / 2; // 475
const SIDE_MARGIN = 60;
const CONTENT_W = VB_W - SIDE_MARGIN * 2; // 420

// ── Colors ─────────────────────────────────────────────────────
const ORANGE = '#FF5722';
const AMBER = '#FFA000';
const EMERALD = '#10B981';
const VIOLET = '#8B5CF6';
const SKY = '#38BDF8';
export const DEFAULT_ACCENTS = [ORANGE, EMERALD, VIOLET, SKY, AMBER];

// ── Default theme: clean white ─────────────────────────────────
// Used whenever no palette is supplied (or a palette field is missing),
// so every faceless scene starts from a white canvas with dark ink.
export const WHITE_THEME = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  ink: '#0F172A',       // near-black, easier on the eye than pure #000
  muted: '#64748B',
  hairline: '#E5E7EB',  // bar tracks, card borders
};
export type SceneTheme = typeof WHITE_THEME;

/** Merge any (partial) overrides on top of the white defaults. */
export function resolveTheme(overrides?: Partial<SceneTheme>): SceneTheme {
  return { ...WHITE_THEME, ...(overrides ?? {}) };
}

/** Full-canvas background rect — render this first inside the <svg>. */
export function SceneBackground({ color = WHITE_THEME.background }: { color?: string }) {
  return <rect x={0} y={0} width={VB_W} height={VB_H} fill={color} />;
}

// ── Motion ─────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, mass: 0.75, stiffness: 115 };
const STAGGER_FRAMES = 6;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Per-item progress so each bar draws in sequence rather than all at once. */
function staggered(draw: number, idx: number, count: number): number {
  const span = 0.6; // portion of the timeline each item animates over
  const step = count > 1 ? (1 - span) / (count - 1) : 0;
  return clamp01((draw - idx * step) / span);
}

// ── Text helpers ───────────────────────────────────────────────
const AVG_CHAR_WIDTH = 0.56; // avg glyph width as a fraction of font size (bold sans)

function charsThatFit(maxWidth: number, size: number): number {
  return Math.max(6, Math.floor(maxWidth / (size * AVG_CHAR_WIDTH)));
}

/** Word-wrap to `maxLines`, adding an ellipsis if the text is truncated. */
export function wrapLabel(label: string, charsPerLine: number, maxLines = 3): string[] {
  const words = String(label ?? '').split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && next.length > charsPerLine) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);

  if (lines.length <= maxLines) return lines;

  const kept = lines.slice(0, maxLines);
  const last = kept[maxLines - 1];
  kept[maxLines - 1] =
    (last.length >= charsPerLine ? last.slice(0, Math.max(1, charsPerLine - 1)) : last).replace(/[.,;:\s]+$/, '') + '…';
  return kept;
}

function MultiLineText({
  text, x, y, color, font, size = 28, weight = 750, anchor = 'middle', lineHeight, maxWidth = CONTENT_W, maxLines = 3,
}: {
  text: string; x: number; y: number; color: string; font: string;
  size?: number; weight?: number; anchor?: 'start' | 'middle' | 'end';
  lineHeight?: number; maxWidth?: number; maxLines?: number;
}) {
  const lh = lineHeight ?? Math.round(size * 1.28);
  const lines = wrapLabel(text, charsThatFit(maxWidth, size), maxLines);
  return (
    <text
      x={x} y={y} textAnchor={anchor} fill={color}
      fontFamily={font} fontSize={size} fontWeight={weight}
    >
      {lines.map((ln, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lh}>{ln}</tspan>
      ))}
    </text>
  );
}

/** Height a wrapped block will occupy — used for layout so nothing overlaps. */
function blockHeight(text: string, size: number, maxWidth: number, maxLines = 3): number {
  const n = wrapLabel(text, charsThatFit(maxWidth, size), maxLines).length || 1;
  return size + (n - 1) * Math.round(size * 1.28);
}

// ── Allocation (horizontal bars) ───────────────────────────────

export function AllocationChart({
  items, maxValue, draw, localFrame, fps, ink, hairline, headingFont, bodyFont, id, accents = DEFAULT_ACCENTS,
}: {
  items: FacelessGraphicItem[]; maxValue: number; draw: number; localFrame: number; fps: number;
  ink: string; hairline: string; headingFont: string; bodyFont: string; id: string;
  accents?: string[];
}) {
  const barH = 30;
  const labelToBar = 14;
  const rowGap = 34;
  const valueColW = 110;                        // reserved so long labels never hit the value
  const labelW = CONTENT_W - valueColW;
  const safeMax = maxValue > 0 ? maxValue : Math.max(1, ...items.map((i) => i.value || 0));

  // Measure rows first, then centre the whole stack in the safe band.
  const rows = items.map((item) => {
    const labelH = blockHeight(item.label, 24, labelW, 2);
    return { labelH, h: labelH + labelToBar + barH };
  });
  const totalH = rows.reduce((s, r) => s + r.h, 0) + rowGap * Math.max(0, items.length - 1);
  let cursor = SAFE_CENTER_Y - totalH / 2;

  return (
    <g>
      <defs>
        {items.map((_, idx) => {
          const c = accents[idx % accents.length];
          return (
            <linearGradient key={idx} id={`${id}-bar-${idx}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={c} stopOpacity={0.82} />
              <stop offset="100%" stopColor={c} stopOpacity={1} />
            </linearGradient>
          );
        })}
      </defs>

      {items.map((item, idx) => {
        const row = rows[idx];
        const top = cursor;
        cursor += row.h + rowGap;

        const accent = accents[idx % accents.length];
        const entered = spring({ frame: Math.max(0, localFrame - idx * STAGGER_FRAMES), fps, config: SPRING_CONFIG });
        const slideY = interpolate(entered, [0, 1], [18, 0]);
        const rowDraw = staggered(draw, idx, items.length);

        const ratio = clamp01((item.value || 0) / safeMax);
        const fullW = CONTENT_W * ratio;
        const barW = Math.max(barH, fullW * rowDraw);  // min width keeps the pill shape intact
        const barY = top + row.labelH + labelToBar;
        const valueText = item.displayValue || (item.value ? String(item.value) : '');

        return (
          <g key={idx} opacity={entered} transform={`translate(0 ${slideY})`}>
            <MultiLineText
              text={item.label} x={SIDE_MARGIN} y={top + 20} color={ink} font={bodyFont}
              size={24} weight={700} anchor="start" maxWidth={labelW} maxLines={2}
            />
            <text
              x={VB_W - SIDE_MARGIN} y={top + 22} textAnchor="end" fill={accent}
              fontFamily={headingFont} fontSize={30} fontWeight={900}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {valueText}
            </text>

            <rect x={SIDE_MARGIN} y={barY} width={CONTENT_W} height={barH} rx={barH / 2} fill={hairline} />
            <rect x={SIDE_MARGIN} y={barY} width={barW} height={barH} rx={barH / 2} fill={`url(#${id}-bar-${idx})`} />
            {/* Leading-edge dot gives the bar a polished "cap" while it draws */}
            <circle cx={SIDE_MARGIN + barW - barH / 2} cy={barY + barH / 2} r={5} fill="#fff" fillOpacity={0.9 * rowDraw} />
          </g>
        );
      })}
    </g>
  );
}

// ── Comparison (two cards + VS) ────────────────────────────────

export function ComparisonCards({
  items, draw, localFrame, fps, ink, hairline, surface, headingFont, bodyFont, colors = [ORANGE, EMERALD],
}: {
  items: FacelessGraphicItem[]; draw: number; localFrame: number; fps: number;
  ink: string; hairline: string; surface: string; headingFont: string; bodyFont: string;
  colors?: [string, string] | string[];
}) {
  const pair = [items[0] ?? { label: 'Option A' }, items[1] ?? { label: 'Option B' }];
  const gapBetween = 24;
  const cardW = (CONTENT_W - gapBetween) / 2; // 198
  const cardH = 340;
  const cardY = SAFE_CENTER_Y - cardH / 2;
  const innerW = cardW - 28;

  return (
    <g>
      {pair.map((item, idx) => {
        const x = SIDE_MARGIN + idx * (cardW + gapBetween);
        const cx = x + cardW / 2;
        const color = colors[idx % colors.length];
        const entered = spring({ frame: Math.max(0, localFrame - idx * 8), fps, config: SPRING_CONFIG });
        const slideY = interpolate(entered, [0, 1], [40, 0]);
        const iconPop = interpolate(entered, [0, 1], [0.7, 1], { extrapolateRight: 'clamp' });
        const iconCy = cardY + 92;

        return (
          <g key={idx} opacity={entered} transform={`translate(0 ${slideY})`}>
            {/* Soft drop shadow (offset rect, no filter = cheaper to render) */}
            <rect x={x} y={cardY + 6} width={cardW} height={cardH} rx={24} fill="#000" fillOpacity={0.12} />
            <rect x={x} y={cardY} width={cardW} height={cardH} rx={24} fill={surface} stroke={hairline} strokeWidth={2} />
            <rect x={x + 20} y={cardY} width={cardW - 40} height={6} rx={3} fill={color} />

            <g transform={`translate(${cx} ${iconCy}) scale(${iconPop}) translate(${-cx} ${-iconCy})`}>
              <circle cx={cx} cy={iconCy} r={50} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={3} />
              <path
                d={idx === 0
                  ? `M ${cx - 20} ${iconCy} h 40 M ${cx} ${iconCy - 20} v 40`
                  : `M ${cx - 18} ${iconCy} l 14 14 24 -28`}
                stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
            </g>

            <MultiLineText
              text={item.label} x={cx} y={cardY + 190} color={ink} font={headingFont}
              size={22} weight={900} maxWidth={innerW} maxLines={3}
            />

            {item.displayValue && (
              <>
                <line x1={x + 28} x2={x + cardW - 28} y1={cardY + cardH - 82} y2={cardY + cardH - 82} stroke={hairline} strokeWidth={2} />
                <text
                  x={cx} y={cardY + cardH - 34} textAnchor="middle" fill={color}
                  fontFamily={headingFont} fontSize={item.displayValue.length > 7 ? 28 : 36} fontWeight={900}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {item.displayValue}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* VS badge — pops in after the cards land */}
      <g
        opacity={draw}
        transform={`translate(270 ${cardY + cardH / 2}) scale(${interpolate(draw, [0, 1], [0.6, 1], { extrapolateRight: 'clamp' })}) translate(-270 ${-(cardY + cardH / 2)})`}
      >
        <circle cx={270} cy={cardY + cardH / 2} r={27} fill={ink} stroke={surface} strokeWidth={5} />
        <text
          x={270} y={cardY + cardH / 2 + 6} textAnchor="middle" fill={surface}
          fontFamily={headingFont} fontWeight={900} fontSize={17}
        >
          VS
        </text>
      </g>
    </g>
  );
}

function SequenceTimeline({ items, draw, localFrame, fps, ink, muted, headingFont, bodyFont, id }: {
  items: FacelessGraphicItem[]; draw: number; localFrame: number; fps: number;
  ink: string; muted: string; headingFont: string; bodyFont: string; id: string;
}) {
  // Vertical timeline for 9:16 — nodes stacked top-to-bottom
  const nodeCount = items.length;
  const topY = 320;
  const spacing = nodeCount > 1 ? Math.min(148, (580 / (nodeCount - 1))) : 148;
  const nodeX = 270;
  const lineX = nodeX;

  return (
    <g>
      {/* Vertical connector line */}
      <line
        x1={lineX} y1={topY + 24}
        x2={lineX} y2={topY + (nodeCount - 1) * spacing - 24}
        stroke={`url(#seq-${id})`} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={600} strokeDashoffset={600 * (1 - draw)}
      />
      {items.map((item, idx) => {
        const cy = topY + idx * spacing;
        const entered = spring({ frame: Math.max(0, localFrame - idx * 6), fps, config: { damping: 18, mass: 0.75, stiffness: 115 } });
        const accent = DEFAULT_ACCENTS[idx % DEFAULT_ACCENTS.length];
        const isLeft = idx % 2 === 0;
        return (
          <g key={idx} opacity={entered}>
            {/* Step label */}
            <text x={nodeX} y={cy - 38} textAnchor="middle" fill={muted} fontFamily={bodyFont} fontSize={16} fontWeight={800}>
              STEP {idx + 1}
            </text>
            {/* Node circle */}
            <circle cx={nodeX} cy={cy} r={30} fill="none" stroke={accent} strokeWidth={5} />
            <circle cx={nodeX} cy={cy} r={10} fill={accent} />
            {/* Card bubble */}
            <rect
              x={isLeft ? 50 : nodeX + 42}
              y={cy - 34}
              width={nodeX - 52 - 50}
              height={68}
              rx={14}
              fill={accent}
              fillOpacity={0.10}
              stroke={accent}
              strokeWidth={1.5}
            />
            <MultiLineText
              text={item.label}
              x={isLeft ? (50 + (nodeX - 52 - 50) / 2) : (nodeX + 42 + (nodeX - 52 - 50) / 2)}
              y={cy - 8}
              color={accent}
              font={bodyFont}
              size={19}
              weight={700}
            />
          </g>
        );
      })}
    </g>
  );
}

function MetricRadial({ item, draw, localFrame, fps, ink, muted, headingFont, bodyFont, id }: {
  item: FacelessGraphicItem; draw: number; localFrame: number; fps: number;
  ink: string; muted: string; headingFont: string; bodyFont: string; id: string;
}) {
  const cx = 270, cy = 510, r = 160;
  const circumference = 2 * Math.PI * r;
  const arcFraction = 0.75; // 270° arc
  return (
    <g>
      {/* Background track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={28}
        strokeDasharray={`${circumference * arcFraction} ${circumference * (1 - arcFraction)}`}
        strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
      {/* Animated fill */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#metric-${id})`} strokeWidth={28}
        strokeDasharray={`${circumference * arcFraction * draw} ${circumference}`}
        strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
      {/* Value */}
      <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle"
        fill={ink} fontFamily={headingFont} fontSize={86} fontWeight={950}>
        {item.displayValue || ''}
      </text>
      {/* Label below */}
      <MultiLineText text={item.label} x={cx} y={cy + 82} color={muted} font={bodyFont} size={26} weight={700} />
    </g>
  );
}

function GrowthLineChart({ items, draw, localFrame, fps, ink, muted, hairline, headingFont, bodyFont, id }: {
  items: FacelessGraphicItem[]; draw: number; localFrame: number; fps: number;
  ink: string; muted: string; hairline: string; headingFont: string; bodyFont: string; id: string;
}) {
  const points = items.filter((item) => typeof item.value === 'number');
  if (points.length < 2) return null;
  const minVal = Math.min(...points.map((p) => p.value || 0));
  const maxVal = Math.max(...points.map((p) => p.value || 1));
  const range = Math.max(1, maxVal - minVal);
  const left = 70, right = 470, top = 330, bottom = 640;
  const coords = points.map((p, i) => ({
    item: p,
    x: left + ((right - left) * i) / Math.max(1, points.length - 1),
    y: bottom - (((p.value || 0) - minVal) / range) * (bottom - top),
  }));
  const pathD = coords.map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`)).join(' ');
  const areaD = `${pathD} L ${right} ${bottom} L ${left} ${bottom} Z`;
  const stagger = Math.max(3, Math.floor(16 / Math.max(2, points.length)));
  return (
    <g>
      {/* Grid lines */}
      {[0, 1, 2, 3].map((idx) => {
        const y = top + ((bottom - top) * idx) / 3;
        return <line key={idx} x1={left} y1={y} x2={right} y2={y} stroke={hairline} strokeWidth={1.5} strokeDasharray="4 8" />;
      })}
      {/* Area fill */}
      <path d={areaD} fill={`url(#growth-area-${id})`} opacity={0.18 * draw} />
      {/* Line */}
      <path
        d={pathD} fill="none" stroke={`url(#growth-${id})`}
        strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - draw)}
      />
      {/* Axis */}
      <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={muted} strokeWidth={2.5} />
      {/* Data points */}
      {coords.map(({ item, x, y }, idx) => {
        const entered = spring({ frame: Math.max(0, localFrame - 12 - idx * stagger), fps, config: { damping: 18, mass: 0.7, stiffness: 120 } });
        const accent = DEFAULT_ACCENTS[idx % DEFAULT_ACCENTS.length];
        return (
          <g key={idx} opacity={entered} transform={`translate(0 ${interpolate(entered, [0, 1], [20, 0])})`}>
            <circle cx={x} cy={y} r={14} fill="none" stroke={accent} strokeWidth={6} />
            <circle cx={x} cy={y} r={5} fill={accent} />
            <text x={x} y={y - 22} textAnchor="middle" fill={ink} fontFamily={headingFont} fontSize={22} fontWeight={900}>
              {item.displayValue}
            </text>
            <text x={x} y={bottom + 36} textAnchor="middle" fill={muted} fontFamily={bodyFont} fontSize={20} fontWeight={700}>
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function ConceptOrbit({ items, draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, title }: {
  items: FacelessGraphicItem[]; draw: number; localFrame: number; fps: number;
  ink: string; muted: string; hairline: string; surface: string; headingFont: string; bodyFont: string; title: string;
}) {
  // Radial orbit layout — central concept + surrounding satellite ideas
  const cx = 270, cy = 540;
  const rx = 190, ry = 190;
  return (
    <g>
      {/* Orbit ellipse */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={hairline} strokeWidth={1.5} strokeDasharray="5 10" opacity={draw} />
      {/* Satellite bubbles */}
      {items.map((item, idx) => {
        const angle = (-Math.PI / 2) + ((Math.PI * 2 * idx) / Math.max(1, items.length));
        const nx = cx + Math.cos(angle) * rx;
        const ny = cy + Math.sin(angle) * ry;
        const entered = spring({ frame: Math.max(0, localFrame - idx * 5), fps, config: { damping: 18, mass: 0.75, stiffness: 115 } });
        const accent = DEFAULT_ACCENTS[idx % DEFAULT_ACCENTS.length];
        return (
          <g key={idx} opacity={entered}>
            <circle cx={nx} cy={ny} r={58} fill={surface} stroke={accent} strokeWidth={3} />
            <circle cx={nx} cy={ny} r={50} fill={accent} fillOpacity={0.08} />
            <MultiLineText text={item.label} x={nx} y={ny - 6} color={ink} font={bodyFont} size={17} weight={700} />
          </g>
        );
      })}
      {/* Central hub */}
      <circle cx={cx} cy={cy} r={72} fill={ink} />
      <MultiLineText text={title} x={cx} y={cy - 8} color={surface} font={headingFont} size={20} weight={900} />
    </g>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function FacelessGraphicScene({
  scene,
  headingFont = 'Montserrat, Inter, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = sceneFrame ?? frame;

  const reveal = spring({ frame: localFrame, fps, config: { damping: 18, mass: 0.8, stiffness: 115 } });
  const draw   = interpolate(localFrame, [0, 22], [0, 1], { extrapolateRight: 'clamp' });

  const plan  = scene.graphicPlan;
  const kind  = plan?.kind || 'concept';
  const items = (plan?.items?.length ? plan.items : [{ label: scene.heading || 'Key idea' }]).slice(0, 5);
  const title = plan?.title || scene.heading || 'Key insight';

  const isDark  = palette?.isDark ?? true;
  const ink     = isDark ? '#F8FAFC' : '#0F172A';
  const muted   = isDark ? '#94A3B8' : '#64748B';
  const hairline = isDark ? 'rgba(226,232,240,.15)' : 'rgba(15,23,42,.12)';
  const surface  = isDark ? '#1A2235' : '#F1F5F9';

  const maxValue = Math.max(1, ...items.filter((i) => typeof i.value === 'number').map((i) => i.value || 0));

  const kindLabel: Record<string, string> = {
    allocation:  'MONEY BREAKDOWN',
    comparison:  'SIDE BY SIDE',
    sequence:    'HOW IT WORKS',
    metric:      'KEY NUMBER',
    growth:      'GROWTH OVER TIME',
    concept:     'VISUAL EXPLANATION',
  };

  const id = `fg-${scene.sceneNumber}`;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: reveal }}>
      {/*
       * 9:16 SVG Canvas — viewBox "0 0 540 960" maps natively to 1080×1920.
       * All graphic elements use vertical-first layout (no widescreen coordinates).
       */}
      <svg
        viewBox="0 0 540 960"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        role="img"
        aria-label={title}
      >
        <defs>
          <linearGradient id={`${id}-warm`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={ORANGE} />
            <stop offset="1" stopColor={AMBER} />
          </linearGradient>
          <linearGradient id={`${id}-cool`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ORANGE} />
            <stop offset="1" stopColor={EMERALD} />
          </linearGradient>
          {/* Sequence gradient */}
          <linearGradient id={`seq-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ORANGE} />
            <stop offset="1" stopColor={VIOLET} />
          </linearGradient>
          {/* Metric radial gradient */}
          <linearGradient id={`metric-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={ORANGE} />
            <stop offset="1" stopColor={AMBER} />
          </linearGradient>
          {/* Growth chart gradient + area */}
          <linearGradient id={`growth-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={ORANGE} />
            <stop offset="1" stopColor={EMERALD} />
          </linearGradient>
          <linearGradient id={`growth-area-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ORANGE} stopOpacity={0.5} />
            <stop offset="1" stopColor={ORANGE} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* ── Header Block (top of phone) ── */}
        <g opacity={reveal}>
          {/* Kind badge pill */}
          <rect x={140} y={52} width={260} height={36} rx={18} fill={ORANGE} fillOpacity={0.14} stroke={ORANGE} strokeWidth={1.5} strokeOpacity={0.5} />
          <text x={270} y={76} textAnchor="middle" fill={ORANGE}
            fontFamily={bodyFont} fontSize={14} fontWeight={800} letterSpacing="0.1em">
            {kindLabel[kind] || 'VISUAL EXPLANATION'}
          </text>

          {/* Main heading */}
          <text x={270} y={146} textAnchor="middle" fill={ink}
            fontFamily={headingFont} fontSize={44} fontWeight={900} letterSpacing="-0.02em">
            {wrapLabel(title, charsThatFit(VB_W - SIDE_MARGIN * 2, 44), 3).map((ln, i) => (
              <tspan key={i} x={270} dy={i === 0 ? 0 : 52}>{ln}</tspan>
            ))}
          </text>

          {/* Supporting text */}
          {scene.supportingText && (
            <text x={270} y={240} textAnchor="middle" fill={muted}
              fontFamily={bodyFont} fontSize={22} fontWeight={600}>
              {wrapLabel(scene.supportingText, charsThatFit(VB_W - SIDE_MARGIN * 2, 22), 3).map((ln, i) => (
                <tspan key={i} x={270} dy={i === 0 ? 0 : 28}>{ln}</tspan>
              ))}
            </text>
          )}
        </g>

        {/* ── Graphic Body (lower 65% of phone) ── */}

        {kind === 'allocation' && (
          <AllocationChart
            items={items} maxValue={maxValue} draw={draw}
            localFrame={localFrame} fps={fps}
            ink={ink} muted={muted} hairline={hairline}
            headingFont={headingFont} bodyFont={bodyFont} id={id}
          />
        )}

        {kind === 'comparison' && (
          <ComparisonCards
            items={items} draw={draw}
            localFrame={localFrame} fps={fps}
            ink={ink} muted={muted} hairline={hairline} surface={surface}
            headingFont={headingFont} bodyFont={bodyFont}
          />
        )}

        {kind === 'sequence' && (
          <SequenceTimeline
            items={items} draw={draw}
            localFrame={localFrame} fps={fps}
            ink={ink} muted={muted}
            headingFont={headingFont} bodyFont={bodyFont} id={id}
          />
        )}

        {kind === 'metric' && items[0] && (
          <MetricRadial
            item={items[0]} draw={draw}
            localFrame={localFrame} fps={fps}
            ink={ink} muted={muted}
            headingFont={headingFont} bodyFont={bodyFont} id={id}
          />
        )}

        {kind === 'growth' && (
          <GrowthLineChart
            items={items} draw={draw}
            localFrame={localFrame} fps={fps}
            ink={ink} muted={muted} hairline={hairline}
            headingFont={headingFont} bodyFont={bodyFont} id={id}
          />
        )}

        {kind === 'concept' && (
          <ConceptOrbit
            items={items} draw={draw}
            localFrame={localFrame} fps={fps}
            ink={ink} muted={muted} hairline={hairline} surface={surface}
            headingFont={headingFont} bodyFont={bodyFont} title={title}
          />
        )}

        {/* ── Bottom separator ── */}
        <line x1={60} y1={900} x2={480} y2={900} stroke={hairline} strokeWidth={1.5} opacity={draw} />
      </svg>
    </div>
  );
}
