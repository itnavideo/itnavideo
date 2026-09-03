import React, { useMemo, useState } from 'react';
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
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';

// ── Types ─────────────────────────────────────────────────────────────────────

type WhiteboardPoint = {
  text: string;
  startTime: number;
  endTime: number;
  focusStartTime: number;
  focusEndTime: number;
  markerColor: string;
  bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  isHighlight?: boolean;
  icon?: 'arrow' | 'checkmark' | 'lightbulb' | 'star' | 'circle' | 'none';
  boardIndex?: number;
  focusType?: 'circle' | 'underline' | 'box' | 'arrow';
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
  points?: WhiteboardPoint[];
  conclusion?: string;
  conclusionTime?: number;
  boardStyle?: string;
  boardImageUrl?: string;
  captions?: Array<{ start: number; end: number; text: string }>;
  captionPosition?: 'bottom' | 'none';
};

// ── Corporate Fonts & Colors ───────────────────────────────────────────────

const { fontFamily: JAKARTA_FONT } = loadJakarta();
const { fontFamily: INTER_FONT } = loadInter();

const FONT_HEADER = `${JAKARTA_FONT}, sans-serif`;
const FONT_BODY = `${INTER_FONT}, sans-serif`;

const COLORS = {
  title: '#0F172A',      // Corporate Slate Charcoal
  blue: '#1E3A8A',       // Executive Navy
  red: '#B91C1C',        // Deep Crimson
  green: '#0F766E',      // Boardroom Emerald/Teal
  black: '#0F172A',      // Primary Text
  grey: '#475569',       // Muted Muted
  gold: '#D97706',       // Amber Gold
};

const BULLET_CHARS: Record<string, string> = {
  number: '',
  bullet: '•',
  check: '✓',
  arrow: '→',
  star: '★',
};

// ── Board Configurations ──────────────────────────────────────────────────────

type BoardConfig = {
  image: string;
  safeZone: { top: string; left: string; right: string; bottom: string };
  titleSize: number;
  pointSize: number;
  conclusionSize: number;
  maxPoints: number;
  maxTextRows: number;
  maxCharsPerLine: number;
  cameraZoomMax: number;
};

const BOARD_CONFIGS: Record<string, BoardConfig> = {
  'corporate-luxury': {
    image: 'assets/reusable/images/whiteboard-corporate-clean.png',
    safeZone: { top: '10%', left: '8%', right: '8%', bottom: '12%' },
    titleSize: 52, pointSize: 34, conclusionSize: 38, maxPoints: 4, maxTextRows: 9, maxCharsPerLine: 26, cameraZoomMax: 1,
  },
};

const DEFAULT_BOARD = 'corporate-luxury';

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

type RenderPoint = WhiteboardPoint & { displayText: string; lineCount: number };

