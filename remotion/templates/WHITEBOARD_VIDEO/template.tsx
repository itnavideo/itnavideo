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
  boardStyle?: 'mobile-stand' | 'conference' | 'dark-modern';
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
  cameraZoomMax: number;
};

const BOARD_CONFIGS: Record<string, BoardConfig> = {
  'mobile-stand': {
    image: 'assets/reusable/images/whiteboard-photo-hd.png',
    safeZone: { top: '12%', left: '12%', right: '12%', bottom: '22%' },
    titleSize: 54,
    pointSize: 32,
    conclusionSize: 36,
    cameraZoomMax: 1.15,
  },
  'conference': {
    image: 'assets/reusable/images/whiteboard-conference.png',
    safeZone: { top: '10%', left: '16%', right: '14%', bottom: '35%' },
    titleSize: 44,
    pointSize: 27,
    conclusionSize: 30,
    cameraZoomMax: 1.12,
  },
  'dark-modern': {
    image: 'assets/reusable/images/whiteboard-dark-modern.png',
    safeZone: { top: '14%', left: '14%', right: '14%', bottom: '38%' },
    titleSize: 42,
    pointSize: 26,
    conclusionSize: 29,
    cameraZoomMax: 1.10,
  },
  'outdoor-street': {
    image: 'assets/reusable/images/whiteboard-outdoor-street.png',
    safeZone: { top: '10%', left: '12%', right: '12%', bottom: '24%' },
    titleSize: 52,
    pointSize: 31,
    conclusionSize: 35,
    cameraZoomMax: 1.14,
  },
  'classroom': {
    image: 'assets/reusable/images/whiteboard-classroom.png',
    safeZone: { top: '12%', left: '16%', right: '14%', bottom: '40%' },
    titleSize: 42,
    pointSize: 26,
    conclusionSize: 29,
    cameraZoomMax: 1.10,
  },
  'coworking': {
    image: 'assets/reusable/images/whiteboard-coworking.png',
    safeZone: { top: '10%', left: '13%', right: '13%', bottom: '24%' },
    titleSize: 50,
    pointSize: 30,
    conclusionSize: 34,
    cameraZoomMax: 1.13,
  },
  'corporate-luxury': {
    image: 'assets/reusable/images/whiteboard-corporate-luxury.png',
    safeZone: { top: '9%', left: '12%', right: '12%', bottom: '22%' },
    titleSize: 52,
    pointSize: 31,
    conclusionSize: 35,
    cameraZoomMax: 1.14,
  },
  'person-writing': {
    image: 'assets/reusable/images/whiteboard-person-writing.png',
    safeZone: { top: '8%', left: '18%', right: '10%', bottom: '30%' },
    titleSize: 40,
    pointSize: 25,
    conclusionSize: 28,
    cameraZoomMax: 1.08,
  },
};

const DEFAULT_BOARD = 'mobile-stand';

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

// ── useWriteProgress Hook ─────────────────────────────────────────────────────

