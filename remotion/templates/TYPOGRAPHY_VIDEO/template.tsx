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
  'cyan-electric': {
    colors: ['rgba(165,243,252,0.9)', 'rgba(6,182,212,0.9)', 'rgba(34,211,238,0.85)'],
    textShadow: '0 0 30px rgba(6,182,212,0.8), 0 0 60px rgba(6,182,212,0.35), 0 4px 8px rgba(0,0,0,0.9)',
    fontWeight: 900,
  },
  'pink-neon': {
    colors: ['rgba(251,191,236,0.9)', 'rgba(236,72,153,0.9)', 'rgba(244,114,182,0.85)'],
    textShadow: '0 0 30px rgba(236,72,153,0.8), 0 0 50px rgba(236,72,153,0.35), 0 4px 8px rgba(0,0,0,0.9)',
    fontWeight: 900,
  },
  'yellow-bold': {
    colors: ['rgba(254,249,195,0.95)', 'rgba(250,204,21,0.9)', 'rgba(253,224,71,0.92)'],
    textShadow: '0 2px 12px rgba(250,204,21,0.5), 0 4px 8px rgba(0,0,0,0.9)',
    fontWeight: 900,
    textStroke: '1.5px rgba(113,63,18,0.5)',
  },
  'sunset-gradient': {
    colors: ['rgba(253,164,175,0.9)', 'rgba(244,114,182,0.85)', 'rgba(249,115,22,0.9)'],
    textShadow: '0 0 25px rgba(244,114,182,0.6), 0 4px 12px rgba(0,0,0,0.9)',
    fontWeight: 900,
  },
  'outline-white': {
    colors: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.05)'],
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
    fontWeight: 900,
    textStroke: '2.5px rgba(255,255,255,0.9)',
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

// ── Animation types for variety ────────────────────────────────────────────────

type AnimationType = 'pop' | 'slideUp' | 'zoomBlur' | 'shake' | 'flipIn';

const ANIMATION_SEQUENCE: AnimationType[] = ['pop', 'slideUp', 'zoomBlur', 'shake', 'flipIn'];

// ── Sub-Components ────────────────────────────────────────────────────────────

function BigKeyword({ keyword, frame, fps, styleConfig, index }: { keyword: KeywordHit; frame: number; fps: number; styleConfig: typeof TYPOGRAPHY_STYLE_CONFIG[string]; index: number }) {
  const currentTime = frame / fps;

  // Only visible during keyword's time range
  if (currentTime < keyword.start || currentTime > keyword.end) return null;

  const localFrame = Math.round((currentTime - keyword.start) * fps);
  const duration = keyword.end - keyword.start;
  const durationFrames = Math.round(duration * fps);

  // Pick animation type based on index (cycles through all types)
  const animType = ANIMATION_SEQUENCE[index % ANIMATION_SEQUENCE.length];

  // === ENTRANCE ANIMATIONS ===
  let scale = 1;
  let opacity = 1;
  let translateY = 0;
  let translateX = 0;
  let rotateX = 0;
  let blur = 0;

  const entranceSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 180 },
  });

  switch (animType) {
    case 'pop':
      // Dramatic zoom: 1.6 → 1 with overshoot
      scale = interpolate(entranceSpring, [0, 1], [1.6, 1]);
      opacity = interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
      break;
    case 'slideUp':
      // Slide from bottom with spring
      translateY = interpolate(entranceSpring, [0, 1], [80, 0]);
      opacity = interpolate(localFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
      scale = interpolate(entranceSpring, [0, 1], [0.9, 1]);
      break;
    case 'zoomBlur':
      // Start blurred and large, sharpen to normal
      scale = interpolate(entranceSpring, [0, 1], [2.0, 1]);
      blur = interpolate(localFrame, [0, 10], [12, 0], { extrapolateRight: 'clamp' });
      opacity = interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });
      break;
    case 'shake':
      // Pop in with shake vibration
      scale = interpolate(entranceSpring, [0, 1], [0.5, 1]);
      opacity = interpolate(localFrame, [0, 3], [0, 1], { extrapolateRight: 'clamp' });
      // Shake for first 8 frames
      if (localFrame < 8) {
        translateX = Math.sin(localFrame * 3) * (8 - localFrame) * 1.5;
      }
      break;
    case 'flipIn':
      // 3D flip from top
      rotateX = interpolate(entranceSpring, [0, 1], [-90, 0]);
      opacity = interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
      scale = interpolate(entranceSpring, [0, 1], [0.8, 1]);
      break;
  }

  // === EXIT: fade + slight scale down ===
  const exitStart = durationFrames - 6;
  const exitProgress = localFrame > exitStart
    ? interpolate(localFrame, [exitStart, durationFrames], [0, 1], { extrapolateRight: 'clamp' })
    : 0;
  const exitOpacity = 1 - exitProgress;
  const exitScale = 1 - exitProgress * 0.15;

  // === Continuous subtle motion (while visible) ===
  const floatY = Math.sin(localFrame * 0.05) * 2;
  const breatheScale = 1 + Math.sin(localFrame * 0.04) * 0.008;

  const fontSize = FONT_SIZES[keyword.size] || FONT_SIZES.large;

  // Position mapping
  const topPosition = keyword.position === 'top' ? '12%'
    : keyword.position === 'center' ? '35%'
    : '50%';

  const finalScale = scale * exitScale * breatheScale;
  const finalOpacity = opacity * exitOpacity;
  const finalY = translateY + floatY;

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
      opacity: finalOpacity,
      transform: `scale(${finalScale}) translateY(${finalY}px) translateX(${translateX}px) perspective(800px) rotateX(${rotateX}deg)`,
      transformOrigin: 'center center',
      filter: blur > 0 ? `blur(${blur}px)` : undefined,
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
        <BigKeyword key={`${kw.word}-${i}`} keyword={kw} frame={frame} fps={fps} styleConfig={styleConfig} index={i} />
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
