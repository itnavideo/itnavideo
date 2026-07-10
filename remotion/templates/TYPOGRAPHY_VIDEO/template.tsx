import React from 'react';
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ── Types ─────────────────────────────────────────────────────────────────────

type KeywordHit = {
  word: string;
  start: number;
  end: number;
  color: string;
  size: 'huge' | 'large' | 'medium';
  position: 'top' | 'center' | 'bottom-mid';
};

type CaptionSegment = {
  start: number;
  end: number;
  text: string;
  words?: Array<{ word: string; start: number; end: number }>;
};

type TypographyVideoProps = {
  mediaSrc?: string;
  mediaType?: 'video';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  keywords?: KeywordHit[];
  captions?: CaptionSegment[];
  captionStyle?: string;
  typographyStyle?: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

// Typography style presets — maps to different visual treatments
const TYPOGRAPHY_STYLE_CONFIG: Record<string, {
  colors: string[];
  textShadow: string;
  fontWeight: number;
  textStroke?: string;
  gradient?: string;
}> = {
  'silver-chrome': {
    colors: ['rgba(248,250,252,0.85)', 'rgba(148,163,184,0.75)', 'rgba(203,213,225,0.8)'],
    textShadow: '0 4px 20px rgba(148,163,184,0.5), 0 2px 4px rgba(0,0,0,0.8)',
    fontWeight: 900,
    textStroke: '1px rgba(71,85,105,0.4)',
  },
  'neon-blue': {
    colors: ['rgba(147,197,253,0.9)', 'rgba(59,130,246,0.85)', 'rgba(96,165,250,0.9)'],
    textShadow: '0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.4), 0 4px 8px rgba(0,0,0,0.9)',
    fontWeight: 900,
  },
  'fire-orange': {
    colors: ['rgba(253,230,138,0.9)', 'rgba(249,115,22,0.9)', 'rgba(239,68,68,0.85)'],
    textShadow: '0 0 30px rgba(249,115,22,0.7), 0 4px 12px rgba(0,0,0,0.9)',
    fontWeight: 900,
  },
  'ice-white': {
    colors: ['rgba(255,255,255,0.9)', 'rgba(226,232,240,0.85)', 'rgba(248,250,252,0.9)'],
    textShadow: '0 2px 20px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.8)',
    fontWeight: 900,
  },
  'gold-luxury': {
    colors: ['rgba(253,230,138,0.9)', 'rgba(217,119,6,0.85)', 'rgba(245,158,11,0.9)'],
    textShadow: '0 4px 20px rgba(217,119,6,0.5), 0 2px 4px rgba(0,0,0,0.9)',
    fontWeight: 900,
  },
  'purple-haze': {
    colors: ['rgba(196,181,253,0.9)', 'rgba(139,92,246,0.85)', 'rgba(167,139,250,0.9)'],
    textShadow: '0 0 30px rgba(139,92,246,0.7), 0 4px 12px rgba(0,0,0,0.9)',
    fontWeight: 900,
  },
  'red-bold': {
    colors: ['rgba(252,165,165,0.9)', 'rgba(239,68,68,0.9)', 'rgba(220,38,38,0.85)'],
    textShadow: '0 0 20px rgba(239,68,68,0.6), 0 4px 8px rgba(0,0,0,0.9)',
    fontWeight: 900,
    textStroke: '1px rgba(127,29,29,0.5)',
  },
  'green-matrix': {
    colors: ['rgba(134,239,172,0.9)', 'rgba(34,197,94,0.85)', 'rgba(74,222,128,0.9)'],
    textShadow: '0 0 30px rgba(34,197,94,0.7), 0 0 60px rgba(34,197,94,0.3), 0 4px 8px rgba(0,0,0,0.9)',
    fontWeight: 900,
  },
};

const getStyleConfig = (styleId?: string) => TYPOGRAPHY_STYLE_CONFIG[styleId || 'silver-chrome'] || TYPOGRAPHY_STYLE_CONFIG['silver-chrome'];

const FONT_SIZES = {
  huge: 180,
  large: 130,
  medium: 95,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

// ── Sub-Components ────────────────────────────────────────────────────────────

function BigKeyword({ keyword, frame, fps, styleConfig }: { keyword: KeywordHit; frame: number; fps: number; styleConfig: typeof TYPOGRAPHY_STYLE_CONFIG[string] }) {
  const currentTime = frame / fps;

  // Only visible during keyword's time range
  if (currentTime < keyword.start || currentTime > keyword.end) return null;

  const localFrame = Math.round((currentTime - keyword.start) * fps);
  const duration = keyword.end - keyword.start;
  const durationFrames = Math.round(duration * fps);

  // Entrance: spring scale from 0.7 → 1
  const entranceProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 150 },
  });
  const scale = interpolate(entranceProgress, [0, 1], [0.7, 1]);
  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);

  // Exit: fade out in last 8 frames
  const exitStart = durationFrames - 8;
  const exitOpacity = localFrame > exitStart
    ? interpolate(localFrame, [exitStart, durationFrames], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  // Subtle float
  const floatY = Math.sin(localFrame * 0.06) * 3;

  const fontSize = FONT_SIZES[keyword.size] || FONT_SIZES.large;

  // Position mapping
  const topPosition = keyword.position === 'top' ? '12%'
    : keyword.position === 'center' ? '35%'
    : '50%';

  return (
    <div style={{
      position: 'absolute',
      top: topPosition,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
      opacity: opacity * exitOpacity,
      transform: `scale(${scale}) translateY(${floatY}px)`,
      transformOrigin: 'center center',
    }}>
      <span style={{
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize,
        fontWeight: styleConfig.fontWeight || 900,
        color: keyword.color || styleConfig.colors[0],
        letterSpacing: -2,
        lineHeight: 1,
        textAlign: 'center',
        textShadow: styleConfig.textShadow,
        WebkitTextStroke: styleConfig.textStroke || undefined,
        maxWidth: '90%',
        wordBreak: 'break-word',
      }}>
        {keyword.word}
      </span>
    </div>
  );
}