function useWriteProgress(text: string, startFrame: number, isTitle = false) {
  const frame = useCurrentFrame();
  const charsPerFrame = isTitle ? 0.7 : 1.1;
  const totalChars = text.length;
  const writeDurationFrames = Math.ceil(totalChars / charsPerFrame);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + writeDurationFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return {
    progress,
    visibleChars: Math.floor(totalChars * progress),
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
  const wp = useWriteProgress(text, startFrame, isTitle);

  // Fade in the whole line
  const opacity = interpolate(frame, [startFrame - 2, startFrame + 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (frame < startFrame - 2) return null;

  const displayText = text.slice(0, wp.visibleChars);

  return (
    <div style={{
      opacity,
      marginBottom: isTitle ? 24 : 14,
      display: 'flex',
      alignItems: 'flex-start',
    }}>
      {/* Doodle icon */}
      {icon && icon !== 'none' && (
        <DoodleIcon type={icon} color={color} startFrame={wp.endFrame + 2} size={fontSize * 0.72} />
      )}

      <div style={{ flex: 1 }}>
        <span style={{
          fontFamily: FONT_FAMILY,
          fontSize,
          fontWeight,
          color,
          lineHeight: 1.45,
          letterSpacing: isTitle ? -0.3 : 0.2,
        }}>
          {bulletPrefix && <span style={{ color: COLORS.grey, marginRight: 6 }}>{bulletPrefix}</span>}
          {displayText}
          {/* Pen cursor inline with text */}
          {wp.isWriting && <PenCursor color={color} visible />}
          {/* Blinking cursor when pen is gone */}
          {wp.isWriting && (
            <span style={{
              display: 'inline-block',
              width: 2.5,
              height: fontSize * 0.55,
              background: color,
              marginLeft: 1,
              verticalAlign: 'middle',
              opacity: Math.sin(frame * 0.4) > 0 ? 0.85 : 0.15,
            }} />
          )}
        </span>

        {/* Marker underline for title or highlighted points */}
        {isTitle && wp.isComplete && (
          <MarkerUnderline color={color} startFrame={wp.endFrame + 4} variant={0} />
        )}
        {isHighlight && !isTitle && wp.isComplete && (
          <MarkerUnderline color={color} startFrame={wp.endFrame + 2} variant={pointIndex % 3} />
        )}
      </div>
    </div>
  );
}

// ── Progress Indicator ────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 80,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 7,
      zIndex: 50,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i <= current ? 10 : 6,
          height: i <= current ? 10 : 6,
          borderRadius: '50%',
          background: i <= current ? '#22C55E' : 'rgba(255,255,255,0.25)',
          boxShadow: i <= current ? '0 0 8px rgba(34,197,94,0.6)' : 'none',
          transition: 'all 0.15s',
        }} />
      ))}
    </div>
  );
}

// ── Caption Bar ───────────────────────────────────────────────────────────────

