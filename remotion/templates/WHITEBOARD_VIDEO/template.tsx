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

// ── Types ─────────────────────────────────────────────────────────────────────

type WhiteboardPoint = {
  text: string;
  startTime: number;
  endTime: number;
  markerColor: string;
  bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  isHighlight?: boolean;
  icon?: 'arrow' | 'checkmark' | 'lightbulb' | 'star' | 'circle' | 'none';
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
  /** Optional override for the board background image (used by the browser live preview,
   *  since public/assets board images are not deployed to Vercel). */
  boardImageUrl?: string;
  captions?: Array<{ start: number; end: number; text: string }>;
  captionPosition?: 'bottom' | 'none';
};

// ── Constants ─────────────────────────────────────────────────────────────────

const FONT_FAMILY = "'Kalam', cursive";

const COLORS = {
  title: '#1A1A2E',
  blue: '#2563EB',
  red: '#DC2626',
  green: '#16A34A',
  black: '#1F2937',
  grey: '#6B7280',
};

const BULLET_CHARS: Record<string, string> = {
  number: '',
  bullet: '•',
  check: '✓',
  arrow: '→',
  star: '★',
};

// ── Board Configurations ──────────────────────────────────────────────────────
// Each board has different image, safe zone (where text fits), and text sizing

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

// Each photo has a different writable area. Capacity is explicit so the renderer
// can adapt to the selected board instead of treating every image as identical.
const BOARD_CONFIGS: Record<string, BoardConfig> = {
  'mobile-stand': {
    image: 'assets/reusable/images/whiteboard-photo-hd.jpg',
    safeZone: { top: '12%', left: '12%', right: '12%', bottom: '22%' },
    titleSize: 54, pointSize: 32, conclusionSize: 36, maxPoints: 5, maxTextRows: 15, maxCharsPerLine: 31, cameraZoomMax: 1.025,
  },
  'conference': {
    image: 'assets/reusable/images/whiteboard-conference.jpg',
    safeZone: { top: '10%', left: '16%', right: '14%', bottom: '35%' },
    titleSize: 44, pointSize: 27, conclusionSize: 30, maxPoints: 4, maxTextRows: 13, maxCharsPerLine: 24, cameraZoomMax: 1.018,
  },
  'dark-modern': {
    image: 'assets/reusable/images/whiteboard-dark-modern.jpg',
    safeZone: { top: '14%', left: '14%', right: '14%', bottom: '38%' },
    titleSize: 42, pointSize: 26, conclusionSize: 29, maxPoints: 4, maxTextRows: 13, maxCharsPerLine: 25, cameraZoomMax: 1.016,
  },
  'outdoor-street': {
    image: 'assets/reusable/images/whiteboard-outdoor-street.jpg',
    safeZone: { top: '10%', left: '12%', right: '12%', bottom: '24%' },
    titleSize: 52, pointSize: 31, conclusionSize: 35, maxPoints: 5, maxTextRows: 14, maxCharsPerLine: 30, cameraZoomMax: 1.022,
  },
  'classroom': {
    image: 'assets/reusable/images/whiteboard-classroom.jpg',
    safeZone: { top: '12%', left: '16%', right: '14%', bottom: '40%' },
    titleSize: 42, pointSize: 26, conclusionSize: 29, maxPoints: 4, maxTextRows: 13, maxCharsPerLine: 24, cameraZoomMax: 1.016,
  },
  'coworking': {
    image: 'assets/reusable/images/whiteboard-coworking.jpg',
    safeZone: { top: '10%', left: '13%', right: '13%', bottom: '24%' },
    titleSize: 50, pointSize: 30, conclusionSize: 34, maxPoints: 5, maxTextRows: 15, maxCharsPerLine: 29, cameraZoomMax: 1.022,
  },
  'corporate-luxury': {
    image: 'assets/reusable/images/whiteboard-corporate-luxury.jpg',
    safeZone: { top: '9%', left: '12%', right: '12%', bottom: '22%' },
    titleSize: 48, pointSize: 30, conclusionSize: 34, maxPoints: 4, maxTextRows: 15, maxCharsPerLine: 28, cameraZoomMax: 1,
  },
  'person-writing': {
    image: 'assets/reusable/images/whiteboard-person-writing.jpg',
    safeZone: { top: '8%', left: '18%', right: '10%', bottom: '30%' },
    titleSize: 40, pointSize: 25, conclusionSize: 28, maxPoints: 4, maxTextRows: 12, maxCharsPerLine: 22, cameraZoomMax: 1.012,
  },
};

const DEFAULT_BOARD = 'corporate-luxury';

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