function CaptionOverlay({ captions, frame, fps }: { captions: CaptionSegment[]; frame: number; fps: number }) {
  const currentTime = frame / fps;
  const active = captions.find((c) => currentTime >= c.start && currentTime <= c.end);
  if (!active) return null;

  // Find active word
  const activeWord = active.words?.find((w) => currentTime >= w.start && currentTime <= w.end);

  return (
    <div style={{
      position: 'absolute',
      bottom: 140,
      left: 40,
      right: 40,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '85%',
      }}>
        {active.words?.length ? (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 38,
            fontWeight: 600,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.7)',
          }}>
            {active.words.map((w, i) => (
              <span
                key={i}
                style={{
                  color: activeWord && w.word === activeWord.word && w.start === activeWord.start
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.5)',
                  fontWeight: activeWord && w.word === activeWord.word && w.start === activeWord.start
                    ? 900
                    : 600,
                  transition: 'color 0.1s, font-weight 0.1s',
                }}
              >
                {w.word}{i < active.words!.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        ) : (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 38,
            fontWeight: 700,
            color: '#FFFFFF',
          }}>
            {active.text}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function TypographyVideo({
  mediaSrc = '',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  keywords = [],
  captions = [],
  typographyStyle = 'silver-chrome',
}: TypographyVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const styleConfig = getStyleConfig(typographyStyle);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Full-screen video */}
      {resolvedSrc && (
        <OffthreadVideo
          src={resolvedSrc}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          volume={sourceAudioVolume}
        />
      )}

      {/* Big keyword overlays — appear/disappear synced to speech */}
      {keywords.map((kw, i) => (
        <BigKeyword key={`${kw.word}-${i}`} keyword={kw} frame={frame} fps={fps} styleConfig={styleConfig} />
      ))}

      {/* Small captions at bottom */}
      {captions.length > 0 && (
        <CaptionOverlay captions={captions} frame={frame} fps={fps} />
      )}
    </AbsoluteFill>
  );
}

// ── Composition ───────────────────────────────────────────────────────────────

const defaultProps: TypographyVideoProps = {
  mediaSrc: '',
  mediaType: 'video',
  sourceAudioVolume: 1,
  durationSeconds: 30,
  keywords: [
    { word: '$17 M', start: 2, end: 5, color: 'rgba(148, 163, 184, 0.7)', size: 'huge', position: 'top' },
    { word: '$23 M', start: 8, end: 11, color: 'rgba(148, 163, 184, 0.7)', size: 'huge', position: 'top' },
    { word: 'roughly', start: 14, end: 16.5, color: 'rgba(148, 163, 184, 0.7)', size: 'large', position: 'center' },
    { word: 'SOLD', start: 19, end: 22, color: 'rgba(248, 250, 252, 0.8)', size: 'huge', position: 'top' },
  ],
  captions: [
    { start: 1, end: 5, text: 'I have sold seventeen million' },
    { start: 6, end: 11, text: 'twenty three million in total' },
    { start: 12, end: 17, text: 'roughly over my career' },
  ],
};

export { TypographyVideo };

export const TypographyVideoComposition = () => (
  <Composition
    id="TYPOGRAPHY-VIDEO"
    component={TypographyVideo}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as TypographyVideoProps;
      const dur = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return { durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920 };
    }}
  />
);