function CaptionBar({ captions, accentColor }: { captions: Array<{ start: number; end: number; text: string }>; accentColor: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active = captions.find((c) => t >= c.start && t <= c.end);
  if (!active) return null;

  const entry = interpolate(t, [active.start, active.start + 0.12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute',
      bottom: 28,
      left: 20,
      right: 20,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 60,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(10,15,30,0.92), rgba(25,35,55,0.88))',
        backdropFilter: 'blur(14px)',
        borderRadius: 14,
        padding: '12px 22px',
        maxWidth: '96%',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
        transform: `scale(${0.92 + entry * 0.08})`,
        opacity: entry,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, flexShrink: 0, boxShadow: `0 0 10px ${accentColor}` }} />
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.35, textAlign: 'center' }}>
          {active.text}
        </span>
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
  durationSeconds = 45,
  title = 'Key Points',
  titleColor = COLORS.title,
  points = [],
  conclusion,
  conclusionTime,
  captions = [],
  captionPosition = 'bottom',
  boardStyle = 'mobile-stand',
}: WhiteboardVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const currentTime = frame / fps;

  // Resolve board config
  const board = BOARD_CONFIGS[boardStyle] || BOARD_CONFIGS[DEFAULT_BOARD];

  // ── Camera logic ────────────────────────────────────────────────────────────
  // Determine current point for camera focus and progress indicator
  const currentPointIndex = useMemo(() => {
    for (let i = points.length - 1; i >= 0; i--) {
      if (currentTime >= points[i].startTime - 0.3) return i;
    }
    return -1;
  }, [currentTime, points]);

  // Camera: gentle zoom that eases between points (top→center as we go down)
  const pointRatio = points.length > 1 ? Math.max(0, currentPointIndex) / (points.length - 1) : 0;
  const targetZoom = interpolate(pointRatio, [0, 1], [board.cameraZoomMax, 1.0]);
  const targetY = interpolate(pointRatio, [0, 1], [1.5, -1.5]);

  // Smooth camera via spring
  const cameraSpring = spring({ frame, fps, config: { damping: 40, mass: 1.5 }, durationInFrames: fps * 2 });
  const cameraZoom = interpolate(cameraSpring, [0, 1], [1.08, targetZoom]);
  const cameraTranslateY = targetY;

  // Intro entrance
  const introSpring = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const introY = interpolate(introSpring, [0, 1], [50, 0]);
  const introOpacity = interpolate(introSpring, [0, 1], [0, 1]);

  const currentAccent = (currentPointIndex >= 0 && points[currentPointIndex])
    ? points[currentPointIndex].markerColor
    : COLORS.blue;

  return (
    <AbsoluteFill style={{ background: '#111827' }}>
      {/* ── Whiteboard photo with camera transform ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        transform: `translateY(${introY + cameraTranslateY}px) scale(${cameraZoom})`,
        opacity: introOpacity,
        transformOrigin: 'center 30%',
        willChange: 'transform',
      }}>
        <Img
          src={staticFile(board.image)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* ── Text layer: INSIDE the board transform so text moves with camera ── */}
        <div style={{
          position: 'absolute',
          top: board.safeZone.top,
          left: board.safeZone.left,
          right: board.safeZone.right,
          bottom: board.safeZone.bottom,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '8px 4px',
        }}>
          {/* Title */}
          <WritingLine
            text={title}
            startFrame={Math.round(0.8 * fps)}
            color={titleColor || COLORS.title}
            fontSize={board.titleSize}
            fontWeight={700}
            isTitle
          />

          {/* Points */}
          {points.map((point, i) => {
            const bullet = point.bulletType === 'number'
              ? `${i + 1}. `
              : BULLET_CHARS[point.bulletType]
                ? `${BULLET_CHARS[point.bulletType]} `
                : '';

            return (
              <WritingLine
                key={i}
                text={point.text}
                startFrame={Math.round(point.startTime * fps)}
                color={point.markerColor || COLORS.blue}
                fontSize={board.pointSize}
                bulletPrefix={bullet}
                isHighlight={point.isHighlight}
                icon={point.icon || 'none'}
                pointIndex={i}
              />
            );
          })}

          {/* Conclusion */}
          {conclusion && conclusionTime && (
            <WritingLine
              text={conclusion}
              startFrame={Math.round(conclusionTime * fps)}
              color={COLORS.black}
              fontSize={board.conclusionSize}
              fontWeight={600}
              bulletPrefix="★ "
            />
          )}
        </div>
      </div>

      {/* Progress dots - outside camera transform */}
      {points.length > 0 && (
        <ProgressDots total={points.length} current={currentPointIndex} />
      )}

      {/* Captions - outside camera transform */}
      {captionPosition !== 'none' && captions.length > 0 && (
        <CaptionBar captions={captions} accentColor={currentAccent} />
      )}

      {/* Audio */}
      {resolvedSrc && mediaType === 'audio' && (
        <Audio src={resolvedSrc} volume={sourceAudioVolume} startFrom={Math.round(mediaTrimStartSeconds * fps)} />
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

// ── Composition ───────────────────────────────────────────────────────────────

const defaultProps: WhiteboardVideoProps = {
  mediaSrc: '',
  mediaType: 'audio',
  sourceAudioVolume: 1,
  durationSeconds: 45,
  title: '5 Startup Rules',
  titleColor: COLORS.title,
  points: [
    { text: 'Solve real problems first', startTime: 4, endTime: 9, markerColor: COLORS.blue, bulletType: 'number', icon: 'lightbulb' },
    { text: 'Ship fast iterate faster', startTime: 9, endTime: 15, markerColor: COLORS.green, bulletType: 'number', icon: 'arrow' },
    { text: 'Revenue before funding', startTime: 15, endTime: 21, markerColor: COLORS.red, bulletType: 'number', isHighlight: true, icon: 'star' },
    { text: 'Build tiny focused team', startTime: 21, endTime: 27, markerColor: COLORS.blue, bulletType: 'number', icon: 'checkmark' },
    { text: 'Talk to users daily', startTime: 27, endTime: 33, markerColor: COLORS.green, bulletType: 'number', icon: 'circle' },
  ],
  conclusion: 'Execute relentlessly!',
  conclusionTime: 36,
  captions: [
    { start: 1, end: 3.5, text: 'Here are five rules for startups' },
    { start: 4, end: 8, text: 'Number one: solve real problems' },
    { start: 9, end: 14, text: 'Ship fast and iterate faster' },
    { start: 15, end: 20, text: 'Revenue before funding always' },
    { start: 21, end: 26, text: 'Build a tiny focused team' },
    { start: 27, end: 32, text: 'Talk to users every single day' },
    { start: 36, end: 40, text: 'Execute relentlessly!' },
  ],
  whiteboardStyle: 'photo',
};

export { WhiteboardVideo };

export const WhiteboardVideoComposition = () => (
  <Composition
    id="WHITEBOARD-VIDEO"
    component={WhiteboardVideo}
    durationInFrames={1350}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as WhiteboardVideoProps;
      const dur = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 45
      ));
      return { durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920 };
    }}
  />
);