type RenderPlan = {
  title: string;
  titleLines: number;
  points: RenderPoint[];
  conclusion: string;
  conclusionLines: number;
  scale: number;
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

function wrapWhiteboardText(text: string, charsPerLine: number, maxLines: number) {
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

function countLines(text: string) {
  return text ? text.split('\n').length : 0;
}

function createRenderPlan({
  title,
  points,
  conclusion,
  board,
}: {
  title: string;
  points: WhiteboardPoint[];
  conclusion?: string;
  board: BoardConfig;
}): RenderPlan {
  const titleText = wrapWhiteboardText(title || 'Executive Strategy', board.maxCharsPerLine, 2);
  const pointCharsPerLine = Math.max(18, board.maxCharsPerLine - 4);
  const displayPoints = points.slice(0, board.maxPoints).map((point) => {
    const displayText = wrapWhiteboardText(point.text, pointCharsPerLine, 2);
    return {...point, displayText, lineCount: countLines(displayText)};
  });
  const conclusionText = conclusion ? wrapWhiteboardText(conclusion, board.maxCharsPerLine, 2) : '';

  const usedRows = countLines(titleText) + 1 + displayPoints.reduce((total, point) => total + point.lineCount + 1, 0) + (conclusionText ? 2 : 0);
  const scale = Math.max(0.82, Math.min(1, board.maxTextRows / Math.max(board.maxTextRows, usedRows)));

  return {
    title: titleText,
    titleLines: countLines(titleText),
    points: displayPoints,
    conclusion: conclusionText,
    conclusionLines: countLines(conclusionText),
    scale,
  };
}

function useWriteProgress(text: string, startFrame: number, endFrame: number) {
  const frame = useCurrentFrame();
  const availableFrames = Math.max(12, endFrame - startFrame);
  const writeDurationFrames = Math.max(10, Math.min(availableFrames, Math.round(availableFrames * 0.72)));
  const progress = interpolate(
    frame,
    [startFrame, startFrame + writeDurationFrames],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return {
    progress,
    visibleChars: Math.floor(text.length * progress),
    isWriting: frame >= startFrame && progress < 1,
    isComplete: progress >= 1,
    endFrame: startFrame + writeDurationFrames,
  };
}

// ── SVG Doodle Icons ──────────────────────────────────────────────────────────

const DOODLE_PATHS: Record<string, { path: string; viewBox: string; len: number }> = {
  arrow: { path: 'M4 16 L24 16 M18 10 L24 16 L18 22', viewBox: '0 0 28 28', len: 36 },
  checkmark: { path: 'M4 15 L10 22 L24 6', viewBox: '0 0 28 28', len: 38 },
  lightbulb: { path: 'M14 3 C9 3 5 7.5 5 12 C5 15.5 7.5 17 8.5 19 L19.5 19 C20.5 17 23 15.5 23 12 C23 7.5 19 3 14 3 Z M10 22 L18 22 M11 25 L17 25', viewBox: '0 0 28 28', len: 72 },
  star: { path: 'M14 2 L16.5 10 L25 10 L18.5 15 L21 23 L14 18.5 L7 23 L9.5 15 L3 10 L11.5 10 Z', viewBox: '0 0 28 28', len: 82 },
  circle: { path: 'M14 3 C20 3 25 8 25 14 C25 20 20 25 14 25 C8 25 3 20 3 14 C3 8 8 3 14 3', viewBox: '0 0 28 28', len: 64 },
};

function DoodleIcon({ type, color, startFrame, size = 28 }: { type: string; color: string; startFrame: number; size?: number }) {
  const frame = useCurrentFrame();
  const doodle = DOODLE_PATHS[type];
  if (!doodle) return null;

  const progress = interpolate(frame, [startFrame, startFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (progress <= 0) return null;

  return (
    <svg width={size} height={size} viewBox={doodle.viewBox} style={{ flexShrink: 0, marginRight: 12, marginTop: 4 }}>
      <path
        d={doodle.path}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={doodle.len}
        strokeDashoffset={doodle.len * (1 - progress)}
      />
    </svg>
  );
}

// ── Focus Overlays ─────────────────────────────────────────────────────────

function FocusOverlay({
  type,
  color,
  startFrame,
}: {
  type: 'circle' | 'underline' | 'box' | 'arrow';
  color: string;
  startFrame: number;
}) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - startFrame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (progress <= 0) return null;

  if (type === 'circle') {
    return (
      <div style={{ position: 'absolute', inset: '-8px -14px', pointerEvents: 'none', zIndex: 5 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 50,5 C 80,4 95,20 95,50 C 95,80 75,95 50,95 C 22,95 5,78 5,50 C 5,20 22,5 47,6"
            fill="none"
            stroke={color}
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeDasharray={310}
            strokeDashoffset={310 * (1 - progress)}
            opacity={0.88}
          />
        </svg>
      </div>
    );
  }

  if (type === 'underline') {
    return (
      <div style={{ position: 'absolute', bottom: '-6px', left: 0, right: 0, height: '8px', pointerEvents: 'none', zIndex: 5 }}>
        <svg width="100%" height="100%" viewBox="0 0 200 8" preserveAspectRatio="none">
          <path
            d="M 0,4 C 40,2 100,6 200,3"
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={200}
            strokeDashoffset={200 * (1 - progress)}
            opacity={0.88}
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
            rx="10"
            fill="none"
            stroke={color}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeDasharray={400}
            strokeDashoffset={400 * (1 - progress)}
            opacity={0.85}
          />
        </svg>
      </div>
    );
  }

  if (type === 'arrow') {
    return (
      <div style={{ position: 'absolute', left: '-36px', top: '50%', transform: 'translateY(-50%)', width: '28px', height: '28px', pointerEvents: 'none', zIndex: 5 }}>
        <svg width="100%" height="100%" viewBox="0 0 24 24">
          <path
            d="M 2,12 H 22 M 16,6 L 22,12 L 16,18"
            fill="none"
            stroke={color}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={36}
            strokeDashoffset={36 * (1 - progress)}
            opacity={0.9}
          />
        </svg>
      </div>
    );
  }

  return null;
}

const UNDERLINE_PATHS = [
  'M0 4 C30 2 60 6 90 4 C120 2 150 6 180 3',
  'M0 3 C40 5 80 1 120 4 C160 6 200 3 240 4',
  'M0 5 C25 2 50 6 75 3 C100 1 125 5 150 3',
];

function MarkerUnderline({ color, startFrame, variant = 0 }: { color: string; startFrame: number; variant?: number }) {
  const frame = useCurrentFrame();
  const pathLen = 240;
  const progress = interpolate(frame, [startFrame, startFrame + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (progress <= 0) return null;

  return (
    <svg width="100%" height={8} viewBox="0 0 240 8" preserveAspectRatio="none" style={{ marginTop: 4 }}>
      <path
        d={UNDERLINE_PATHS[variant % 3]}
        fill="none"
        stroke={color}
        strokeWidth={3.8}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - progress)}
        opacity={0.8}
      />
    </svg>
  );
}

// ── Pen Cursor Component ──────────────────────────────────────────────────────

function PenCursor({ color, visible }: { color: string; visible: boolean }) {
  const frame = useCurrentFrame();
  if (!visible) return null;

  const wobbleY = Math.sin(frame * 0.35) * 2;
  const wobbleR = Math.sin(frame * 0.2) * 4 - 10;

  return (
    <span style={{
      display: 'inline-block',
      width: 18,
      height: 42,
      marginLeft: 4,
      verticalAlign: 'top',
      transform: `translateY(${wobbleY - 22}px) rotate(${wobbleR}deg)`,
      transformOrigin: 'bottom center',
    }}>
      <svg width="18" height="42" viewBox="0 0 16 40">
        <rect x="3" y="0" width="10" height="26" rx="3" fill={color} opacity="0.95" />
        <rect x="2" y="22" width="12" height="4" rx="2" fill={color} opacity="0.7" />
        <polygon points="5,26 8,38 11,26" fill="#1E293B" />
        <rect x="5" y="3" width="2.5" height="14" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    </span>
  );
}

// ── Writing Line with Executive Corporate Slide Styling ─────────────────────

function WritingLine({
  text,
  startFrame,
  endFrame,
  focusStartTime,
  focusEndTime,
  color,
  fontSize,
  fontWeight = 600,
  isTitle = false,
  bulletPrefix = '',
  isHighlight = false,
  icon,
  pointIndex = 0,
  focusType = 'circle',
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
  pointIndex?: number;
  focusType?: 'circle' | 'underline' | 'box' | 'arrow';
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wp = useWriteProgress(text, startFrame, endFrame);
  if (frame < startFrame - 2) return null;

  const opacity = interpolate(frame, [startFrame - 2, startFrame + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const displayText = text.slice(0, wp.visibleChars);
  const bulletOpacity = interpolate(wp.progress, [0, 0.12], [0, 1], {extrapolateRight: 'clamp'});

  // Focus highlight matching current speech timeline
  const currentTime = frame / fps;
  const isFocusActive = focusStartTime !== undefined && focusEndTime !== undefined && 
                       currentTime >= focusStartTime && currentTime <= focusEndTime;

  return (
    <div style={{
      opacity,
      marginBottom: isTitle ? 28 : 20,
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      position: 'relative',
      // Executive Slide Container for bullet points
      background: isTitle ? 'transparent' : 'rgba(255, 255, 255, 0.92)',
      border: isTitle ? 'none' : '1px solid rgba(226, 232, 240, 0.95)',
      boxShadow: isTitle ? 'none' : '0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
      borderRadius: isTitle ? 0 : 20,
      padding: isTitle ? '0' : '20px 24px',
      backdropFilter: isTitle ? 'none' : 'blur(12px)',
    }}>
      {/* Icon Badge */}
      {icon && icon !== 'none' ? (
        <DoodleIcon type={icon} color={color} startFrame={startFrame + 2} size={Math.max(22, fontSize * 0.72)} />
      ) : null}

      <div style={{flex: 1, minWidth: 0}}>
        <div style={{
          display: 'inline-block',
          position: 'relative',
          maxWidth: '100%',
        }}>
          {/* Executive Corporate Number Badge */}
          {bulletPrefix && !isTitle ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: color || COLORS.blue,
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: Math.round(fontSize * 0.65),
              padding: '2px 10px',
              borderRadius: 8,
              marginRight: 12,
              opacity: bulletOpacity,
              verticalAlign: 'middle',
            }}>
              {bulletPrefix.trim()}
            </span>
          ) : null}

          <span style={{
            fontFamily: isTitle ? FONT_HEADER : FONT_BODY,
            fontSize,
            fontWeight: isTitle ? 800 : fontWeight,
            color: isTitle ? COLORS.title : '#0F172A',
            lineHeight: isTitle ? 1.18 : 1.35,
            letterSpacing: isTitle ? '-0.02em' : '0.01em',
            whiteSpace: 'pre-line',
            overflowWrap: 'anywhere',
            display: 'inline',
            verticalAlign: 'middle',
          }}>
            {displayText}
            {wp.isWriting ? <PenCursor color={color} visible /> : null}
          </span>

          {isTitle && wp.isComplete && <MarkerUnderline color={color} startFrame={wp.endFrame + 3} variant={0} />}
          {isHighlight && !isTitle && wp.isComplete && <MarkerUnderline color={color} startFrame={wp.endFrame + 2} variant={pointIndex % 3} />}

          {/* Dynamic hand-drawn focus circles, boxes or underlines synced to narration */}
          {isFocusActive && (
            <FocusOverlay
              type={focusType}
              color={color}
              startFrame={Math.round(focusStartTime * fps)}
            />
          )}
        </div>
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
  points = [],
  conclusion = '',
  conclusionTime,
  boardStyle = DEFAULT_BOARD,
  boardImageUrl,
}: WhiteboardVideoProps) {
  const frame = useCurrentFrame();
  const [imageError, setImageError] = useState(false);
  const {fps, durationInFrames} = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const board = BOARD_CONFIGS[boardStyle] || BOARD_CONFIGS[DEFAULT_BOARD];
  const boardImage = boardImageUrl ? resolveAsset(boardImageUrl) : staticFile(board.image);

  const currentTime = frame / fps;

  // 1. Calculate active board clears/slides state-driven
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

  // Filter points matching ONLY the currently active corporate board
  const activeBoardPoints = useMemo(() => {
    return points.filter((p) => (p.boardIndex ?? 0) === activeBoardIndex);
  }, [points, activeBoardIndex]);

  // Construct independent layout plan so fonts stay beautiful and spacious
  const renderPlan = useMemo(
    () => createRenderPlan({title, points: activeBoardPoints, conclusion, board}),
    [board, conclusion, activeBoardPoints, title],
  );

  const titleStartFrame = Math.round(0.55 * fps);
  const titleEndFrame = titleStartFrame + Math.round(1.2 * fps);
  const intro = spring({frame, fps, config: {damping: 22, mass: 0.8}});

  // 2. Play Whiteboard Cap & Write Sounds
  const isCapFrame = frame === 5 || (points.some(p => Math.round(p.startTime * fps) === frame));
  
  const isWritingActive = useMemo(() => {
    const writing = activeBoardPoints.some(p => {
      const start = Math.round(p.startTime * fps);
      const end = Math.round(p.endTime * fps);
      return frame >= start && frame <= end;
    });
    if (writing) return true;

    return activeBoardPoints.some(p => {
      const focusStart = Math.round(p.focusStartTime * fps);
      return frame >= focusStart && frame <= (focusStart + 14);
    });
  }, [activeBoardPoints, frame, fps]);

  const isEraseFrame = useMemo(() => {
    const transitions = points
      .filter(p => (p.boardIndex ?? 0) > 0)
      .map(p => Math.round(p.startTime * fps) - 8);
    return transitions.includes(frame);
  }, [points, frame, fps]);

  return (
    <AbsoluteFill style={{background: '#0F172A'}}>
      {/* Board image container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: intro,
        transformOrigin: 'center 30%',
      }}>
        {imageError ? (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, #f8fafc 60%, #e2e8f0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.05)',
          }} />
        ) : (
          <Img
            src={boardImage}
            onError={() => setImageError(true)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        )}
      </div>

      {/* Structured Executive Writing Surface */}
      <div style={{
        position: 'absolute',
        top: board.safeZone.top,
        left: board.safeZone.left,
        right: board.safeZone.right,
        bottom: board.safeZone.bottom,
        overflow: 'hidden',
        zIndex: 10,
      }}>
        <div style={{
          width: `${100 / renderPlan.scale}%`,
          minHeight: `${100 / renderPlan.scale}%`,
          padding: '20px 16px',
          transform: `scale(${renderPlan.scale})`,
          transformOrigin: 'top left',
        }}>
          {/* Main Strategic Title */}
          <WritingLine
            text={renderPlan.title}
            startFrame={titleStartFrame}
            endFrame={titleEndFrame}
            color={titleColor || COLORS.title}
            fontSize={board.titleSize}
            fontWeight={800}
            isTitle
          />

          {/* Render Active Points inside Corporate Executive Cards */}
          {renderPlan.points.map((point, index) => {
            const bullet = point.bulletType === 'number'
              ? `${index + 1}`
              : BULLET_CHARS[point.bulletType] || '';
            const startFrame = Math.round(point.startTime * fps);
            const endFrame = Math.round(point.endTime * fps);

            return (
              <WritingLine
                key={`${point.startTime}-${index}`}
                text={point.displayText}
                startFrame={startFrame}
                endFrame={endFrame}
                focusStartTime={point.focusStartTime}
                focusEndTime={point.focusEndTime}
                color={point.markerColor || COLORS.blue}
                fontSize={board.pointSize}
                fontWeight={600}
                bulletPrefix={bullet}
                isHighlight={point.isHighlight}
                icon={point.icon || 'none'}
                pointIndex={index}
                focusType={point.focusType || 'circle'}
              />
            );
          })}

          {/* Action Conclusion Takeaway */}
          {renderPlan.conclusion && currentTime >= (conclusionTime || 0) - 1 && (
            <WritingLine
              text={renderPlan.conclusion}
              startFrame={Math.round((conclusionTime || 0) * fps)}
              endFrame={Math.round((conclusionTime || 0) * fps) + 24}
              color={COLORS.black}
              fontSize={board.conclusionSize}
              fontWeight={700}
              bulletPrefix="★"
            />
          )}
        </div>
      </div>

      {/* 🔊 HIGH-QUALITY CORPORATE SOUND DESIGN */}
      {isCapFrame && (
        <Audio 
          src={resolveAsset('assets/reusable/sound-effects/soft-click.wav')} 
          volume={0.4} 
        />
      )}

      {isWritingActive && (
        <Audio 
          src={resolveAsset('assets/reusable/sound-effects/pen-writing.wav')} 
          volume={0.65} 
        />
      )}

      {isEraseFrame && (
        <Audio 
          src={resolveAsset('assets/reusable/sound-effects/swipe-right.wav')} 
          volume={0.5} 
        />
      )}

      {/* Narration audio track */}
      {resolvedSrc && mediaType === 'audio' && (
        <Audio src={resolvedSrc} volume={sourceAudioVolume} startFrom={Math.round(mediaTrimStartSeconds * fps)} />
      )}
      {resolvedSrc && mediaType === 'video' && (
        <OffthreadVideo
          src={resolvedSrc}
          volume={sourceAudioVolume}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          style={{position: 'absolute', width: 0, height: 0, opacity: 0}}
        />
      )}
    </AbsoluteFill>
  );
}

// ── Composition ───────────────────────────────────────────────────────────────

const defaultProps: WhiteboardVideoProps = {
  mediaSrc: '',
  mediaType: 'audio',
  sourceAudioVolume: 1,
  durationSeconds: 30,
  title: 'Executive Strategy',
  titleColor: COLORS.title,
  points: [
    { text: 'Target the core growth bottleneck', startTime: 1.0, endTime: 1.8, focusStartTime: 2.0, focusEndTime: 7.5, markerColor: COLORS.blue, bulletType: 'number', icon: 'lightbulb', boardIndex: 0, focusType: 'circle' },
    { text: 'Validate key executive metrics', startTime: 1.4, endTime: 2.2, focusStartTime: 7.8, focusEndTime: 14.5, markerColor: COLORS.green, bulletType: 'number', icon: 'checkmark', boardIndex: 0, focusType: 'underline' },
    { text: 'Scale visual content distribution', startTime: 15.5, endTime: 16.3, focusStartTime: 16.5, focusEndTime: 22.0, markerColor: COLORS.red, bulletType: 'number', icon: 'arrow', boardIndex: 1, focusType: 'box' },
    { text: 'Establish automated workflow growth', startTime: 15.9, endTime: 16.7, focusStartTime: 22.5, focusEndTime: 28.0, markerColor: COLORS.blue, bulletType: 'number', icon: 'star', boardIndex: 1, focusType: 'arrow' },
  ],
  conclusion: 'Strategy alignment complete.',
  conclusionTime: 28.2,
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
