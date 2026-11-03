import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface SVGFullBleedSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

// ── Palette constants ──────────────────────────────────────────
const ORANGE  = '#FF5722';
const AMBER   = '#FFA000';
const EMERALD = '#10B981';
const VIOLET  = '#8B5CF6';
const SKY     = '#38BDF8';
const ROSE    = '#F43F5E';
const INDIGO  = '#6366F1';

const ACCENT_RING = [ORANGE, EMERALD, VIOLET, SKY, AMBER, ROSE, INDIGO];

// ── Text Wrapping Helpers ────────────────────────────────────────
function linesFor(text: string, charsPerLine = 20): string[] {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line && (line + ' ' + w).length > charsPerLine) { lines.push(line); line = w; }
    else { line = line ? line + ' ' + w : w; }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function WrappedText({ text, x, y, fill, font, size, weight = 700, anchor = 'middle', lineH = 1.25 }: {
  text: string; x: number; y: number; fill: string; font: string;
  size: number; weight?: number; anchor?: 'start' | 'middle' | 'end'; lineH?: number;
}) {
  const lines = linesFor(text, anchor === 'middle' ? 20 : 24);
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontFamily={font} fontSize={size} fontWeight={weight}>
      {lines.map((ln, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : size * lineH}>{ln}</tspan>)}
    </text>
  );
}

type DrawProps = {
  draw: number;
  localFrame: number;
  fps: number;
  ink: string;
  muted: string;
  hairline: string;
  surface: string;
  headingFont: string;
  bodyFont: string;
  id: string;
  scene: SceneBlueprintItem;
};

