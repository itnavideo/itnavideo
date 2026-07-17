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
import {PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock} from '../../components/PremiumAudioLayer';
import {PremiumVisualTreatment, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';
import {SubtitleRenderer} from '../../components/SubtitleRenderer';
import type {CaptionSegment, SubtitleConfig} from '../../types/subtitles';
import {resolveFont} from '../../utils/fonts';
import {mapCaptionStyle, getCaptionFont} from '../../utils/captionStyleMap';

// ── Types ─────────────────────────────────────────────────────────────────────

type KeywordHit = {
  word: string;
  start: number;
  end: number;
  color: string;
  size: 'huge' | 'large' | 'medium';
  position: 'top' | 'center' | 'bottom-mid';
  emphasis?: 'headline' | 'support';
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
  typographyStyle?: string;
  // Caption controls (bottom speech captions — reuses the shared SubtitleRenderer)
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  fontSize?: SubtitleConfig['fontSize'];
  fontFamily?: string;
  showBackground?: boolean;
  showCaptions?: boolean;
  // Premium cinematic treatment — color grade, vignette, grain, SFX
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock;
  soundCues?: PremiumSoundCue[];
};

// ── Premium style presets ───────────────────────────────────────────────────────
// Each preset pairs a luxury/editorial display font for the big headline with a
// matching cinematic color grade (filter + vignette + grain) and an accent color
// used for the underline treatment and caption highlight — so the whole render
// (text, grade, captions) feels like one designed world instead of a random mix.

type TypographyStyleConfig = {
  colors: string[];
  textShadow: string;
  fontWeight: number;
  textStroke?: string;
  headlineFont: string;
  letterSpacing: number;
  accentColor: string;
  colorGrade: {
    filter: string;
    overlayColor: string;
    overlayOpacity: number;
    grainOpacity: number;
    vignetteOpacity: number;
  };
  kenBurnsIntensity: number;
};

const TYPOGRAPHY_STYLE_CONFIG: Record<string, TypographyStyleConfig> = {
  'silver-chrome': {
    colors: ['rgba(248,250,252,0.9)', 'rgba(148,163,184,0.8)', 'rgba(226,232,240,0.85)'],
    textShadow: '0 6px 26px rgba(15,23,42,0.55), 0 2px 4px rgba(0,0,0,0.8)',
    fontWeight: 700,
    headlineFont: 'Bodoni Moda',
    letterSpacing: 0.5,
    accentColor: '#CBD5E1',
    colorGrade: {filter: 'contrast(1.08) saturate(0.88) brightness(0.97)', overlayColor: '#0F172A', overlayOpacity: 0.14, grainOpacity: 0.045, vignetteOpacity: 0.26},
    kenBurnsIntensity: 0.016,
  },
  'neon-blue': {
    colors: ['rgba(191,219,254,0.92)', 'rgba(59,130,246,0.88)', 'rgba(147,197,253,0.9)'],
    textShadow: '0 0 34px rgba(37,99,235,0.5), 0 6px 14px rgba(0,0,0,0.85)',
    fontWeight: 600,
    headlineFont: 'Cinzel',
    letterSpacing: 1.5,
    accentColor: '#3B82F6',
    colorGrade: {filter: 'contrast(1.1) saturate(0.9) brightness(0.96)', overlayColor: '#0B1F3A', overlayOpacity: 0.16, grainOpacity: 0.04, vignetteOpacity: 0.28},
    kenBurnsIntensity: 0.018,
  },
  'fire-orange': {
    colors: ['rgba(254,215,170,0.92)', 'rgba(249,115,22,0.9)', 'rgba(253,186,116,0.9)'],
    textShadow: '0 6px 26px rgba(154,52,18,0.5), 0 2px 6px rgba(0,0,0,0.85)',
    fontWeight: 600,
    headlineFont: 'Marcellus',
    letterSpacing: 0.8,
    accentColor: '#F97316',
    colorGrade: {filter: 'contrast(1.1) saturate(1.02) sepia(0.06) brightness(0.97)', overlayColor: '#7C2D12', overlayOpacity: 0.12, grainOpacity: 0.05, vignetteOpacity: 0.27},
    kenBurnsIntensity: 0.017,
  },
  'ice-white': {
    colors: ['rgba(255,255,255,0.95)', 'rgba(226,232,240,0.9)', 'rgba(248,250,252,0.92)'],
    textShadow: '0 4px 24px rgba(255,255,255,0.22), 0 4px 10px rgba(0,0,0,0.75)',
    fontWeight: 500,
    headlineFont: 'Tenor Sans',
    letterSpacing: 2,
    accentColor: '#F8FAFC',
    colorGrade: {filter: 'contrast(1.05) saturate(0.85) brightness(1.03)', overlayColor: '#F8FAFC', overlayOpacity: 0.04, grainOpacity: 0.03, vignetteOpacity: 0.16},
    kenBurnsIntensity: 0.012,
  },
  'gold-luxury': {
    colors: ['rgba(253,230,138,0.92)', 'rgba(217,119,6,0.88)', 'rgba(245,158,11,0.9)'],
    textShadow: '0 6px 28px rgba(120,53,15,0.55), 0 2px 6px rgba(0,0,0,0.9)',
    fontWeight: 600,
    headlineFont: 'Playfair Display',
    letterSpacing: 0.6,
    accentColor: '#D9A441',
    colorGrade: {filter: 'contrast(1.1) saturate(0.92) sepia(0.1) brightness(0.95)', overlayColor: '#78350F', overlayOpacity: 0.12, grainOpacity: 0.05, vignetteOpacity: 0.3},
    kenBurnsIntensity: 0.015,
  },
  'purple-haze': {
    colors: ['rgba(221,214,254,0.92)', 'rgba(139,92,246,0.88)', 'rgba(196,181,253,0.9)'],
    textShadow: '0 0 32px rgba(109,40,217,0.5), 0 6px 14px rgba(0,0,0,0.85)',
    fontWeight: 600,
    headlineFont: 'Cinzel',
    letterSpacing: 1.4,
    accentColor: '#8B5CF6',
    colorGrade: {filter: 'contrast(1.08) saturate(0.9) brightness(0.96)', overlayColor: '#3B0764', overlayOpacity: 0.14, grainOpacity: 0.045, vignetteOpacity: 0.28},
    kenBurnsIntensity: 0.017,
  },
  'red-bold': {
    colors: ['rgba(254,202,202,0.92)', 'rgba(220,38,38,0.9)', 'rgba(248,113,113,0.9)'],
    textShadow: '0 6px 26px rgba(127,29,29,0.55), 0 2px 6px rgba(0,0,0,0.85)',
    fontWeight: 700,
    headlineFont: 'Bodoni Moda',
    letterSpacing: 0.4,
    accentColor: '#DC2626',
    colorGrade: {filter: 'contrast(1.12) saturate(0.95) brightness(0.95)', overlayColor: '#450A0A', overlayOpacity: 0.14, grainOpacity: 0.045, vignetteOpacity: 0.3},
    kenBurnsIntensity: 0.017,
  },
  'green-matrix': {
    colors: ['rgba(187,247,208,0.92)', 'rgba(22,163,74,0.88)', 'rgba(134,239,172,0.9)'],
    textShadow: '0 6px 26px rgba(20,83,45,0.5), 0 2px 6px rgba(0,0,0,0.85)',
    fontWeight: 600,
    headlineFont: 'Marcellus',
    letterSpacing: 0.8,
    accentColor: '#22C55E',
    colorGrade: {filter: 'contrast(1.08) saturate(0.9) brightness(0.97)', overlayColor: '#052E16', overlayOpacity: 0.13, grainOpacity: 0.04, vignetteOpacity: 0.26},
    kenBurnsIntensity: 0.016,
  },
  'cyan-electric': {
    colors: ['rgba(207,250,254,0.92)', 'rgba(8,145,178,0.9)', 'rgba(103,232,249,0.9)'],
    textShadow: '0 0 30px rgba(6,182,212,0.45), 0 6px 14px rgba(0,0,0,0.85)',
    fontWeight: 500,
    headlineFont: 'Tenor Sans',
    letterSpacing: 1.8,
    accentColor: '#06B6D4',
    colorGrade: {filter: 'contrast(1.1) saturate(0.95) brightness(0.96)', overlayColor: '#083344', overlayOpacity: 0.14, grainOpacity: 0.04, vignetteOpacity: 0.28},
    kenBurnsIntensity: 0.018,
  },
  'pink-neon': {
    colors: ['rgba(253,224,240,0.92)', 'rgba(219,39,119,0.88)', 'rgba(244,114,182,0.9)'],
    textShadow: '0 6px 26px rgba(131,24,67,0.5), 0 2px 6px rgba(0,0,0,0.85)',
    fontWeight: 600,
    headlineFont: 'Playfair Display',
    letterSpacing: 0.6,
    accentColor: '#DB2777',
    colorGrade: {filter: 'contrast(1.08) saturate(0.95) sepia(0.04) brightness(0.97)', overlayColor: '#500724', overlayOpacity: 0.12, grainOpacity: 0.045, vignetteOpacity: 0.27},
    kenBurnsIntensity: 0.016,
  },
  'yellow-bold': {
    colors: ['rgba(254,249,195,0.95)', 'rgba(202,138,4,0.9)', 'rgba(250,204,21,0.92)'],
    textShadow: '0 4px 22px rgba(133,77,14,0.5), 0 2px 6px rgba(0,0,0,0.85)',
    fontWeight: 600,
    headlineFont: 'Cinzel',
    letterSpacing: 1.2,
    accentColor: '#CA8A04',
    colorGrade: {filter: 'contrast(1.08) saturate(0.9) sepia(0.08) brightness(0.97)', overlayColor: '#422006', overlayOpacity: 0.12, grainOpacity: 0.045, vignetteOpacity: 0.28},
    kenBurnsIntensity: 0.016,
  },
  'sunset-gradient': {
    colors: ['rgba(254,205,211,0.92)', 'rgba(236,72,153,0.85)', 'rgba(249,115,22,0.9)'],
    textShadow: '0 6px 26px rgba(157,23,77,0.45), 0 2px 6px rgba(0,0,0,0.85)',
    fontWeight: 600,
    headlineFont: 'Marcellus',
    letterSpacing: 0.8,
    accentColor: '#F472B6',
    colorGrade: {filter: 'contrast(1.08) saturate(0.98) sepia(0.05) brightness(0.97)', overlayColor: '#4A044E', overlayOpacity: 0.12, grainOpacity: 0.045, vignetteOpacity: 0.27},
    kenBurnsIntensity: 0.016,
  },
  'outline-white': {
    colors: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.06)'],
    textShadow: '0 3px 10px rgba(0,0,0,0.55)',
    fontWeight: 600,
    headlineFont: 'Tenor Sans',
    letterSpacing: 2.4,
    textStroke: '2px rgba(255,255,255,0.92)',
    accentColor: '#F8FAFC',
    colorGrade: {filter: 'contrast(1.06) saturate(0.85) brightness(0.98)', overlayColor: '#0F172A', overlayOpacity: 0.1, grainOpacity: 0.04, vignetteOpacity: 0.24},
    kenBurnsIntensity: 0.015,
  },
};

