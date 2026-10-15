import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import { WHITEBOARD_VECTOR_DRAWINGS, resolveVectorDrawing } from '../../../lib/whiteboard/vectorDrawings';
import {
  WB_CANVAS_WIDTH,
  WB_CANVAS_HEIGHT,
  WB_SAFE_LEFT,
  WB_SAFE_RIGHT,
  WB_SAFE_TOP,
  WB_SAFE_BOTTOM,
  WB_USABLE_WIDTH,
  WB_USABLE_HEIGHT,
  WB_MAX_POINTS_PER_BOARD,
  WB_MAX_LINES_PER_POINT,
  WB_MAX_CHARS_PER_LINE,
  WB_TITLE_SIZE,
  WB_CONCLUSION_SIZE,
  WB_POINT_SIZE_BY_COUNT,
  WB_POINT_SIZE_MIN,
  WB_REVEAL_FADE_FRAMES,
  WB_REVEAL_TRANSLATE_Y_START,
  getWhiteboardDimensions,
} from '../../../lib/whiteboard/whiteboardConstants';

// ── Types ─────────────────────────────────────────────────────────────────────

type WhiteboardPoint = {
  text: string;
  title?: string;
  startTime: number;
  endTime: number;
  focusStartTime: number;
  focusEndTime: number;
  markerColor: string;
  bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  isHighlight?: boolean;
  icon?: string;
  iconUrl?: string;
  drawingId?: string;
  boardIndex?: number;
  focusType?: 'circle' | 'underline' | 'box' | 'arrow' | 'highlight';
};

type WhiteboardTableRow = {
  label: string;
  value: string;
  subValue?: string;
  iconUrl?: string;
  startTime: number;
  endTime: number;
};

type WhiteboardQuiz = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  questionStart: number;
  timerStart: number;
  revealStart: number;
};

type WhiteboardVideoProps = {
  mediaSrc?: string;
  mediaType?: 'audio' | 'video';
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  mediaTrimStartSeconds?: number;
  title?: string;
  titleColor?: string;
  layoutType?: 'cards' | 'table' | 'quiz' | 'hook';
  language?: 'ur' | 'hi' | 'en';
  direction?: 'rtl' | 'ltr';
  points?: WhiteboardPoint[];
  tableRows?: WhiteboardTableRow[];
  quiz?: WhiteboardQuiz;
  conclusion?: string;
  conclusionTime?: number;
  boardStyle?: string;
  boardImageUrl?: string;
  aspectRatio?: '9:16';
  enableSfx?: boolean;
};

// ── Whiteboard Marker Fonts & Colors ─────────────────────────────────────────

const { fontFamily: KALAM_FONT } = loadKalam();
const { fontFamily: JAKARTA_FONT } = loadJakarta();
const { fontFamily: INTER_FONT } = loadInter();

const FONT_WHITEBOARD = `${KALAM_FONT}, 'Kalam', 'Caveat', cursive, sans-serif`;
const FONT_HEADER = `${JAKARTA_FONT}, sans-serif`;
const FONT_BODY = `${INTER_FONT}, sans-serif`;

const COLORS = {
  title: '#0F172A',      // Slate Black
  blue: '#1E3A8A',       // Executive Navy
  green: '#0F766E',      // Boardroom Emerald
  red: '#B91C1C',        // Vivid Crimson
  amber: '#D97706',      // Sunset Amber
  black: '#0F172A',      // Primary Text
  grey: '#475569',       // Muted Gray
  highlight: '#FEF08A',  // Yellow Marker Highlighter
};