// ─────────────────────────────────────────────────────────────
// 1. Flowchart / Process Arrow (Workflow, Pipeline, Stages)
// ─────────────────────────────────────────────────────────────
function FlowchartDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const words = (scene.highlightedWords && scene.highlightedWords.length >= 3)
    ? scene.highlightedWords.slice(0, 3)
    : (scene.listItems && scene.listItems.length >= 3)
      ? scene.listItems.slice(0, 3)
      : ['INPUT / TRIGGER', 'SMART PROCESS', 'FINAL OUTCOME'];

  const nodes = [
    { label: words[0].toUpperCase(), x: 270, y: 90 },
    { label: words[1].toUpperCase(), x: 270, y: 250 },
    { label: words[2].toUpperCase(), x: 270, y: 410 },
  ];

  return (
    <g>
      {nodes.map((node, idx) => {
        const entered = spring({ frame: Math.max(0, localFrame - idx * 8), fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
        const accent = ACCENT_RING[idx % ACCENT_RING.length];
        const rectW = 320, rectH = 84, rx = 20;
        const x0 = node.x - rectW / 2;
        const y0 = node.y - rectH / 2;
        return (
          <g key={idx} opacity={entered} transform={`translate(0 ${interpolate(entered, [0, 1], [24, 0])})`}>
            {/* Soft Ambient Shadow */}
            <rect x={x0 + 4} y={y0 + 8} width={rectW} height={rectH} rx={rx} fill={accent} opacity={0.16} />
            {/* Main Card */}
            <rect x={x0} y={y0} width={rectW} height={rectH} rx={rx} fill={surface} stroke={accent} strokeWidth={3} />
            {/* Step Number Tag */}
            <rect x={x0 + 16} y={y0 + 20} width={44} height={44} rx={12} fill={accent} />
            <text x={x0 + 38} y={y0 + 49} textAnchor="middle" fill="#FFFFFF" fontFamily={headingFont} fontSize={22} fontWeight={900}>
              {idx + 1}
            </text>
            {/* Step Label */}
            <text x={x0 + 74} y={y0 + 50} fill={ink} fontFamily={headingFont} fontSize={20} fontWeight={800}>
              {node.label.slice(0, 18)}
            </text>
          </g>
        );
      })}
      {/* Dynamic Animated Downward Connectors */}
      {nodes.slice(0, -1).map((node, idx) => {
        const arrowY0 = node.y + 42;
        const arrowY1 = nodes[idx + 1].y - 42;
        const dashLen = arrowY1 - arrowY0;
        const accent = ACCENT_RING[(idx + 1) % ACCENT_RING.length];
        return (
          <g key={`arrow-${idx}`}>
            <line
              x1={node.x} y1={arrowY0} x2={node.x} y2={arrowY1}
              stroke={accent} strokeWidth={4.5} strokeLinecap="round"
              strokeDasharray={dashLen} strokeDashoffset={dashLen * (1 - draw)}
            />
            <polygon
              points={`${node.x - 11},${arrowY1 - 16} ${node.x + 11},${arrowY1 - 16} ${node.x},${arrowY1}`}
              fill={accent}
              opacity={draw}
            />
          </g>
        );
      })}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Comparison / Versus Split (Before vs After, Pros vs Cons)
// ─────────────────────────────────────────────────────────────
function BeforeAfterDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const left = scene.narrationSegment?.text?.split(/versus|vs\.?|before|instead of|compared to/i)[0]?.trim() || 'OLD WAY';
  const right = scene.narrationSegment?.text?.split(/versus|vs\.?|after|instead of|compared to/i)[1]?.trim() || 'NEW WAY';
  const leftLabel = left.split(/\s+/).slice(0, 3).join(' ').toUpperCase();
  const rightLabel = right.split(/\s+/).slice(0, 3).join(' ').toUpperCase();

  const leftEntered = spring({ frame: localFrame, fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
  const rightEntered = spring({ frame: Math.max(0, localFrame - 8), fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });

  return (
    <g>
      {/* Left card (Negative / Outdated) */}
      <g opacity={leftEntered} transform={`translate(${interpolate(leftEntered, [0, 1], [-30, 0])} 0)`}>
        <rect x={30} y={60} width={220} height={420} rx={24} fill={surface} stroke="#EF4444" strokeWidth={3} />
        <rect x={30} y={60} width={220} height={10} rx={5} fill="#EF4444" />
        <circle cx={140} cy={160} r={44} fill="#EF4444" fillOpacity={0.12} stroke="#EF4444" strokeWidth={2} />
        <text x={140} y={178} textAnchor="middle" fill="#EF4444" fontFamily={headingFont} fontSize={54} fontWeight={900}>✗</text>
        <text x={140} y={250} textAnchor="middle" fill="#EF4444" fontFamily={headingFont} fontSize={18} fontWeight={900} letterSpacing="0.08em">PROBLEM</text>
        <WrappedText text={leftLabel} x={140} y={310} fill={ink} font={headingFont} size={22} weight={900} />
      </g>

      {/* VS central badge with pulse */}
      <g opacity={draw}>
        <circle cx={270} cy={270} r={36} fill={ink} />
        <circle cx={270} cy={270} r={32} fill={surface} />
        <text x={270} y={278} textAnchor="middle" fill={ink} fontFamily={headingFont} fontWeight={950} fontSize={20}>VS</text>
      </g>

      {/* Right card (Positive / Solved) */}
      <g opacity={rightEntered} transform={`translate(${interpolate(rightEntered, [0, 1], [30, 0])} 0)`}>
        <rect x={290} y={60} width={220} height={420} rx={24} fill={surface} stroke={EMERALD} strokeWidth={3} />
        <rect x={290} y={60} width={220} height={10} rx={5} fill={EMERALD} />
        <circle cx={400} cy={160} r={44} fill={EMERALD} fillOpacity={0.12} stroke={EMERALD} strokeWidth={2} />
        <text x={400} y={178} textAnchor="middle" fill={EMERALD} fontFamily={headingFont} fontSize={54} fontWeight={900}>✓</text>
        <text x={400} y={250} textAnchor="middle" fill={EMERALD} fontFamily={headingFont} fontSize={18} fontWeight={900} letterSpacing="0.08em">SOLUTION</text>
        <WrappedText text={rightLabel} x={400} y={310} fill={ink} font={headingFont} size={22} weight={900} />
      </g>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Radial Mind Map (Core Idea + Connected Satellite Nodes)
// ─────────────────────────────────────────────────────────────
function MindMap({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const keywords = (scene.highlightedWords || []).slice(0, 5);
  const fallback = ['CONCEPT', 'INSIGHT', 'ACTION', 'IMPACT', 'GROWTH'];
  const nodes = (keywords.length >= 3 ? keywords : fallback).slice(0, 5);
  const cx = 270, cy = 270;

  return (
    <g>
      {/* Animated Connector Spokes */}
      {nodes.map((_, idx) => {
        const angle = (-Math.PI / 2) + ((Math.PI * 2 * idx) / nodes.length);
        const r = 165;
        const nx = cx + Math.cos(angle) * r;
        const ny = cy + Math.sin(angle) * r;
        const entered = spring({ frame: Math.max(0, localFrame - idx * 4), fps, config: { damping: 18, mass: 0.7, stiffness: 115 } });
        return (
          <line
            key={`spoke-${idx}`} x1={cx} y1={cy} x2={nx} y2={ny}
            stroke={ACCENT_RING[idx % ACCENT_RING.length]} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={165} strokeDashoffset={165 * (1 - entered)}
            opacity={0.6}
          />
        );
      })}

      {/* Satellite Nodes */}
      {nodes.map((label, idx) => {
        const angle = (-Math.PI / 2) + ((Math.PI * 2 * idx) / nodes.length);
        const r = 165;
        const nx = cx + Math.cos(angle) * r;
        const ny = cy + Math.sin(angle) * r;
        const entered = spring({ frame: Math.max(0, localFrame - idx * 5), fps, config: { damping: 18, mass: 0.75, stiffness: 115 } });
        const accent = ACCENT_RING[idx % ACCENT_RING.length];
        return (
          <g key={idx} opacity={entered} transform={`scale(${entered})`} style={{ transformOrigin: `${nx}px ${ny}px` }}>
            <circle cx={nx} cy={ny} r={52} fill={surface} stroke={accent} strokeWidth={3} />
            <circle cx={nx} cy={ny} r={44} fill={accent} fillOpacity={0.10} />
            <WrappedText text={label.toUpperCase()} x={nx} y={ny - 6} fill={accent} font={bodyFont} size={15} weight={800} />
          </g>
        );
      })}

      {/* Central Hub */}
      <circle cx={cx} cy={cy} r={72} fill={ORANGE} />
      <circle cx={cx} cy={cy} r={62} fill={ORANGE} fillOpacity={0.2} stroke="#FFFFFF" strokeWidth={2.5} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#FFFFFF" fontFamily={headingFont} fontSize={19} fontWeight={950}>CORE</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fill="#FFFFFF" fontFamily={headingFont} fontSize={19} fontWeight={950}>FOCUS</text>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Funnel Diagram (Conversion, Sales, Filtration)
// ─────────────────────────────────────────────────────────────
function FunnelDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id }: DrawProps) {
  const levels = [
    { label: 'TOP OF FUNNEL: AWARENESS', width: 460, color: ORANGE },
    { label: 'CONSIDERATION: INTEREST',  width: 360, color: AMBER },
    { label: 'CONVERSION: DECISION',     width: 260, color: EMERALD },
    { label: 'ADVOCACY: ACTION',        width: 160, color: VIOLET },
  ];
  const sliceH = 84;
  const startY = 40;

  return (
    <g>
      {levels.map((level, idx) => {
        const entered = spring({ frame: Math.max(0, localFrame - idx * 6), fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
        const x = (540 - level.width) / 2;
        const y = startY + idx * (sliceH + 12);
        return (
          <g key={idx} opacity={entered} transform={`scale(${entered})`} style={{ transformOrigin: `270px ${y + sliceH / 2}px` }}>
            <rect x={x} y={y} width={level.width * draw} height={sliceH} rx={14}
              fill={level.color} fillOpacity={0.9} />
            <text x={270} y={y + sliceH / 2 + 8} textAnchor="middle"
              fill="#FFFFFF" fontFamily={headingFont} fontSize={21} fontWeight={900}>
              {level.label}
            </text>
          </g>
        );
      })}
      {/* Downward Energy Arrow */}
      <g opacity={draw}>
        <line x1={270} y1={startY + levels.length * (sliceH + 12) - 2} x2={270} y2={startY + levels.length * (sliceH + 12) + 40}
          stroke={VIOLET} strokeWidth={6} strokeLinecap="round" />
        <polygon
          points={`${270 - 14},${startY + levels.length * (sliceH + 12) + 30} ${270 + 14},${startY + levels.length * (sliceH + 12) + 30} ${270},${startY + levels.length * (sliceH + 12) + 50}`}
          fill={VIOLET}
        />
      </g>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Circular Feedback Loop (Continuous Cycle, Agile, Iterate)
// ─────────────────────────────────────────────────────────────
function CircularLoop({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const steps = (scene.listItems || ['PLAN', 'EXECUTE', 'MEASURE', 'SCALE']).slice(0, 4);
  const cx = 270, cy = 270, r = 160;

  return (
    <g>
      {/* Dashed Orbital Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={hairline} strokeWidth={3}
        strokeDasharray={`${2 * Math.PI * r * draw} 9999`} strokeLinecap="round" />

      {steps.map((step, idx) => {
        const angle = (-Math.PI / 2) + ((Math.PI * 2 * idx) / steps.length);
        const nx = cx + Math.cos(angle) * r;
        const ny = cy + Math.sin(angle) * r;
        const entered = spring({ frame: Math.max(0, localFrame - idx * 7), fps, config: { damping: 16, mass: 0.8, stiffness: 115 } });
        const accent = ACCENT_RING[idx % ACCENT_RING.length];

        return (
          <g key={idx} opacity={entered}>
            <circle cx={nx} cy={ny} r={50} fill={surface} stroke={accent} strokeWidth={3.5} />
            <circle cx={nx} cy={ny} r={42} fill={accent} fillOpacity={0.12} />
            <WrappedText text={step.toUpperCase()} x={nx} y={ny - 5} fill={accent} font={bodyFont} size={15} weight={800} />
          </g>
        );
      })}

      {/* Central Rotating Badge */}
      <circle cx={cx} cy={cy} r={60} fill={ORANGE} fillOpacity={0.15} stroke={ORANGE} strokeWidth={2.5} opacity={draw} />
      <text x={cx} y={cy + 8} textAnchor="middle" fill={ORANGE} fontFamily={headingFont} fontSize={20} fontWeight={950} opacity={draw}>CYCLE</text>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. Vertical Milestone Timeline (Milestones, Roadmaps, History)
// ─────────────────────────────────────────────────────────────
function VerticalTimelineDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const milestones = (scene.listItems && scene.listItems.length >= 3)
    ? scene.listItems.slice(0, 4)
    : ['FOUNDATION PHASE', 'STRATEGY EXECUTION', 'RAPID SCALING', 'MARKET DOMINANCE'];

  const startY = 60;
  const gapY = 110;

  return (
    <g>
      {/* Vertical Spine Line */}
      <line
        x1={90} y1={startY} x2={90} y2={startY + (milestones.length - 1) * gapY}
        stroke={ORANGE} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={380} strokeDashoffset={380 * (1 - draw)}
      />

      {milestones.map((m, idx) => {
        const y = startY + idx * gapY;
        const entered = spring({ frame: Math.max(0, localFrame - idx * 8), fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
        const accent = ACCENT_RING[idx % ACCENT_RING.length];

        return (
          <g key={idx} opacity={entered} transform={`translate(${interpolate(entered, [0, 1], [30, 0])} 0)`}>
            {/* Glowing Milestone Checkpoint Node */}
            <circle cx={90} cy={y} r={22} fill={surface} stroke={accent} strokeWidth={4} />
            <circle cx={90} cy={y} r={10} fill={accent} />

            {/* Information Card Banner */}
            <rect x={130} y={y - 36} width={370} height={72} rx={18} fill={surface} stroke={accent} strokeWidth={2} />
            <rect x={130} y={y - 36} width={8} height={72} rx={4} fill={accent} />
            <text x={155} y={y - 8} fill={muted} fontFamily={headingFont} fontSize={14} fontWeight={800} letterSpacing="0.08em">
              PHASE 0{idx + 1}
            </text>
            <text x={155} y={y + 18} fill={ink} fontFamily={headingFont} fontSize={20} fontWeight={900}>
              {m.slice(0, 22).toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. Hierarchy Pyramid Diagram (Priority, Framework, Layers)
// ─────────────────────────────────────────────────────────────
function PyramidHierarchyDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id }: DrawProps) {
  const layers = [
    { label: 'TOP: ULTIMATE GOAL', width: 220, color: ROSE },
    { label: 'MID: EXECUTION & HABITS', width: 340, color: VIOLET },
    { label: 'BASE: CORE FOUNDATION', width: 460, color: SKY },
  ];
  const layerH = 95;
  const startY = 80;

  return (
    <g>
      {layers.map((layer, idx) => {
        const entered = spring({ frame: Math.max(0, localFrame - idx * 7), fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
        const x = (540 - layer.width) / 2;
        const y = startY + idx * (layerH + 14);

        return (
          <g key={idx} opacity={entered}>
            <rect x={x} y={y} width={layer.width * draw} height={layerH} rx={16} fill={layer.color} fillOpacity={0.92} />
            <text x={270} y={y + layerH / 2 + 8} textAnchor="middle" fill="#FFFFFF" fontFamily={headingFont} fontSize={22} fontWeight={950}>
              {layer.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. Token Grid Diagram (Reference 3: Insider Force Style)
// Floating 3D token badges with ambient circular orbit tracks
// ─────────────────────────────────────────────────────────────
function TokenGridDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const tools = (scene.highlightedWords && scene.highlightedWords.length >= 3)
    ? scene.highlightedWords.slice(0, 5)
    : (scene.listItems && scene.listItems.length >= 3)
      ? scene.listItems.slice(0, 5)
      : ['AI MODEL', 'CLOUD DB', 'AUTOMATION', 'WORKFLOW', 'GROWTH'];

  // 2 rows: Row 1 has 2 tokens (centered), Row 2 has 3 tokens (centered)
  const tokenCoords = [
    { x: 190, y: 130 },
    { x: 350, y: 130 },
    { x: 110, y: 280 },
    { x: 270, y: 280 },
    { x: 430, y: 280 },
  ];

  return (
    <g>
      {/* Ambient background orbital rings */}
      <circle cx={270} cy={200} r={220} fill="none" stroke={hairline} strokeWidth={2} strokeDasharray="6 12" opacity={0.6} />
      <circle cx={270} cy={200} r={140} fill="none" stroke={hairline} strokeWidth={1.5} opacity={0.4} />

      {tools.map((name, idx) => {
        const coord = tokenCoords[idx % tokenCoords.length];
        const entered = spring({ frame: Math.max(0, localFrame - idx * 6), fps, config: { damping: 15, mass: 0.7, stiffness: 130 } });
        const accent = ACCENT_RING[idx % ACCENT_RING.length];
        const scaleVal = interpolate(entered, [0, 1], [0.3, 1]);

        return (
          <g key={idx} opacity={entered} transform={`translate(${coord.x} ${coord.y}) scale(${scaleVal})`}>
            {/* 3D Soft Drop Shadow */}
            <circle cx={0} cy={10} r={54} fill="rgba(0,0,0,0.22)" filter="blur(6px)" />
            {/* Outer Badge */}
            <circle cx={0} cy={0} r={54} fill={surface} stroke={accent} strokeWidth={3} />
            {/* Inner Accent Ring */}
            <circle cx={0} cy={0} r={46} fill={accent} fillOpacity={0.10} />
            {/* Token Icon / Symbol */}
            <circle cx={0} cy={-6} r={18} fill={accent} />
            {/* Token Label */}
            <text x={0} y={24} textAnchor="middle" fill={ink} fontFamily={headingFont} fontSize={13} fontWeight={900}>
              {name.slice(0, 10).toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Bottom Summary Pill */}
      <g opacity={draw} transform="translate(270 410)">
        <rect x={-140} y={-24} width={280} height={48} rx={24} fill={ink} />
        <text x={0} y={6} textAnchor="middle" fill={surface} fontFamily={headingFont} fontSize={18} fontWeight={950} letterSpacing="0.06em">
          ALL IN ONE PLACE
        </text>
      </g>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. Notification Stack Diagram (Reference 1: Finqube Style)
// Floating notification cards & query bubbles
// ─────────────────────────────────────────────────────────────
function NotificationStackDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const alerts = [
    { sender: 'Client Inquiry', query: 'How much do I owe you?', time: 'now', icon: '?' },
    { sender: 'Invoice #1042', query: 'Payment confirmed & verified', time: '1m ago', icon: '✓' },
    { sender: 'Financial Ledger', query: 'Updated monthly revenue balance', time: '3m ago', icon: '↗' },
  ];

  return (
    <g>
      {/* Background Floating XLS / Document Mockup Cards */}
      {[
        { x: 80, y: 40, r: -8, color: EMERALD },
        { x: 380, y: 70, r: 12, color: SKY },
        { x: 100, y: 380, r: 6, color: AMBER },
        { x: 390, y: 360, r: -10, color: EMERALD },
      ].map((sheet, sIdx) => (
        <g key={`sheet-${sIdx}`} opacity={draw * 0.75} transform={`translate(${sheet.x} ${sheet.y}) rotate(${sheet.r})`}>
          <rect x={-32} y={-42} width={64} height={84} rx={12} fill={surface} stroke={sheet.color} strokeWidth={2.5} />
          <rect x={-32} y={-42} width={64} height={18} rx={6} fill={sheet.color} />
          <line x1={-18} y1={-10} x2={18} y2={-10} stroke={hairline} strokeWidth={3} strokeLinecap="round" />
          <line x1={-18} y1={6} x2={12} y2={6} stroke={hairline} strokeWidth={3} strokeLinecap="round" />
          <line x1={-18} y1={22} x2={16} y2={22} stroke={hairline} strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}

      {/* Floating Notification Pills (iOS Style) */}
      {alerts.map((al, idx) => {
        const y = 140 + idx * 105;
        const entered = spring({ frame: Math.max(0, localFrame - idx * 8), fps, config: { damping: 16, mass: 0.8, stiffness: 125 } });
        const floatX = interpolate(entered, [0, 1], [idx % 2 === 0 ? -40 : 40, 0]);

        return (
          <g key={idx} opacity={entered} transform={`translate(${floatX} 0)`}>
            {/* Pill Container */}
            <rect x={40} y={y} width={460} height={84} rx={22} fill={surface} stroke={hairline} strokeWidth={1.5} />
            {/* Sender Avatar Bubble */}
            <circle cx={78} cy={y + 42} r={24} fill={EMERALD} />
            <text x={78} y={y + 50} textAnchor="middle" fill="#FFFFFF" fontFamily={headingFont} fontSize={20} fontWeight={900}>
              {al.icon}
            </text>
            {/* Sender Name */}
            <text x={116} y={y + 35} fill={ink} fontFamily={headingFont} fontSize={17} fontWeight={900}>
              {al.sender}
            </text>
            {/* Timestamp */}
            <text x={475} y={y + 35} textAnchor="end" fill={muted} fontFamily={bodyFont} fontSize={13} fontWeight={600}>
              {al.time}
            </text>
            {/* Message Body */}
            <text x={116} y={y + 60} fill={muted} fontFamily={bodyFont} fontSize={15} fontWeight={600}>
              {al.query}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. Slot Progression HUD Diagram (Reference 4: Video-86156 Style)
// 5 progression slots, tilted stamp badge, and bottom counter HUD
// ─────────────────────────────────────────────────────────────
function SlotProgressionHUDDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const slots = (scene.listItems && scene.listItems.length >= 3)
    ? scene.listItems.slice(0, 5)
    : ['STRATEGY BLUEPRINT', 'TOOL AUTOMATION', 'EXECUTION SYSTEM', 'SCALING ENGINE', 'RETENTION LOOP'];

  const slotH = 46;
  const startY = 40;
  const gapY = 56;

  return (
    <g>
      {/* 5 Progression Slots with dashed borders */}
      {slots.map((sText, idx) => {
        const y = startY + idx * gapY;
        const entered = spring({ frame: Math.max(0, localFrame - idx * 6), fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
        const isFilled = localFrame >= (idx + 1) * 8;
        const accent = ACCENT_RING[idx % ACCENT_RING.length];

        return (
          <g key={idx} opacity={entered}>
            {/* Dashed / Solid Slot Container */}
            <rect
              x={35} y={y} width={260} height={slotH} rx={12}
              fill={isFilled ? surface : 'none'}
              stroke={isFilled ? accent : hairline}
              strokeWidth={2}
              strokeDasharray={isFilled ? 'none' : '5 5'}
            />
            {/* Slot Number */}
            <text x={55} y={y + 29} fill={isFilled ? accent : muted} fontFamily={headingFont} fontSize={15} fontWeight={900}>
              0{idx + 1}
            </text>
            {/* Slot Label */}
            <text x={84} y={y + 29} fill={ink} fontFamily={headingFont} fontSize={13} fontWeight={800}>
              {sText.slice(0, 16).toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Big Tilted Rubber Stamp Badge: "FREE" or "PRO" */}
      <g opacity={draw} transform="translate(390 140) rotate(7)">
        <rect x={-75} y={-45} width={150} height={90} rx={18} fill="none" stroke="#2563EB" strokeWidth={5} />
        <rect x={-69} y={-39} width={138} height={78} rx={12} fill="none" stroke="#2563EB" strokeWidth={2} />
        <text x={0} y={15} textAnchor="middle" fill="#2563EB" fontFamily={headingFont} fontSize={38} fontWeight={950} letterSpacing="0.04em">
          FREE
        </text>
      </g>

      {/* Bottom Floating Counter HUD */}
      <g opacity={draw} transform="translate(390 280)">
        <rect x={-80} y={-36} width={160} height={72} rx={18} fill="#0F172A" />
        <text x={-60} y={-14} fill="#94A3B8" fontFamily={headingFont} fontSize={11} fontWeight={800} letterSpacing="0.08em">
          TOTAL COST
        </text>
        <text x={-60} y={18} fill="#FFFFFF" fontFamily={headingFont} fontSize={28} fontWeight={950}>
          ₹0
        </text>
        <text x={40} y={-14} textAnchor="end" fill="#94A3B8" fontFamily={headingFont} fontSize={11} fontWeight={800}>
          SLOTS
        </text>
        <text x={40} y={18} textAnchor="end" fill="#38BDF8" fontFamily={headingFont} fontSize={22} fontWeight={950}>
          5/5
        </text>
      </g>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// 11. Stat Orbit Focus Diagram (Reference 2: Fahis Kalikavu Style)
// Subtle grid paper background, dashed orbit circle, giant glowing stat
// ─────────────────────────────────────────────────────────────
function StatOrbitFocusDiagram({ draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene }: DrawProps) {
  const statVal = scene.statValue || (scene.narrationSegment?.text?.match(/\b\d+([,.]\d+)?\s*(k|m|%|x|times|crore|lakh)?\b/i)?.[0]) || '35,000';
  const statLabel = scene.statLabel || scene.heading || 'KEY METRIC';
  const cx = 270, cy = 160;

  const entered = spring({ frame: localFrame, fps, config: { damping: 14, mass: 0.8, stiffness: 120 } });
  const pulseScale = interpolate(entered, [0, 1], [0.75, 1.0]);

  return (
    <g>
      {/* Subtle Blueprint Grid Lines */}
      {[-120, -60, 0, 60, 120, 180].map((gx, gIdx) => (
        <line key={`vg-${gIdx}`} x1={cx + gx} y1={20} x2={cx + gx} y2={450} stroke={hairline} strokeWidth={1} strokeDasharray="3 6" opacity={0.4} />
      ))}
      {[60, 140, 220, 300, 380].map((gy, gIdx) => (
        <line key={`hg-${gIdx}`} x1={40} y1={gy} x2={500} y2={gy} stroke={hairline} strokeWidth={1} strokeDasharray="3 6" opacity={0.4} />
      ))}

      {/* Dashed Orbit Ring */}
      <circle
        cx={cx} cy={cy} r={95}
        fill="none" stroke={ink} strokeWidth={2.5}
        strokeDasharray="6 8"
        opacity={draw}
      />

      {/* Center Focus Icon / Orb */}
      <g transform={`translate(${cx} ${cy}) scale(${pulseScale})`}>
        <circle cx={0} cy={0} r={65} fill={surface} stroke={ORANGE} strokeWidth={3} />
        <circle cx={0} cy={0} r={55} fill={ORANGE} fillOpacity={0.12} />
        {/* Core Focal Icon */}
        <circle cx={0} cy={-6} r={22} fill={ORANGE} />
        <circle cx={0} cy={-6} r={10} fill="#FFFFFF" />
        <text x={0} y={32} textAnchor="middle" fill={ink} fontFamily={headingFont} fontSize={13} fontWeight={900} letterSpacing="0.08em">
          FOCUS
        </text>
      </g>

      {/* Giant Glowing Stat Number */}
      <g opacity={entered} transform={`translate(270 320)`}>
        <text x={0} y={0} textAnchor="middle" fill={AMBER} fontFamily={headingFont} fontSize={72} fontWeight={950} letterSpacing="-0.03em">
          {statVal}
        </text>
        {/* Subtitle / Takeaway */}
        <text x={0} y={48} textAnchor="middle" fill={ink} fontFamily={headingFont} fontSize={26} fontWeight={800}>
          {statLabel.slice(0, 26)}
        </text>
      </g>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// Dynamic SVG Resolver: Picks best diagram based on narration semantics
// ─────────────────────────────────────────────────────────────
type IllustrationFn = (props: DrawProps) => React.ReactElement | null;

function resolveIllustration(scene: SceneBlueprintItem): IllustrationFn {
  const text = `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`.toLowerCase();

  // Reference 1: Finqube (Client, invoices, emails, notifications, alerts, queries)
  if (/client|invoice|ledger|message|inbox|email|alert|notification|query|question|owe|owing/.test(text)) return NotificationStackDiagram;

  // Reference 3: Insider Force (Tools, apps, models, platforms, stack, resources, software)
  if (/tools?|apps?|platforms?|stack|models?|resources?|software|chatgpt|claude|gemini|deepseek/.test(text)) return TokenGridDiagram;

  // Reference 4: Video-86156 (Setup, checklist, slots, free, cost, budget, tools count, steps count)
  if (/setup|free|cost|budget|checklist|slot|zero|formula|playbook|startup/.test(text)) return SlotProgressionHUDDiagram;

  // Reference 2: Fahis Kalikavu (Decisions, brain, huge statistics, numbers, metric)
  if (/decision|brain|mind|statistic|\b\d+([,.]\d+)?\s*(k|m|%|x|lakh|crore)\b|percent/.test(text)) return StatOrbitFocusDiagram;

  // Standard Narrative Diagrams
  if (/funnel|conversion|sales|marketing|awareness|interest|decision|action/.test(text)) return FunnelDiagram;
  if (/before|after|versus|vs\.|comparison|instead of|old.*new|problem.*solution|contrast/.test(text)) return BeforeAfterDiagram;
  if (/cycle|loop|feedback|repeat|iterate|agile|plan.*do|continuous|habit|routine/.test(text)) return CircularLoop;
  if (/timeline|history|milestone|chronology|year|decade|progression|evolution/.test(text)) return VerticalTimelineDiagram;
  if (/pyramid|hierarchy|priority|level|foundation|maslow|tiers?/.test(text)) return PyramidHierarchyDiagram;
  if (/step|stage|flow|process|pipeline|workflow|automation|input.*output|system/.test(text)) return FlowchartDiagram;

  // Rich Fallback: Mind Map
  return MindMap;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export function SVGFullBleedScene({
  scene,
  headingFont = 'Montserrat, Inter, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: SVGFullBleedSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = sceneFrame ?? frame;

  const reveal = spring({ frame: localFrame, fps, config: { damping: 18, mass: 0.8, stiffness: 115 } });
  const draw   = interpolate(localFrame, [0, 24], [0, 1], { extrapolateRight: 'clamp' });

  const isDark   = palette?.isDark ?? true;
  const ink      = isDark ? '#F8FAFC' : '#0F172A';
  const muted    = isDark ? '#94A3B8' : '#64748B';
  const hairline = isDark ? 'rgba(226,232,240,.14)' : 'rgba(15,23,42,.11)';
  const surface  = isDark ? '#1A2235' : '#F1F5F9';

  const title   = scene.heading || 'VISUAL CONCEPT';
  const id      = `svg-scene-${scene.sceneNumber}`;

  const IllustrationComponent = resolveIllustration(scene);

  const drawProps: DrawProps = {
    draw, localFrame, fps, ink, muted, hairline, surface, headingFont, bodyFont, id, scene,
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: reveal }}>
      {/*
       * Native 9:16 vertical SVG canvas (viewBox="0 0 540 960")
       * Fills 100% of the mobile screen.
       * Header section (y=40-280): Badge + Big Kinetic Headline + Subtext
       * SVG Infographic canvas (y=290-940): High-impact animated vector visuals
       */}
      <svg
        viewBox="0 0 540 960"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        role="img"
        aria-label={title}
      >
        <defs>
          <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={ORANGE} />
            <stop offset="1" stopColor={AMBER} />
          </linearGradient>
          <linearGradient id={`${id}-cool`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={VIOLET} />
            <stop offset="1" stopColor={SKY} />
          </linearGradient>
        </defs>

        {/* ── Top Header Section (y 40–280) ── */}
        <g opacity={reveal}>
          {/* Top Kinetic Pill Accent */}
          <rect x={200} y={44} width={140} height={6} rx={3} fill={`url(#${id}-accent)`} opacity={draw} />

          {/* Main Kinetic Headline */}
          <text x={270} y={105} textAnchor="middle" fill={ink}
            fontFamily={headingFont} fontSize={46} fontWeight={950} letterSpacing="-0.025em">
            {linesFor(title, 16).map((ln, i) => (
              <tspan key={i} x={270} dy={i === 0 ? 0 : 54}>{ln}</tspan>
            ))}
          </text>

          {/* Supporting Takeaway Text */}
          {scene.supportingText && (
            <text x={270} y={215} textAnchor="middle" fill={muted}
              fontFamily={bodyFont} fontSize={22} fontWeight={600}>
              {linesFor(scene.supportingText, 28).map((ln, i) => (
                <tspan key={i} x={270} dy={i === 0 ? 0 : 28}>{ln}</tspan>
              ))}
            </text>
          )}

          {/* Hairline Divider */}
          <line x1={60} y1={280} x2={480} y2={280} stroke={hairline} strokeWidth={1.5} opacity={draw} />
        </g>

        {/* ── Main Dynamic SVG Diagram Canvas (y 290–940) ── */}
        <g transform="translate(0 290)">
          <IllustrationComponent {...drawProps} />
        </g>
      </svg>
    </div>
  );
}
