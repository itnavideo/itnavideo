import React from 'react';
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
};

type WhiteboardSection = {
  heading?: string;
  headingColor?: string;
  points: WhiteboardPoint[];
  startTime: number;
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
  sections?: WhiteboardSection[];
  conclusion?: string;
  conclusionTime?: number;
  whiteboardStyle?: 'classic';
  captions?: Array<{ start: number; end: number; text: string }>;
  captionPosition?: 'bottom' | 'none';
};

// ── Constants ─────────────────────────────────────────────────────────────────

const FONT_FAMILY = "'Kalam', cursive";
const TITLE_SIZE = 62;
const HEADING_SIZE = 46;
const POINT_SIZE = 36;
const CONCLUSION_SIZE = 40;
const MAX_LINES_PER_BOARD = 8;

const COLORS = {
  title: '#1E3A5F',
  heading: '#1E40AF',
  blue: '#2563EB',
  red: '#DC2626',
  green: '#16A34A',
  black: '#1F2937',
  grey: '#6B7280',
  purple: '#7C3AED',
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

// ── Sub-Components ────────────────────────────────────────────────────────────

function CorporateBackground() {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.006) * 1.5;

  return (
    <AbsoluteFill>
      {/* Deep corporate gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(170deg, #0B1628 0%, #132038 30%, #1A2B4A 55%, #0F1B30 100%)',
      }} />

      {/* Subtle texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.015,
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      {/* Soft light from top */}
      <div style={{
        position: 'absolute', top: -100, left: '20%', width: '60%', height: 500,
        background: 'radial-gradient(ellipse, rgba(100,160,255,0.06) 0%, transparent 65%)',
        filter: 'blur(40px)',
        transform: `translateY(${drift}px)`,
      }} />

      {/* Bottom ambient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 300,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
      }} />
    </AbsoluteFill>
  );
}

function WhiteboardBoard({ children }: { children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 20, mass: 0.7 } });
  const scale = interpolate(entrance, [0, 1], [0.94, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div style={{
      position: 'absolute',
      top: 70,
      left: 36,
      right: 36,
      bottom: 130,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
    }}>
      {/* Drop shadow */}
      <div style={{
        position: 'absolute', inset: -6, borderRadius: 18,
        background: 'rgba(0,0,0,0.35)', filter: 'blur(28px)',
      }} />

      {/* White board surface */}
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        background: 'linear-gradient(178deg, #FFFFFF 0%, #FAFBFC 40%, #F5F7FA 100%)',
        borderRadius: 12,
        border: '2.5px solid #D1D5DB',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 #FFFFFF',
        overflow: 'hidden',
      }}>
        {/* Faint horizontal ruled lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 62px, #64748B 62px, #64748B 63px)',
          backgroundPosition: '0 55px',
        }} />

        {/* Left red margin line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 58,
          width: 1.5, background: 'rgba(220,38,38,0.15)',
        }} />

        {/* Slight whiteboard reflection */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
          opacity: 0.3,
        }} />

        {/* Content area with padding */}
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          padding: '48px 40px 40px 76px',
          display: 'flex', flexDirection: 'column',
        }}>
          {children}
        </div>
      </div>

      {/* Board frame clips (metal) */}
      <div style={{ position: 'absolute', top: -4, left: '20%', width: 40, height: 10, background: 'linear-gradient(180deg, #9CA3AF, #6B7280)', borderRadius: '0 0 4px 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
      <div style={{ position: 'absolute', top: -4, right: '20%', width: 40, height: 10, background: 'linear-gradient(180deg, #9CA3AF, #6B7280)', borderRadius: '0 0 4px 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />

      {/* Marker tray at bottom */}
      <div style={{
        position: 'absolute', bottom: -18, left: '15%', right: '15%', height: 14,
        background: 'linear-gradient(180deg, #E5E7EB, #D1D5DB)',
        borderRadius: '0 0 6px 6px',
        boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 2,
      }}>
        {[COLORS.blue, COLORS.red, COLORS.green, COLORS.black].map((c) => (
          <div key={c} style={{ width: 28, height: 5, borderRadius: 3, background: c, opacity: 0.7 }} />
        ))}
      </div>
    </div>
  );
}

function WritingText({
  text,
  startFrame,
  color,
  fontSize,
  fontWeight = 400,
  isTitle = false,
  bulletPrefix = '',
  isHighlight = false,
}: {
  text: string;
  startFrame: number;
  color: string;
  fontSize: number;
  fontWeight?: number;
  isTitle?: boolean;
  bulletPrefix?: string;
  isHighlight?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate write speed based on text length (shorter = faster)
  const charSpeed = isTitle ? 2.0 : 1.8;
  const writeDuration = Math.min(text.length * charSpeed, fps * 1.5);
  const progress = interpolate(
    frame, [startFrame, startFrame + writeDuration], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const lineOpacity = interpolate(
    frame, [startFrame - 1, startFrame + 3], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  if (frame < startFrame - 1) return null;

  const visibleChars = Math.floor(text.length * progress);
  const displayText = text.slice(0, visibleChars);
  const fullText = bulletPrefix + displayText;

  return (
    <div style={{
      opacity: lineOpacity,
      marginBottom: isTitle ? 24 : 14,
      minHeight: fontSize * 1.4,
    }}>
      <span style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.35,
        letterSpacing: isTitle ? -0.3 : 0.2,
        textDecoration: isHighlight ? 'underline' : 'none',
        textDecorationColor: isHighlight ? `${color}66` : undefined,
        textUnderlineOffset: '4px',
      }}>
        {bulletPrefix && <span style={{ color: COLORS.grey, marginRight: 6 }}>{bulletPrefix}</span>}
        {displayText}
        {/* Writing cursor */}
        {progress > 0 && progress < 1 && (
          <span style={{
            display: 'inline-block', width: 2.5, height: fontSize * 0.65,
            background: color, marginLeft: 2, verticalAlign: 'middle',
            opacity: Math.sin(frame * 0.35) > 0 ? 0.8 : 0,
          }} />
        )}
      </span>

      {/* Title underline animation */}
      {isTitle && progress >= 1 && (
        <div style={{
          marginTop: 6, height: 3.5, borderRadius: 2,
          background: `linear-gradient(90deg, ${color} 0%, ${color}66 70%, transparent 100%)`,
          width: '85%',
        }} />
      )}
    </div>
  );
}

function CaptionBar({ captions, frame, fps }: { captions: Array<{ start: number; end: number; text: string }>; frame: number; fps: number }) {
  const currentTime = frame / fps;
  const active = captions.find((c) => currentTime >= c.start && currentTime <= c.end);
  if (!active) return null;

  return (
    <div style={{
      position: 'absolute', bottom: 40, left: 32, right: 32,
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
        borderRadius: 10, padding: '10px 22px', maxWidth: '92%',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 30, fontWeight: 700, color: '#FFFFFF',
          textAlign: 'center', display: 'block', lineHeight: 1.3,
        }}>
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
  title = 'Key Points',
  titleColor = COLORS.title,
  points = [],
  conclusion,
  conclusionTime,
  captions = [],
  captionPosition = 'bottom',
}: WhiteboardVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);

  return (
    <AbsoluteFill>
      <CorporateBackground />

      <WhiteboardBoard>
        {/* Title */}
        <WritingText
          text={title}
          startFrame={Math.round(0.8 * fps)}
          color={titleColor || COLORS.title}
          fontSize={TITLE_SIZE}
          fontWeight={700}
          isTitle
        />

        {/* Points */}
        {points.map((point, index) => {
          const bulletPrefix = point.bulletType === 'number'
            ? `${index + 1}. `
            : BULLET_CHARS[point.bulletType]
              ? `${BULLET_CHARS[point.bulletType]} `
              : '';

          return (
            <WritingText
              key={index}
              text={point.text}
              startFrame={Math.round(point.startTime * fps)}
              color={point.markerColor || COLORS.blue}
              fontSize={POINT_SIZE}
              bulletPrefix={bulletPrefix}
              isHighlight={point.isHighlight}
            />
          );
        })}

        {/* Conclusion */}
        {conclusion && conclusionTime && (
          <WritingText
            text={conclusion}
            startFrame={Math.round(conclusionTime * fps)}
            color={COLORS.black}
            fontSize={CONCLUSION_SIZE}
            fontWeight={600}
            bulletPrefix="★ "
          />
        )}
      </WhiteboardBoard>

      {/* Captions */}
      {captionPosition !== 'none' && captions.length > 0 && (
        <CaptionBar captions={captions} frame={frame} fps={fps} />
      )}

      {/* Audio playback */}
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
  title: 'Meta Ads Playbook',
  titleColor: COLORS.title,
  points: [
    { text: 'Right campaign structure', startTime: 4, endTime: 9, markerColor: COLORS.blue, bulletType: 'number' },
    { text: 'Scale winners consistently', startTime: 9, endTime: 15, markerColor: COLORS.green, bulletType: 'number' },
    { text: 'Avoid common mistakes', startTime: 15, endTime: 21, markerColor: COLORS.red, bulletType: 'number', isHighlight: true },
    { text: 'Reinvest profit smartly', startTime: 21, endTime: 27, markerColor: COLORS.blue, bulletType: 'number' },
    { text: 'Test multiple angles', startTime: 27, endTime: 33, markerColor: COLORS.green, bulletType: 'number' },
  ],
  conclusion: 'Scale with confidence!',
  conclusionTime: 36,
  captions: [],
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