const BULLET_CHARS: Record<string, string> = {
  number: '',
  bullet: '•',
  check: '✓',
  arrow: '→',
  star: '★',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

function clampText(text: string, maxChars: number) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`;
}

function splitLongToken(token: string, charsPerLine: number) {
  if (token.length <= charsPerLine) return [token];
  const parts: string[] = [];
  for (let index = 0; index < token.length; index += charsPerLine) {
    parts.push(token.slice(index, index + charsPerLine));
  }
  return parts;
}

function wrapWhiteboardText(
  text: string,
  charsPerLine: number = WB_MAX_CHARS_PER_LINE,
  maxLines: number = WB_MAX_LINES_PER_POINT
) {
  const words = clampText(text, charsPerLine * maxLines)
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => splitLongToken(word, charsPerLine));
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= charsPerLine || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);

  const rendered = lines.join('\n');
  return rendered || clampText(text, charsPerLine);
}

// ── Procedural Whiteboard Frame & Background Component ────────────────────────

function ProceduralWhiteboardCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Outer Room Ambience / Wall Shadow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #0A0D14 0%, #111827 50%, #0A0D14 100%)',
      }} />

      {/* Realistic Aluminum Whiteboard Frame */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 20,
        right: 20,
        bottom: 24,
        borderRadius: 24,
        padding: 12,
        background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 50%, #CBD5E1 100%)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Corner Screws / Mounting Brackets */}
        {[
          { top: 6, left: 6 },
          { top: 6, right: 6 },
          { bottom: 6, left: 6 },
          { bottom: 6, right: 6 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#64748B',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
            }}
          />
        ))}

        {/* Whiteboard Porcelain Enamel Surface */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 16,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 55%, #F1F5F9 100%)',
          boxShadow: 'inset 0 4px 14px rgba(15, 23, 42, 0.08), inset 0 -2px 8px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
        }}>
          {/* Subtle Dry-Erase Dot Matrix Pattern (Physical Board feel) */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
            <defs>
              <pattern id="wb-dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#94A3B8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wb-dots)" />
          </svg>

          {/* Soft Top Surface Specular Gloss Reflection */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '28%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 100%)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Bottom Marker Tray with Pens & Eraser */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 120,
        right: 120,
        height: 18,
        background: 'linear-gradient(180deg, #94A3B8 0%, #64748B 100%)',
        borderRadius: '0 0 10px 10px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        {/* Felt Eraser */}
        <div style={{
          width: 68,
          height: 10,
          background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: 3,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          borderTop: '2px solid #334155',
        }} />

        {/* 4 Dry-Erase Markers (Navy, Emerald, Crimson, Black) */}
        <div style={{ display: 'flex', gap: 10 }}>
          {['#1E3A8A', '#0F766E', '#B91C1C', '#0F172A'].map((c, i) => (
            <div
              key={i}
              style={{
                width: 44,
                height: 8,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${c} 0%, ${c} 70%, #E2E8F0 70%, #E2E8F0 100%)`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SVG Doodle Icons ──────────────────────────────────────────────────────────

const DOODLE_PATHS: Record<string, { path: string; viewBox: string; len: number }> = {
  arrow: { path: 'M4 16 L24 16 M18 10 L24 16 L18 22', viewBox: '0 0 28 28', len: 36 },
  checkmark: { path: 'M4 15 L10 22 L24 6', viewBox: '0 0 28 28', len: 38 },
  lightbulb: { path: 'M14 3 C9 3 5 7.5 5 12 C5 15.5 7.5 17 8.5 19 L19.5 19 C20.5 17 23 15.5 23 12 C23 7.5 19 3 14 3 Z M10 22 L18 22 M11 25 L17 25', viewBox: '0 0 28 28', len: 72 },
  star: { path: 'M14 2 L16.5 10 L25 10 L18.5 15 L21 23 L14 18.5 L7 23 L9.5 15 L3 10 L11.5 10 Z', viewBox: '0 0 28 28', len: 82 },
  circle: { path: 'M14 3 C20 3 25 8 25 14 C25 20 20 25 14 25 C8 25 3 20 3 14 C3 8 8 3 14 3', viewBox: '0 0 28 28', len: 64 },
  chart: { path: 'M4 24 L4 4 M4 24 L24 24 M8 18 L14 11 L18 15 L24 7', viewBox: '0 0 28 28', len: 68 },
  target: { path: 'M14 3 A11 11 0 1 0 14 25 A11 11 0 1 0 14 3 M14 8 A6 6 0 1 0 14 20 A6 6 0 1 0 14 8 M14 12 A2 2 0 1 0 14 16 A2 2 0 1 0 14 12', viewBox: '0 0 28 28', len: 90 },
  rocket: { path: 'M14 3 C17 6 21 11 21 16 L17 19 L14 16 L11 19 L7 16 C7 11 11 6 14 3 Z M14 16 L14 24', viewBox: '0 0 28 28', len: 76 },
};

function DoodleIcon({ type, color, startFrame, size = 36 }: { type: string; color: string; startFrame: number; size?: number }) {
  const frame = useCurrentFrame();
  const doodle = DOODLE_PATHS[type] || DOODLE_PATHS.lightbulb;
  if (!doodle) return null;

  const progress = interpolate(frame, [startFrame, startFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (progress <= 0) return null;

  return (
    <svg width={size} height={size} viewBox={doodle.viewBox} style={{ flexShrink: 0, marginRight: 14 }}>
      <path
        d={doodle.path}
        fill="none"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={doodle.len}
        strokeDashoffset={doodle.len * (1 - progress)}
      />
    </svg>
  );
}

// ── Procedural Whiteboard Vector Drawing Component ─────────────────────────────

function WhiteboardDynamicSketch({
  drawingId,
  fallbackText,
  color,
  startFrame,
  endFrame,
  size = 64,
}: {
  drawingId?: string;
  fallbackText?: string;
  color: string;
  startFrame: number;
  endFrame: number;
  size?: number;
}) {
  const frame = useCurrentFrame();
  const drawingDef = drawingId && WHITEBOARD_VECTOR_DRAWINGS[drawingId]
    ? WHITEBOARD_VECTOR_DRAWINGS[drawingId]
    : resolveVectorDrawing(fallbackText);

  if (!drawingDef) return null;

  const totalFrames = Math.max(14, endFrame - startFrame);
  const colorMap: Record<string, string> = {
    primary: color || '#1E40AF',
    accent: '#FF6D00',
    highlight: '#D97706',
    danger: '#DC2626',
    success: '#0F766E',
    white: '#FFFFFF',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={drawingDef.viewBox}
      style={{
        flexShrink: 0,
        marginRight: 16,
        overflow: 'visible',
      }}
    >
      {drawingDef.strokes.map((stroke, index) => {
        const order = stroke.order ?? index;
        const totalStrokes = Math.max(1, drawingDef.strokes.length);
        const strokeStart = startFrame + Math.floor((order / totalStrokes) * (totalFrames * 0.7));
        const strokeDuration = Math.max(6, Math.floor(totalFrames * 0.45));
        const rawProgress = interpolate(
          frame,
          [strokeStart, strokeStart + strokeDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const progress = Math.max(0, Math.min(1, rawProgress));

        if (progress <= 0) return null;

        const strokeColor = stroke.colorKey ? colorMap[stroke.colorKey] || color : color;
        const strokeDashLen = Math.ceil((stroke.len || 100) * 1.18);

        return (
          <path
            key={index}
            d={stroke.d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke.strokeWidth || 3.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={strokeDashLen}
            strokeDashoffset={strokeDashLen * (1 - progress)}
          />
        );
      })}
    </svg>
  );
}

// ── Focus Overlays (Spoken Word Highlighting) ──────────────────────────────────

function FocusOverlay({
  type,
  color,
  startFrame,
}: {
  type: 'circle' | 'underline' | 'box' | 'arrow' | 'highlight';
  color: string;
  startFrame: number;
}) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - startFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (progress <= 0) return null;

  if (type === 'highlight') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: '-6px -12px',
          backgroundColor: '#FEF08A',
          borderRadius: 8,
          zIndex: -1,
          opacity: 0.92 * Math.min(1, progress * 1.5),
          transform: `scaleX(${progress}) skew(-2deg)`,
          transformOrigin: 'left center',
          pointerEvents: 'none',
          boxShadow: '0 2px 12px rgba(250, 204, 21, 0.45)',
        }}
      />
    );
  }

  if (type === 'circle') {
    return (
      <div style={{ position: 'absolute', inset: '-8px -14px', pointerEvents: 'none', zIndex: 5 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 50,5 C 82,4 96,20 96,50 C 96,80 75,95 50,95 C 20,95 4,78 4,50 C 4,20 20,5 48,6"
            fill="none"
            stroke={color}
            strokeWidth={3.4}
            strokeLinecap="round"
            strokeDasharray={310}
            strokeDashoffset={310 * (1 - progress)}
            opacity={0.92}
          />
        </svg>
      </div>
    );
  }

  if (type === 'underline') {
    return (
      <div style={{ position: 'absolute', bottom: '-8px', left: 0, right: 0, height: 10, pointerEvents: 'none', zIndex: 5 }}>
        <svg width="100%" height="100%" viewBox="0 0 200 10" preserveAspectRatio="none">
          <path
            d="M 0,5 C 40,2 100,8 200,4"
            fill="none"
            stroke={color}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeDasharray={200}
            strokeDashoffset={200 * (1 - progress)}
            opacity={0.9}
          />
        </svg>
      </div>
    );
  }

  if (type === 'box') {
    return (
      <div style={{ position: 'absolute', inset: '-6px -10px', pointerEvents: 'none', zIndex: 5 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="12"
            fill="none"
            stroke={color}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeDasharray={400}
            strokeDashoffset={400 * (1 - progress)}
            opacity={0.9}
          />
        </svg>
      </div>
    );
  }

  return null;
}

const UNDERLINE_PATHS = [
  'M0 4 C35 1 70 7 105 4 C140 1 175 7 210 3',
  'M0 4 C45 6 90 2 135 5 C180 7 225 3 260 4',
  'M0 5 C30 2 60 7 90 3 C120 1 150 6 180 4',
];

function MarkerUnderline({ color, startFrame, variant = 0 }: { color: string; startFrame: number; variant?: number }) {
  const frame = useCurrentFrame();
  const pathLen = 260;
  const progress = interpolate(frame, [startFrame, startFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (progress <= 0) return null;

  return (
    <svg width="100%" height={10} viewBox="0 0 260 10" preserveAspectRatio="none" style={{ marginTop: 6 }}>
      <path
        d={UNDERLINE_PATHS[variant % 3]}
        fill="none"
        stroke={color}
        strokeWidth={4.6}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - progress)}
        opacity={0.88}
      />
    </svg>
  );
}

// ── FIXED-LAYOUT WRITING LINE COMPONENT (Zero Layout Shifts) ──────────────────

function WritingLine({
  text,
  startFrame,
  endFrame,
  focusStartTime,
  focusEndTime,
  color,
  fontSize,
  fontWeight = 700,
  isTitle = false,
  bulletPrefix = '',
  isHighlight = false,
  icon,
  iconUrl,
  drawingId,
  direction = 'ltr',
  language = 'en',
  pointIndex = 0,
  focusType = 'highlight',
}: {
  text: string;
  startFrame: number;
  endFrame: number;
  focusStartTime?: number;
  focusEndTime?: number;
  color: string;
  fontSize: number;
  fontWeight?: number;
  isTitle?: boolean;
  bulletPrefix?: string;
  isHighlight?: boolean;
  icon?: string;
  iconUrl?: string;
  drawingId?: string;
  direction?: 'rtl' | 'ltr';
  language?: 'ur' | 'hi' | 'en';
  pointIndex?: number;
  focusType?: 'circle' | 'underline' | 'box' | 'arrow' | 'highlight';
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Point is hidden until its speech starts
  if (frame < startFrame) {
    return null;
  }

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + WB_REVEAL_FADE_FRAMES],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(
    frame,
    [startFrame, startFrame + WB_REVEAL_FADE_FRAMES],
    [WB_REVEAL_TRANSLATE_Y_START, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const currentTime = frame / fps;
  const isFocusActive = focusStartTime !== undefined && focusEndTime !== undefined &&
                       currentTime >= focusStartTime && currentTime <= focusEndTime;

  const isUrdu = language === 'ur' || direction === 'rtl';
  const activeFont = isUrdu ? "'Noto Nastaliq Urdu', 'Gulzar', serif" : FONT_WHITEBOARD;
  const activeLineHeight = isUrdu ? 2.2 : isTitle ? 1.2 : 1.35;

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`,
      marginBottom: isTitle ? 32 : 24,
      display: 'flex',
      flexDirection: isUrdu ? 'row-reverse' : 'row',
      alignItems: 'center',
      direction: isUrdu ? 'rtl' : 'ltr',
      textAlign: isUrdu ? 'right' : 'left',
      minWidth: 0,
      position: 'relative',
      background: isTitle ? 'transparent' : 'rgba(255, 255, 255, 0.94)',
      border: isTitle ? 'none' : isFocusActive ? `3px solid ${color || '#FACC15'}` : '1.5px solid rgba(203, 213, 225, 0.9)',
      boxShadow: isTitle
        ? 'none'
        : isFocusActive
        ? `0 12px 30px rgba(15, 23, 42, 0.12), 0 0 16px ${color}33`
        : '0 8px 22px rgba(15, 23, 42, 0.07)',
      borderRadius: isTitle ? 0 : 20,
      padding: isTitle ? '0' : '20px 24px',
      transition: 'border 0.2s ease, box-shadow 0.2s ease',
    }}>
      {/* Procedural Vector Drawing Sketch OR Doodle Icon */}
      {drawingId ? (
        <WhiteboardDynamicSketch
          drawingId={drawingId}
          fallbackText={text}
          color={color}
          startFrame={startFrame}
          endFrame={endFrame}
          size={Math.max(52, Math.round(fontSize * 1.25))}
        />
      ) : iconUrl ? (
        <div style={{
          width: Math.max(48, Math.round(fontSize * 1.15)),
          height: Math.max(48, Math.round(fontSize * 1.15)),
          marginLeft: isUrdu ? 16 : 0,
          marginRight: isUrdu ? 0 : 16,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FEF9C3',
          borderRadius: 14,
          padding: 8,
          border: '1.5px solid #FDE047',
        }}>
          <Img src={iconUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      ) : icon && icon !== 'none' ? (
        <DoodleIcon type={icon} color={color} startFrame={startFrame} size={Math.max(32, fontSize * 0.75)} />
      ) : null}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'inline-block', position: 'relative', maxWidth: '100%' }}>
          {/* Hand-drawn marker number badge */}
          {bulletPrefix && !isTitle ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: color || COLORS.blue,
              color: '#FFFFFF',
              fontFamily: FONT_HEADER,
              fontWeight: 800,
              fontSize: Math.round(fontSize * 0.58),
              padding: '4px 12px',
              borderRadius: 10,
              marginRight: isUrdu ? 0 : 14,
              marginLeft: isUrdu ? 14 : 0,
              verticalAlign: 'middle',
              transform: 'rotate(-2deg)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}>
              {bulletPrefix.trim()}
            </span>
          ) : null}

          <span style={{
            fontFamily: activeFont,
            fontSize,
            fontWeight: isTitle ? 900 : fontWeight,
            color: isTitle ? COLORS.title : '#0F172A',
            lineHeight: activeLineHeight,
            letterSpacing: isTitle ? '-0.02em' : '0.01em',
            whiteSpace: 'pre-line',
            overflowWrap: 'anywhere',
            display: 'inline',
            verticalAlign: 'middle',
          }}>
            {text}
          </span>

          {isTitle && <MarkerUnderline color={color} startFrame={startFrame + 4} variant={0} />}
          {isHighlight && !isTitle && <MarkerUnderline color={color} startFrame={startFrame + 2} variant={pointIndex % 3} />}

          {/* Real-time spoken highlight or focus overlay */}
          {isFocusActive && (
            <FocusOverlay
              type={focusType}
              color={color}
              startFrame={Math.round((focusStartTime || 0) * fps)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tabular Layout View ───────────────────────────────────────────────────────

function WhiteboardTableView({
  title,
  rows,
  language = 'ur',
  direction = 'rtl',
  fps,
}: {
  title: string;
  rows: WhiteboardTableRow[];
  language?: 'ur' | 'hi' | 'en';
  direction?: 'rtl' | 'ltr';
  fps: number;
}) {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;
  const isUrdu = language === 'ur' || direction === 'rtl';
  const font = isUrdu ? "'Noto Nastaliq Urdu', 'Gulzar', serif" : FONT_WHITEBOARD;

  return (
    <div style={{
      width: '100%',
      direction: isUrdu ? 'rtl' : 'ltr',
      fontFamily: font,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        color: '#FFFFFF',
        borderRadius: 20,
        padding: '20px 28px',
        textAlign: 'center',
        marginBottom: 24,
        boxShadow: '0 8px 24px rgba(30, 27, 75, 0.25)',
      }}>
        <h2 style={{
          fontSize: WB_TITLE_SIZE,
          fontWeight: 900,
          margin: 0,
          lineHeight: isUrdu ? 2.2 : 1.2,
        }}>
          {title}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map((row, idx) => {
          const isRowActive = currentTime >= row.startTime && currentTime <= row.endTime;
          const rowOpacity = interpolate(
            frame,
            [Math.round(row.startTime * fps) - 8, Math.round(row.startTime * fps)],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={idx}
              style={{
                opacity: rowOpacity,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 22px',
                borderRadius: 20,
                background: isRowActive ? '#FEF08A' : 'rgba(255, 255, 255, 0.95)',
                border: isRowActive ? '2.5px solid #EAB308' : '1.5px solid #E2E8F0',
                boxShadow: isRowActive
                  ? '0 8px 20px rgba(234, 179, 8, 0.25)'
                  : '0 4px 12px rgba(15, 23, 42, 0.05)',
                transition: 'background 0.2s ease, border 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {row.iconUrl && (
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    border: '1px solid #CBD5E1',
                    flexShrink: 0,
                  }}>
                    <Img src={row.iconUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                <div>
                  <div style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: isUrdu ? 2.1 : 1.3,
                  }}>
                    {row.label}
                  </div>
                  <div style={{
                    fontSize: 24,
                    color: '#334155',
                    fontWeight: 600,
                    lineHeight: isUrdu ? 1.9 : 1.3,
                  }}>
                    {row.value}
                  </div>
                </div>
              </div>

              {row.subValue && (
                <div style={{
                  background: isRowActive ? '#1E293B' : '#E0E7FF',
                  color: isRowActive ? '#FEF08A' : '#3730A3',
                  padding: '8px 16px',
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: 22,
                  lineHeight: isUrdu ? 1.8 : 1.2,
                  whiteSpace: 'nowrap',
                }}>
                  {row.subValue}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Quiz Layout View ──────────────────────────────────────────────────────────

function WhiteboardQuizView({
  quiz,
  language = 'ur',
  direction = 'rtl',
  fps,
}: {
  quiz: WhiteboardQuiz;
  language?: 'ur' | 'hi' | 'en';
  direction?: 'rtl' | 'ltr';
  fps: number;
}) {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;
  const isUrdu = language === 'ur' || direction === 'rtl';
  const font = isUrdu ? "'Noto Nastaliq Urdu', 'Gulzar', serif" : FONT_WHITEBOARD;

  const isRevealed = currentTime >= quiz.revealStart;
  const timerDuration = Math.max(1, quiz.revealStart - quiz.timerStart);
  const timerElapsed = Math.max(0, currentTime - quiz.timerStart);
  const timerProgress = interpolate(timerElapsed, [0, timerDuration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      width: '100%',
      direction: isUrdu ? 'rtl' : 'ltr',
      fontFamily: font,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
        color: '#FFFFFF',
        borderRadius: 24,
        padding: '24px 28px',
        textAlign: 'center',
        marginBottom: 24,
        boxShadow: '0 10px 28px rgba(6, 95, 70, 0.28)',
        border: '2px solid #34D399',
      }}>
        <div style={{ fontSize: 22, opacity: 0.9, letterSpacing: '0.05em', marginBottom: 6 }}>
          {isUrdu ? 'سوال نمبر ۱' : 'QUESTION'}
        </div>
        <h2 style={{
          fontSize: 38,
          fontWeight: 900,
          margin: 0,
          lineHeight: isUrdu ? 2.3 : 1.35,
        }}>
          {quiz.question}
        </h2>
      </div>

      <div style={{
        width: '100%',
        height: 14,
        backgroundColor: '#E2E8F0',
        borderRadius: 7,
        overflow: 'hidden',
        marginBottom: 24,
      }}>
        <div style={{
          width: `${timerProgress * 100}%`,
          height: '100%',
          backgroundColor: timerProgress > 0.3 ? '#10B981' : '#EF4444',
          transition: 'width 0.1s linear',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {quiz.options.map((opt, idx) => {
          const isCorrect = idx === quiz.correctIndex;
          const showAnswer = isRevealed && isCorrect;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderRadius: 20,
                background: showAnswer ? '#DCFCE7' : 'rgba(255, 255, 255, 0.95)',
                border: showAnswer ? '3px solid #16A34A' : '1.5px solid #CBD5E1',
                boxShadow: showAnswer
                  ? '0 8px 24px rgba(22, 163, 74, 0.3)'
                  : '0 4px 12px rgba(15, 23, 42, 0.05)',
                transform: showAnswer ? 'scale(1.02)' : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: showAnswer ? '#16A34A' : '#0F172A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  {['A', 'B', 'C', 'D'][idx] || idx + 1}
                </span>

                <span style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: isUrdu ? 2.1 : 1.3,
                }}>
                  {opt}
                </span>
              </div>

              {showAnswer && (
                <span style={{
                  color: '#16A34A',
                  fontSize: 36,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function WhiteboardVideo({
  mediaSrc = '',
  mediaType = 'audio',
  sourceAudioVolume = 1,
  mediaTrimStartSeconds = 0,
  title = 'Executive Strategy',
  titleColor = COLORS.title,
  layoutType = 'cards',
  language = 'en',
  direction = 'ltr',
  points = [],
  tableRows = [],
  quiz,
  conclusion = '',
  conclusionTime,
  enableSfx = true,
}: WhiteboardVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const dim = getWhiteboardDimensions();
  const currentTime = frame / fps;

  // Active board index: tracks current scene
  const activeBoardIndex = useMemo(() => {
    let active = 0;
    for (const p of points) {
      const idx = p.boardIndex ?? 0;
      if (currentTime >= p.startTime) {
        active = Math.max(active, idx);
      }
    }
    return active;
  }, [points, currentTime]);

  // Points belonging to the active board
  const activeBoardPoints = useMemo(() => {
    return points.filter((p) => (p.boardIndex ?? 0) === activeBoardIndex);
  }, [points, activeBoardIndex]);

  // Dynamic point font size: calibrated so content never shrinks into illegibility
  const pointFontSize = useMemo(() => {
    const count = activeBoardPoints.length;
    const baseSize = dim.pointSizeByCount[count] || dim.pointSizeByCount[3];
    return Math.max(dim.pointSizeMin, baseSize);
  }, [activeBoardPoints.length, dim]);

  const titleStartFrame = Math.round(0.2 * fps);
  const titleEndFrame = titleStartFrame + Math.round(0.8 * fps);

  // Transition between boards (swipe sound effect + board wipe)
  const firstPointOfCurrentBoard = activeBoardPoints[0];
  const boardTransitionStart = firstPointOfCurrentBoard && (firstPointOfCurrentBoard.boardIndex ?? 0) > 0
    ? Math.round(firstPointOfCurrentBoard.startTime * fps) - 8
    : 0;
  const isTransitioningBoard = (activeBoardIndex > 0) && frame >= boardTransitionStart && frame <= boardTransitionStart + 12;

  const boardOpacity = interpolate(
    frame,
    [boardTransitionStart, boardTransitionStart + 6],
    [0.1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const boardTranslateY = interpolate(
    frame,
    [boardTransitionStart, boardTransitionStart + 8],
    [16, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: '#0A0D14' }}>
      {/* 1. Procedural Realistic Whiteboard Canvas & Frame */}
      <ProceduralWhiteboardCanvas />

      {/* 2. Safe Area Container for Content */}
      <div style={{
        position: 'absolute',
        top: dim.safeTop,
        left: dim.safeLeft,
        width: dim.usableWidth,
        height: dim.usableHeight,
        overflow: 'hidden',
        zIndex: 10,
        opacity: activeBoardIndex === 0 ? 1 : boardOpacity,
        transform: `translateY(${activeBoardIndex === 0 ? 0 : boardTranslateY}px)`,
      }}>
        {layoutType === 'table' && tableRows && tableRows.length > 0 ? (
          <WhiteboardTableView
            title={wrapWhiteboardText(title, WB_MAX_CHARS_PER_LINE, 2)}
            rows={tableRows}
            language={language}
            direction={direction}
            fps={fps}
          />
        ) : layoutType === 'quiz' && quiz ? (
          <WhiteboardQuizView
            quiz={quiz}
            language={language}
            direction={direction}
            fps={fps}
          />
        ) : (
          <>
            {/* Title Header */}
            <WritingLine
              text={wrapWhiteboardText(title, WB_MAX_CHARS_PER_LINE, 2)}
              startFrame={titleStartFrame}
              endFrame={titleEndFrame}
              color={titleColor || COLORS.title}
              fontSize={dim.titleSize}
              fontWeight={900}
              direction={direction}
              language={language}
              isTitle
            />

            {/* Points (Max 3 per board, step-by-step reveal) */}
            {activeBoardPoints.slice(0, WB_MAX_POINTS_PER_BOARD).map((point, index) => {
              const bullet = point.bulletType === 'number'
                ? `${index + 1}`
                : BULLET_CHARS[point.bulletType] || '';
              const startFrame = Math.round(point.startTime * fps);
              const endFrame = Math.round(point.endTime * fps);
              const wrappedText = wrapWhiteboardText(point.text, WB_MAX_CHARS_PER_LINE, WB_MAX_LINES_PER_POINT);

              return (
                <WritingLine
                  key={`${point.startTime}-${index}`}
                  text={wrappedText}
                  startFrame={startFrame}
                  endFrame={endFrame}
                  focusStartTime={point.focusStartTime}
                  focusEndTime={point.focusEndTime}
                  color={point.markerColor || COLORS.blue}
                  fontSize={pointFontSize}
                  fontWeight={700}
                  bulletPrefix={bullet}
                  isHighlight={point.isHighlight}
                  icon={point.icon || 'none'}
                  iconUrl={point.iconUrl}
                  drawingId={point.drawingId}
                  direction={direction}
                  language={language}
                  pointIndex={index}
                  focusType={point.focusType || 'highlight'}
                />
              );
            })}

            {/* Final Conclusion Takeaway */}
            {conclusion && currentTime >= (conclusionTime || 0) - 1.2 && (
              <WritingLine
                text={wrapWhiteboardText(conclusion, WB_MAX_CHARS_PER_LINE, 2)}
                startFrame={Math.round((conclusionTime || 0) * fps)}
                endFrame={Math.round((conclusionTime || 0) * fps) + 24}
                color={COLORS.amber}
                fontSize={dim.conclusionSize}
                fontWeight={800}
                direction={direction}
                language={language}
                bulletPrefix="★"
              />
            )}
          </>
        )}
      </div>

      {/* 3. Sound Effects (Tactile Writing & Board Swipe) */}
      {enableSfx && isTransitioningBoard && (
        <Audio
          src={resolveAsset('assets/reusable/sound-effects/swipe-right.wav')}
          volume={0.35}
        />
      )}

      {/* 4. Narration Audio Track */}
      {resolvedSrc && mediaType === 'audio' && (
        <Audio
          src={resolvedSrc}
          volume={sourceAudioVolume}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
        />
      )}
      {resolvedSrc && mediaType === 'video' && (
        <OffthreadVideo
          src={resolvedSrc}
          volume={sourceAudioVolume}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
        />
      )}
    </AbsoluteFill>
  );
}

// ── Composition (Strictly 9:16 Vertical Portrait, Up to 90s) ──────────────────

const defaultProps: WhiteboardVideoProps = {
  mediaSrc: '',
  mediaType: 'audio',
  sourceAudioVolume: 1,
  durationSeconds: 30,
  title: 'Executive Strategy',
  titleColor: COLORS.title,
  points: [
    { text: 'Target core bottleneck', startTime: 1.0, endTime: 6.5, focusStartTime: 1.0, focusEndTime: 6.5, markerColor: COLORS.blue, bulletType: 'number', icon: 'lightbulb', boardIndex: 0, focusType: 'circle' },
    { text: 'Validate executive metrics', startTime: 7.0, endTime: 13.5, focusStartTime: 7.0, focusEndTime: 13.5, markerColor: COLORS.green, bulletType: 'number', icon: 'checkmark', boardIndex: 0, focusType: 'underline' },
    { text: 'Scale distribution fast', startTime: 14.0, endTime: 21.0, focusStartTime: 14.0, focusEndTime: 21.0, markerColor: COLORS.red, bulletType: 'number', icon: 'arrow', boardIndex: 1, focusType: 'box' },
    { text: 'Automate growth workflow', startTime: 21.5, endTime: 28.0, focusStartTime: 21.5, focusEndTime: 28.0, markerColor: COLORS.amber, bulletType: 'number', icon: 'star', boardIndex: 1, focusType: 'highlight' },
  ],
  conclusion: 'Strategy alignment complete.',
  conclusionTime: 28.2,
  aspectRatio: '9:16',
};

export { WhiteboardVideo };

export const WhiteboardVideoComposition = () => (
  <Composition
    id="WHITEBOARD-VIDEO"
    component={WhiteboardVideo}
    durationInFrames={secondsToFrames(30, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as WhiteboardVideoProps;
      const dur = Math.max(8, Math.min(90,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return { durationInFrames: secondsToFrames(dur, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920 };
    }}
  />
);