// ── Layout and writing helpers ───────────────────────────────────────────────

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
  const titleText = wrapWhiteboardText(title || 'Key Points', board.maxCharsPerLine, 2);
  // Icons and bullets reduce the usable row width. Plan against that actual width,
  // and cap legacy/manual props to the same density as the deterministic planner.
  const pointCharsPerLine = Math.max(16, board.maxCharsPerLine - 5);
  const displayPoints = points.slice(0, board.maxPoints).map((point) => {
    const displayText = wrapWhiteboardText(point.text, pointCharsPerLine, 2);
    return {...point, displayText, lineCount: countLines(displayText)};
  });
  const conclusionText = conclusion ? wrapWhiteboardText(conclusion, board.maxCharsPerLine, 1) : '';

  const usedRows = countLines(titleText) + 1 + displayPoints.reduce((total, point) => total + point.lineCount + 1, 0) + (conclusionText ? 2 : 0);
  const scale = Math.max(0.78, Math.min(1, board.maxTextRows / Math.max(board.maxTextRows, usedRows)));

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

function DoodleIcon({ type, color, startFrame, size = 26 }: { type: string; color: string; startFrame: number; size?: number }) {
  const frame = useCurrentFrame();
  const doodle = DOODLE_PATHS[type];
  if (!doodle) return null;

  const progress = interpolate(frame, [startFrame, startFrame + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (progress <= 0) return null;

  return (
    <svg width={size} height={size} viewBox={doodle.viewBox} style={{ flexShrink: 0, marginRight: 10, marginTop: 3 }}>
      <path
        d={doodle.path}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={doodle.len}
        strokeDashoffset={doodle.len * (1 - progress)}
      />
    </svg>
  );
}

// ── Marker Underline ──────────────────────────────────────────────────────────

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
    <svg width="100%" height={8} viewBox="0 0 240 8" preserveAspectRatio="none" style={{ marginTop: 2 }}>
      <path
        d={UNDERLINE_PATHS[variant % 3]}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - progress)}
        opacity={0.75}
      />
    </svg>
  );
}

// ── Pen Cursor Component ──────────────────────────────────────────────────────

function PenCursor({ color, visible }: { color: string; visible: boolean }) {
  const frame = useCurrentFrame();
  if (!visible) return null;

  const wobbleY = Math.sin(frame * 0.35) * 2;
  const wobbleR = Math.sin(frame * 0.2) * 4 - 12;

  return (
    <span style={{
      display: 'inline-block',
      width: 16,
      height: 40,
      marginLeft: 4,
      verticalAlign: 'top',
      transform: `translateY(${wobbleY - 20}px) rotate(${wobbleR}deg)`,
      transformOrigin: 'bottom center',
    }}>
      <svg width="16" height="40" viewBox="0 0 16 40">
        <rect x="3" y="0" width="10" height="26" rx="3" fill={color} opacity="0.9" />
        <rect x="2" y="22" width="12" height="4" rx="2" fill={color} opacity="0.6" />
        <polygon points="5,26 8,38 11,26" fill="#333" />
        <rect x="5" y="3" width="2.5" height="14" rx="1.5" fill="white" opacity="0.25" />
      </svg>
    </span>
  );
}

// ── Writing Text with Ink Reveal ──────────────────────────────────────────────