const getStyleConfig = (styleId?: string) => TYPOGRAPHY_STYLE_CONFIG[styleId || 'silver-chrome'] || TYPOGRAPHY_STYLE_CONFIG['silver-chrome'];

/**
 * Keeps the big headline out of the caption's vertical band so the two never
 * physically overlap. Only matters when captions are visible.
 */
function resolveKeywordPosition(
  position: KeywordHit['position'],
  captionPosition: 'bottom' | 'center' | 'top',
  hasCaptions: boolean,
): KeywordHit['position'] {
  if (!hasCaptions) return position;
  if (captionPosition === 'top' && position === 'top') return 'center';
  if (captionPosition === 'center' && (position === 'center' || position === 'bottom-mid')) return 'top';
  if (captionPosition === 'bottom' && position === 'bottom-mid') return 'center';
  return position;
}

const FONT_SIZES = {
  huge: 172,
  large: 122,
  medium: 88,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

/** Scales the headline font size down for long words/phrases so text never overflows the safe frame. */
function getResponsiveHeadlineSize(text: string, baseFontSize: number): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const longestWord = words.reduce((max, w) => Math.max(max, w.length), 0);
  const totalChars = text.length;
  let scale = 1;
  if (longestWord >= 14) scale *= 0.62;
  else if (longestWord >= 10) scale *= 0.78;
  else if (longestWord >= 8) scale *= 0.9;
  if (totalChars >= 26) scale *= 0.72;
  else if (totalChars >= 18) scale *= 0.85;
  return Math.max(46, Math.round(baseFontSize * scale));
}

function normalizeCaptions(captions: CaptionSegment[] = []): CaptionSegment[] {
  return captions
    .map((caption) => ({
      start: Number(caption.start ?? 0),
      end: Number(caption.end ?? (caption.start ?? 0) + 2.5),
      text: String(caption.text || ''),
      words: Array.isArray(caption.words)
        ? caption.words.map((word) => ({
            word: String(word.word || ''),
            start: Number(word.start ?? 0),
            end: Number(word.end ?? 0),
          }))
        : undefined,
    }))
    .filter((caption) => caption.text.trim());
}

// ── Elegant entrance animations ─────────────────────────────────────────────────
// Four editorial-grade reveal styles — no cheap shake/glitch, everything reads as
// a deliberate cinematic title card cut. Cycled by keyword index for rhythm.

type AnimationType = 'fadeRise' | 'scaleIn' | 'trackingIn' | 'wipeReveal';

const ANIMATION_SEQUENCE: AnimationType[] = ['fadeRise', 'scaleIn', 'trackingIn', 'wipeReveal'];

// ── Sub-Components ────────────────────────────────────────────────────────────

function BigKeyword({keyword, frame, fps, styleConfig, index}: {keyword: KeywordHit; frame: number; fps: number; styleConfig: TypographyStyleConfig; index: number}) {
  const currentTime = frame / fps;
  if (currentTime < keyword.start || currentTime > keyword.end) return null;

  const localFrame = Math.round((currentTime - keyword.start) * fps);
  const duration = keyword.end - keyword.start;
  const durationFrames = Math.round(duration * fps);
  const animType = ANIMATION_SEQUENCE[index % ANIMATION_SEQUENCE.length];

  let scale = 1;
  let opacity = 1;
  let translateY = 0;
  let letterSpacingExtra = 0;
  let clipRight = 0;

  const revealSpring = spring({
    frame: localFrame,
    fps,
    config: {damping: 16, mass: 0.6, stiffness: 130},
  });

  switch (animType) {
    case 'fadeRise':
      translateY = interpolate(revealSpring, [0, 1], [26, 0]);
      opacity = interpolate(localFrame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
      break;
    case 'scaleIn':
      scale = interpolate(revealSpring, [0, 1], [1.12, 1]);
      opacity = interpolate(localFrame, [0, 9], [0, 1], {extrapolateRight: 'clamp'});
      break;
    case 'trackingIn':
      letterSpacingExtra = interpolate(revealSpring, [0, 1], [18, 0]);
      opacity = interpolate(localFrame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
      break;
    case 'wipeReveal':
      clipRight = interpolate(revealSpring, [0, 1], [100, 0]);
      opacity = interpolate(localFrame, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
      break;
  }

  // Elegant exit — soft fade, no scale punch
  const exitStart = durationFrames - 11;
  const exitProgress = localFrame > exitStart
    ? interpolate(localFrame, [exitStart, durationFrames], [0, 1], {extrapolateRight: 'clamp'})
    : 0;
  const exitOpacity = 1 - exitProgress * 0.92;
  const exitTranslateY = -exitProgress * 10;

  // Very subtle continuous life — calm, not jittery
  const floatY = Math.sin(localFrame * 0.045) * 1.4;
  const breatheScale = 1 + Math.sin(localFrame * 0.035) * 0.006;

  // Accent underline draws in sync with the reveal (0 → full width)
  const accentProgress = Math.max(0, Math.min(1, revealSpring)) * (1 - exitProgress);

  const baseFontSize = FONT_SIZES[keyword.size] || FONT_SIZES.large;
  const fontSize = getResponsiveHeadlineSize(keyword.word, baseFontSize);
  const isUpper = keyword.word.split(' ').length === 1 && keyword.emphasis === 'headline';

  const topPosition = keyword.position === 'top' ? '11%'
    : keyword.position === 'center' ? '37%'
    : '55%';

  const finalScale = scale * breatheScale;
  const finalOpacity = opacity * exitOpacity;
  const finalY = translateY + floatY + exitTranslateY;

  return (
    <div style={{
      position: 'absolute',
      top: topPosition,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pointerEvents: 'none',
      opacity: finalOpacity,
      transform: `scale(${finalScale}) translateY(${finalY}px)`,
      transformOrigin: 'center center',
    }}>
      <div style={{
        position: 'relative',
        overflow: animType === 'wipeReveal' ? 'hidden' : 'visible',
        clipPath: animType === 'wipeReveal' ? `inset(0 ${clipRight}% 0 0)` : undefined,
        maxWidth: '92%',
      }}>
        {/* Readability backing for near-transparent outline styles so text stays legible on busy video */}
        {styleConfig.textStroke ? (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-8% -10%',
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.28) 55%, transparent 78%)',
              filter: 'blur(14px)',
              zIndex: -1,
            }}
          />
        ) : null}
        <span style={{
          fontFamily: resolveFont(styleConfig.headlineFont),
          fontSize,
          fontWeight: styleConfig.fontWeight,
          color: keyword.color || styleConfig.colors[0],
          letterSpacing: styleConfig.letterSpacing + letterSpacingExtra,
          lineHeight: 1.08,
          textAlign: 'center',
          textShadow: styleConfig.textShadow,
          WebkitTextStroke: styleConfig.textStroke || undefined,
          textTransform: isUpper ? 'uppercase' : 'none',
          wordBreak: 'break-word',
          display: 'block',
        }}>
          {keyword.word}
        </span>
      </div>

      {/* Accent underline — editorial title-card treatment tying text to the chosen style */}
      <div style={{
        position: 'relative',
        marginTop: 14,
        width: Math.min(360, fontSize * 2.1) * accentProgress,
        height: 2.5,
        borderRadius: 999,
        background: `linear-gradient(90deg, transparent 0%, ${styleConfig.accentColor} 20%, ${styleConfig.accentColor} 80%, transparent 100%)`,
        boxShadow: `0 0 16px ${styleConfig.accentColor}66`,
        opacity: accentProgress,
      }} />
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
  captionStyle = 'Cinematic',
  captionPosition = 'bottom',
  textColor = '#F8FAFC',
  highlightColor,
  backgroundColor = 'rgba(15,23,42,0.45)',
  fontSize = 'medium',
  fontFamily,
  showBackground = true,
  showCaptions = true,
  premiumEditing = true,
  styleLock,
  soundCues = [],
}: TypographyVideoProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const styleConfig = getStyleConfig(typographyStyle);
  const captionData = showCaptions ? normalizeCaptions(captions) : [];
  const captionsVisible = captionData.length > 0;

  // Keep headlines out of the caption band so the two never physically collide.
  const adjustedKeywords = keywords.map((kw) => ({
    ...kw,
    position: resolveKeywordPosition(kw.position, captionPosition, captionsVisible),
  }));

  // Visual grade is driven by the chosen typography style so text, color grade,
  // and vignette all read as one designed world instead of a generic overlay.
  const visualStyleLock: PremiumVisualStyleLock = {
    colorGrade: styleConfig.colorGrade,
    camera: {kenBurnsIntensity: styleConfig.kenBurnsIntensity, shakeIntensity: 0, motionBlur: 0.18},
    depth: {foregroundOpacity: 0.06, backgroundBlur: 0},
  };

  const subtitleConfig: SubtitleConfig = {
    style: mapCaptionStyle(captionStyle),
    position: captionPosition,
    language: 'en',
    textColor,
    highlightColor: highlightColor || styleConfig.accentColor,
    backgroundColor,
    fontSize,
    fontFamily: getCaptionFont(captionStyle, fontFamily),
    showBackground,
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <PremiumAudioLayer enabled={premiumEditing} styleLock={styleLock} soundCues={soundCues} />

      {resolvedSrc && (
        <OffthreadVideo
          src={resolvedSrc}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: premiumEditing ? styleConfig.colorGrade.filter : undefined,
          }}
          volume={sourceAudioVolume}
        />
      )}

      {adjustedKeywords.map((kw, i) => (
        <BigKeyword key={`${kw.word}-${i}`} keyword={kw} frame={frame} fps={fps} styleConfig={styleConfig} index={i} />
      ))}

      {captionsVisible && (
        <SubtitleRenderer captions={captionData} config={subtitleConfig} />
      )}

      <PremiumVisualTreatment enabled={premiumEditing} styleLock={visualStyleLock} includeLightSweep />
    </AbsoluteFill>
  );
}