function WritingLine({
  text,
  startFrame,
  endFrame,
  color,
  fontSize,
  fontWeight = 400,
  isTitle = false,
  bulletPrefix = '',
  isHighlight = false,
  icon,
  pointIndex = 0,
}: {
  text: string;
  startFrame: number;
  endFrame: number;
  color: string;
  fontSize: number;
  fontWeight?: number;
  isTitle?: boolean;
  bulletPrefix?: string;
  isHighlight?: boolean;
  icon?: string;
  pointIndex?: number;
}) {
  const frame = useCurrentFrame();
  const wp = useWriteProgress(text, startFrame, endFrame);
  if (frame < startFrame - 2) return null;

  const opacity = interpolate(frame, [startFrame - 2, startFrame + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const displayText = text.slice(0, wp.visibleChars);
  const bulletOpacity = interpolate(wp.progress, [0, 0.12], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div style={{
      opacity,
      marginBottom: isTitle ? 22 : 12,
      display: 'flex',
      alignItems: 'flex-start',
      minWidth: 0,
    }}>
      {icon && icon !== 'none' ? (
        <DoodleIcon type={icon} color={color} startFrame={startFrame + 2} size={Math.max(18, fontSize * 0.68)} />
      ) : null}
      <div style={{flex: 1, minWidth: 0}}>
        <span style={{
          fontFamily: FONT_FAMILY,
          fontSize,
          fontWeight,
          color,
          lineHeight: isTitle ? 1.16 : 1.32,
          letterSpacing: isTitle ? -0.25 : 0.08,
          whiteSpace: 'pre-line',
          overflowWrap: 'anywhere',
          display: 'block',
        }}>
          {bulletPrefix ? <span style={{color: COLORS.grey, marginRight: 6, opacity: bulletOpacity}}>{bulletPrefix}</span> : null}
          {displayText}
          {wp.isWriting ? <PenCursor color={color} visible /> : null}
        </span>
        {isTitle && wp.isComplete ? <MarkerUnderline color={color} startFrame={wp.endFrame + 3} variant={0} /> : null}
        {isHighlight && !isTitle && wp.isComplete ? <MarkerUnderline color={color} startFrame={wp.endFrame + 2} variant={pointIndex % 3} /> : null}
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
  title = 'Key Points',
  titleColor = COLORS.title,
  points = [],
  conclusion,
  conclusionTime,
  boardStyle,
  boardImageUrl,
}: WhiteboardVideoProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const board = (boardStyle && BOARD_CONFIGS[boardStyle]) || BOARD_CONFIGS[DEFAULT_BOARD];
  const boardImage = boardImageUrl ? resolveAsset(boardImageUrl) : staticFile(board.image);
  const renderPlan = useMemo(
    () => createRenderPlan({title, points, conclusion, board}),
    [board, conclusion, points, title],
  );
  const titleStartFrame = Math.round(0.65 * fps);
  const firstPointStartFrame = renderPlan.points[0]
    ? Math.round(renderPlan.points[0].startTime * fps)
    : durationInFrames;
  const titleEndFrame = Math.max(
    titleStartFrame + 12,
    Math.min(titleStartFrame + Math.round(2.4 * fps), firstPointStartFrame - 4),
  );
  const intro = spring({frame, fps, config: {damping: 22, mass: 0.8}});
  const lastPointEnd = renderPlan.points.length
    ? renderPlan.points[renderPlan.points.length - 1].endTime
    : 2.5;
  const conclusionStartTime = Math.max(conclusionTime || 0, lastPointEnd + 0.55);

  return (
    <AbsoluteFill style={{background: '#111827'}}>
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: intro,
        transformOrigin: 'center 30%',
      }}>
        <Img src={boardImage} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>

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
          padding: '8px 4px',
          transform: `scale(${renderPlan.scale})`,
          transformOrigin: 'top left',
        }}>
          <WritingLine
            text={renderPlan.title}
            startFrame={titleStartFrame}
            endFrame={titleEndFrame}
            color={titleColor || COLORS.title}
            fontSize={board.titleSize}
            fontWeight={700}
            isTitle
          />

          {renderPlan.points.map((point, index) => {
            const bullet = point.bulletType === 'number'
              ? `${index + 1}. `
              : BULLET_CHARS[point.bulletType]
                ? `${BULLET_CHARS[point.bulletType]} `
                : '';
            const startFrame = Math.round(point.startTime * fps);
            const endFrame = Math.min(
              durationInFrames - 1,
              Math.max(startFrame + 12, Math.round(point.endTime * fps)),
            );

            return (
              <WritingLine
                key={`${point.startTime}-${index}`}
                text={point.displayText}
                startFrame={startFrame}
                endFrame={endFrame}
                color={point.markerColor || COLORS.blue}
                fontSize={board.pointSize}
                bulletPrefix={bullet}
                isHighlight={point.isHighlight}
                icon={point.icon || 'none'}
                pointIndex={index}
              />
            );
          })}

          {renderPlan.conclusion && (
            <WritingLine
              text={renderPlan.conclusion}
              startFrame={Math.min(durationInFrames - 1, Math.round(conclusionStartTime * fps))}
              endFrame={Math.max(
                Math.min(durationInFrames - 1, Math.round(conclusionStartTime * fps) + 12),
                durationInFrames - Math.round(0.45 * fps),
              )}
              color={COLORS.black}
              fontSize={board.conclusionSize}
              fontWeight={600}
              bulletPrefix="★ "
            />
          )}
        </div>
      </div>

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
  durationSeconds: 45,
  title: '5 Startup Rules',
  titleColor: COLORS.title,
  points: [
    { text: 'Solve real problems first', startTime: 4, endTime: 13, markerColor: COLORS.blue, bulletType: 'number', icon: 'lightbulb' },
    { text: 'Ship fast and iterate', startTime: 13, endTime: 23, markerColor: COLORS.green, bulletType: 'number', icon: 'arrow' },
    { text: 'Talk to users daily', startTime: 23, endTime: 33, markerColor: COLORS.red, bulletType: 'number', isHighlight: true, icon: 'checkmark' },
  ],
};

export { WhiteboardVideo };

export const WhiteboardVideoComposition = () => (
  <Composition
    id="WHITEBOARD-VIDEO"
    component={WhiteboardVideo}
    durationInFrames={2700}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as WhiteboardVideoProps;
      const dur = Math.max(8, Math.min(90,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 45
      ));
      return { durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920 };
    }}
  />
);