// ── Composition ───────────────────────────────────────────────────────────────

const defaultProps: TypographyVideoProps = {
  mediaSrc: '',
  mediaType: 'video',
  sourceAudioVolume: 1,
  durationSeconds: 30,
  typographyStyle: 'gold-luxury',
  captionStyle: 'Cinematic',
  captionPosition: 'bottom',
  showCaptions: true,
  premiumEditing: true,
  keywords: [
    {word: '$17M', start: 2, end: 4.8, color: 'rgba(248, 250, 252, 0.9)', size: 'huge', position: 'top', emphasis: 'headline'},
    {word: 'closed in 2024', start: 6, end: 8.6, color: 'rgba(248, 250, 252, 0.85)', size: 'large', position: 'center', emphasis: 'headline'},
    {word: 'legacy portfolio', start: 10.5, end: 13, color: 'rgba(248, 250, 252, 0.85)', size: 'large', position: 'center', emphasis: 'headline'},
    {word: 'EXCLUSIVE', start: 15.5, end: 18, color: 'rgba(248, 250, 252, 0.9)', size: 'huge', position: 'top', emphasis: 'headline'},
  ],
  captions: [
    {start: 1, end: 5, text: 'We closed seventeen million dollars'},
    {start: 6, end: 11, text: 'building a legacy portfolio'},
    {start: 12, end: 17, text: 'this is the exclusive listing'},
  ],
};

export {TypographyVideo};

export const TypographyVideoComposition = () => (
  <Composition
    id="TYPOGRAPHY-VIDEO"
    component={TypographyVideo}
    durationInFrames={2700}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as TypographyVideoProps;
      const dur = Math.max(8, Math.min(90,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
