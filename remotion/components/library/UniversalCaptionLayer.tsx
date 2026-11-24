import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { getCaptionThemePreset } from '../../../services/templates/templateLibrary';

export interface CaptionChunk {
  text: string;
  start: number; // in seconds
  end: number;   // in seconds
  words?: Array<{ word: string; start: number; end: number }>;
}

export type CaptionAnimationStyle =
  | 'mrbeast'
  | 'handwriting'
  | 'bouncy'
  | 'smooth'
  | 'capsule'
  | 'stacy-pill'
  | 'decodingyt'
  | 'marker'
  | 'highlighter'
  | (string & {});

export interface UniversalCaptionLayerProps {
  chunks?: CaptionChunk[];
  captions?: CaptionChunk[];
  captionThemeId?: string;
  themeId?: string;
  animationStyle?: CaptionAnimationStyle;
  position?: 'bottom' | 'center' | 'top';
  styleOverrides?: React.CSSProperties;
  emphasisWords?: string[];
  backgroundTheme?: string;
}

// ── 32 Native Production Subtitle Style Configurations ──
interface StyleVisualConfig {
  fontFamily: string;
  activeColor?: string;
  inactiveColor?: string;
  activeBg?: string;
  activeBorderRadius?: string;
  activePadding?: string;
  activeScale?: number;
  activeRotation?: number;
  activeGlow?: string;
  activeBorder?: string;
  underline?: string;
  italic?: boolean;
  uppercase?: boolean;
  isGradient?: boolean;
  isSoloWord?: boolean;
  hasSparkle?: boolean;
  hasCursor?: boolean;
}

const STYLE_CONFIGS: Record<string, StyleVisualConfig> = {
  // Row 1
  'pop-word': {
    fontFamily: "'Montserrat', 'Inter', sans-serif",
    activeColor: '#EA580C',
    inactiveColor: '#FFFFFF',
    activeScale: 1.22,
    activeGlow: '0 0 14px rgba(234, 88, 12, 0.75)',
    uppercase: true,
  },
  'karaoke-line': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#F59E0B',
    inactiveColor: 'rgba(255, 255, 255, 0.75)',
    activeScale: 1.1,
    underline: '4px solid #F59E0B',
    activeGlow: '0 0 10px rgba(245, 158, 11, 0.6)',
  },
  'box-highlight': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#FFFFFF',
    inactiveColor: '#FFFFFF',
    activeBg: '#0284C7',
    activeBorderRadius: '8px',
    activePadding: '4px 14px',
    activeScale: 1.12,
    activeGlow: '0 4px 12px rgba(2, 132, 199, 0.5)',
    uppercase: true,
  },
  'neon-glow': {
    fontFamily: "'Montserrat', sans-serif",
    activeColor: '#06B6D4',
    inactiveColor: 'rgba(255, 255, 255, 0.85)',
    activeScale: 1.16,
    activeGlow: '0 0 16px rgba(6, 182, 212, 0.9), 0 0 28px rgba(6, 182, 212, 0.45)',
    uppercase: true,
  },

  // Row 2
  'typewriter': {
    fontFamily: "'Courier Prime', 'Courier New', monospace",
    activeColor: '#FACC15',
    inactiveColor: 'rgba(254, 240, 138, 0.8)',
    activeBg: 'rgba(0, 0, 0, 0.75)',
    activeBorderRadius: '4px',
    activePadding: '4px 10px',
    activeScale: 1.08,
    hasCursor: true,
  },
  'slam-headline': {
    fontFamily: "'Impact', 'Anton', sans-serif",
    activeColor: '#EF4444',
    inactiveColor: '#FFFFFF',
    activeScale: 1.25,
    activeGlow: '0 0 14px rgba(239, 68, 68, 0.7)',
    uppercase: true,
  },
  'word-stack': {
    fontFamily: "'Montserrat', sans-serif",
    activeColor: '#A855F7',
    inactiveColor: 'rgba(255, 255, 255, 0.88)',
    activeScale: 1.16,
    activeGlow: '0 0 16px rgba(168, 85, 247, 0.8)',
    uppercase: true,
  },
  'editorial-mix': {
    fontFamily: "'Playfair Display', 'Georgia', serif",
    activeColor: '#FEF08A',
    inactiveColor: 'rgba(254, 243, 199, 0.8)',
    activeScale: 1.14,
    activeGlow: '0 0 10px rgba(254, 240, 138, 0.5)',
    italic: true,
  },

  // Row 3
  'pill-highlight': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#FFFFFF',
    inactiveColor: '#FFFFFF',
    activeBg: '#0D9488',
    activeBorderRadius: '9999px',
    activePadding: '4px 18px',
    activeScale: 1.12,
    activeGlow: '0 4px 14px rgba(13, 148, 136, 0.5)',
  },
  'subtitle-classic': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#FEF08A',
    inactiveColor: '#FFFFFF',
    activeScale: 1.05,
    activeGlow: '0 0 8px rgba(254, 240, 138, 0.4)',
  },
  'highlighter': {
    fontFamily: "'Montserrat', 'Inter', sans-serif",
    activeColor: '#0F172A',
    inactiveColor: '#FFFFFF',
    activeBg: '#FACC15',
    activeBorderRadius: '6px',
    activePadding: '4px 14px',
    activeScale: 1.14,
    activeRotation: -1,
    activeGlow: '0 4px 14px rgba(250, 204, 21, 0.6)',
  },
  'underline-track': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#38BDF8',
    inactiveColor: 'rgba(255, 255, 255, 0.8)',
    activeScale: 1.08,
    underline: '4px solid #38BDF8',
    activeGlow: '0 0 10px rgba(56, 189, 248, 0.6)',
  },

  // Row 4
  'color-fill': {
    fontFamily: "'Montserrat', sans-serif",
    activeColor: '#10B981',
    inactiveColor: '#94A3B8',
    activeScale: 1.15,
    activeGlow: '0 0 14px rgba(16, 185, 129, 0.7)',
  },
  'bold-impact': {
    fontFamily: "'Impact', sans-serif",
    activeColor: '#22C55E',
    inactiveColor: '#FFFFFF',
    activeScale: 1.22,
    activeGlow: '0 0 14px rgba(34, 197, 94, 0.75)',
    uppercase: true,
  },
  'headline-slam': {
    fontFamily: "'Impact', 'Montserrat', sans-serif",
    activeColor: '#000000',
    inactiveColor: '#FFFFFF',
    activeBg: '#FFE500',
    activeBorderRadius: '8px',
    activePadding: '4px 16px',
    activeScale: 1.18,
    uppercase: true,
  },
  'solo-word-pop': {
    fontFamily: "'Impact', 'Montserrat', sans-serif",
    activeColor: '#F59E0B',
    inactiveColor: 'transparent',
    activeScale: 1.25,
    activeGlow: '0 0 16px rgba(245, 158, 11, 0.8)',
    uppercase: true,
    isSoloWord: true,
  },

  // Row 5
  'crazy-kinetic': {
    fontFamily: "'Impact', sans-serif",
    activeColor: '#EC4899',
    inactiveColor: 'rgba(255, 255, 255, 0.85)',
    activeScale: 1.24,
    activeRotation: 2.5,
    activeGlow: '0 0 16px rgba(236, 72, 153, 0.85)',
    uppercase: true,
  },
  'neon-aura-glow': {
    fontFamily: "'Montserrat', sans-serif",
    activeColor: '#C084FC',
    inactiveColor: 'rgba(255, 255, 255, 0.85)',
    activeScale: 1.18,
    activeGlow: '0 0 20px rgba(192, 132, 252, 0.9), 0 0 35px rgba(168, 85, 247, 0.5)',
    uppercase: true,
  },
  'simple-clean': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#FFFFFF',
    inactiveColor: 'rgba(255, 255, 255, 0.75)',
    activeScale: 1.06,
    underline: '2px solid rgba(255, 255, 255, 0.85)',
  },
  'clean-minimal-pill': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#38BDF8',
    inactiveColor: 'rgba(255, 255, 255, 0.85)',
    activeScale: 1.1,
    activeGlow: '0 0 10px rgba(56, 189, 248, 0.5)',
  },

  // Row 6
  'doctor-pill': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#042F2E',
    inactiveColor: '#FFFFFF',
    activeBg: '#14B8A6',
    activeBorderRadius: '9999px',
    activePadding: '4px 18px',
    activeScale: 1.14,
    activeGlow: '0 4px 14px rgba(20, 184, 166, 0.55)',
  },
  'devane-luxury-serif': {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    activeColor: '#D4AF37',
    inactiveColor: 'rgba(245, 245, 244, 0.8)',
    activeScale: 1.15,
    activeGlow: '0 0 14px rgba(212, 175, 55, 0.65)',
    italic: true,
  },
  'cinema-classic': {
    fontFamily: "'Cinzel', 'Georgia', serif",
    activeColor: '#EAB308',
    inactiveColor: 'rgba(255, 255, 255, 0.88)',
    activeScale: 1.1,
    activeGlow: '0 0 10px rgba(234, 179, 8, 0.5)',
  },
  'podcast-studio-master': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#F59E0B',
    inactiveColor: 'rgba(226, 232, 240, 0.85)',
    activeScale: 1.12,
    activeGlow: '0 0 12px rgba(245, 158, 11, 0.55)',
  },

  // Row 7
  'deep-discussion': {
    fontFamily: "'Inter', sans-serif",
    activeColor: '#38BDF8',
    inactiveColor: 'rgba(203, 213, 225, 0.85)',
    activeScale: 1.12,
    activeGlow: '0 0 12px rgba(56, 189, 248, 0.55)',
  },
  'discipline-bold': {
    fontFamily: "'Impact', 'Anton', sans-serif",
    activeColor: '#FFFFFF',
    inactiveColor: '#FFFFFF',
    activeBg: '#000000',
    activeBorder: '1.5px solid rgba(255, 255, 255, 0.6)',
    activeBorderRadius: '6px',
    activePadding: '4px 12px',
    activeScale: 1.14,
    uppercase: true,
  },
  'red-wipe-highlight': {
    fontFamily: "'Montserrat', sans-serif",
    activeColor: '#FFFFFF',
    inactiveColor: '#FFFFFF',
    activeBg: '#DC2626',
    activeBorderRadius: '8px',
    activePadding: '4px 14px',
    activeScale: 1.12,
    activeGlow: '0 4px 14px rgba(220, 38, 38, 0.6)',
  },
  'spark-yellow': {
    fontFamily: "'Impact', 'Montserrat', sans-serif",
    activeColor: '#FACC15',
    inactiveColor: '#FFFFFF',
    activeScale: 1.2,
    activeGlow: '0 0 14px rgba(250, 204, 21, 0.85)',
    hasSparkle: true,
    uppercase: true,
  },

  // Row 8
  'scribble-handwritten': {
    fontFamily: "'Caveat', 'Kalam', cursive, sans-serif",
    activeColor: '#F43F5E',
    inactiveColor: 'rgba(255, 255, 255, 0.85)',
    activeScale: 1.22,
    activeRotation: 2,
    underline: '3px wavy #F43F5E',
  },
  'editorial-dark-gold': {
    fontFamily: "'Playfair Display', 'Cinzel', serif",
    activeColor: '#CA8A04',
    inactiveColor: 'rgba(214, 211, 209, 0.8)',
    activeScale: 1.14,
    activeGlow: '0 0 12px rgba(202, 138, 4, 0.55)',
    italic: true,
  },
  'gradient-word': {
    fontFamily: "'Montserrat', sans-serif",
    inactiveColor: 'rgba(255, 255, 255, 0.8)',
    activeScale: 1.2,
    isGradient: true,
    activeGlow: '0 0 14px rgba(236, 72, 153, 0.6)',
    uppercase: true,
  },
  'zoom-punch': {
    fontFamily: "'Impact', sans-serif",
    activeColor: '#F97316',
    inactiveColor: '#FFFFFF',
    activeScale: 1.3,
    activeGlow: '0 0 16px rgba(249, 115, 22, 0.8)',
    uppercase: true,
  },

  // Backwards-compatible aliases
  'mrbeast': {
    fontFamily: "'Impact', 'Titan One', sans-serif",
    activeColor: '#000000',
    inactiveColor: '#FFFFFF',
    activeBg: '#FFE500',
    activeBorderRadius: '8px',
    activePadding: '4px 14px',
    activeScale: 1.15,
    uppercase: true,
  },
  'glow-viral': {
    fontFamily: "'Montserrat', sans-serif",
    activeColor: '#06B6D4',
    inactiveColor: '#FFFFFF',
    activeScale: 1.18,
    activeGlow: '0 0 16px rgba(6, 182, 212, 0.85)',
    uppercase: true,
  },
};

export const UniversalCaptionLayer: React.FC<UniversalCaptionLayerProps> = ({
  chunks,
  captions,
  captionThemeId,
  themeId = 'pop-word',
  animationStyle = 'bouncy',
  position = 'bottom',
  styleOverrides,
  emphasisWords = [],
  backgroundTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width = 1920, height = 1080 } = useVideoConfig();
  const isLandscape = width > height;
  const currentTime = frame / fps;

  const activeChunks = chunks || captions || [];
  const normalizedThemeId = (captionThemeId || themeId || 'pop-word').toLowerCase().trim();

  const activeChunk = activeChunks.find(
    (chunk: CaptionChunk) => currentTime >= chunk.start && currentTime <= chunk.end
  );

  if (!activeChunk) return null;

  // Resolve specific 32-style config, or fallback gracefully
  const styleConfig = STYLE_CONFIGS[normalizedThemeId] || STYLE_CONFIGS['pop-word'];

  const isArabic = Boolean(activeChunk.text && /[\u0600-\u06FF]/.test(activeChunk.text));

  const enterSpring = spring({
    frame: Math.max(0, frame - Math.floor(activeChunk.start * fps)),
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  const scale = interpolate(enterSpring, [0, 1], [0.94, 1]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Position calculation:
  // 16:9 Widescreen: bottom set to 100px so captions sit neatly in lower third without blocking main cards
  // 9:16 Vertical Shorts: bottom set to 360px to clear YouTube Shorts / Reels bottom UI overlay
  const positionStyles: React.CSSProperties =
    position === 'top'
      ? { top: isLandscape ? 40 : 75, bottom: 'auto' }
      : position === 'center'
      ? { top: '48%', bottom: 'auto', transform: 'translateY(-50%)' }
      : { bottom: isLandscape ? 100 : 360, top: 'auto' };

  // Ensure word-level timings are always available for dynamic karaoke highlighting
  const wordsList =
    activeChunk.words && activeChunk.words.length > 0
      ? activeChunk.words
      : (() => {
          const rawWords = (activeChunk.text || '').trim().split(/\s+/).filter(Boolean);
          if (rawWords.length === 0) return [];
          const chunkStart = Number(activeChunk.start ?? 0);
          const chunkEnd = Number(activeChunk.end ?? chunkStart + 2.5);
          const chunkDuration = Math.max(0.3, chunkEnd - chunkStart);
          const timePerWord = chunkDuration / rawWords.length;
          return rawWords.map((word, i) => ({
            word,
            start: chunkStart + i * timePerWord,
            end: chunkStart + (i + 1) * timePerWord,
          }));
        })();

  const isLightCanvas =
    backgroundTheme === 'solid-white' ||
    backgroundTheme === 'studio-white' ||
    backgroundTheme === 'solid-cream' ||
    backgroundTheme === 'minimal-gray' ||
    backgroundTheme === 'solid-light' ||
    backgroundTheme === 'paper-cream' ||
    backgroundTheme?.includes('white') ||
    backgroundTheme?.includes('cream');

  // Clean, subtle translucent backdrop for readability without muddy black shadows
  const isBackdropStyle =
    normalizedThemeId === 'clean-minimal-pill' ||
    normalizedThemeId === 'deep-discussion' ||
    normalizedThemeId === 'cinema-classic' ||
    normalizedThemeId === 'subtitle-classic';

  const shouldWrapPill = isLightCanvas || isBackdropStyle;

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@700&family=Cinzel:wght@700;900&family=Courier+Prime:wght@700&family=Inter:wght@600;700;800;900&family=Kalam:wght@700&family=Montserrat:wght@700;900&family=Outfit:wght@700;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@700;800&family=Titan+One&display=swap');
      `}</style>
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{
          transform: `scale(${scale})`,
          opacity,
          direction: isArabic ? 'rtl' : 'ltr',
          fontSize: isArabic ? 48 : 44,
          fontFamily: isArabic
            ? "'Amiri', 'Noto Naskh Arabic', 'Cairo', serif"
            : styleConfig.fontFamily,
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.35,
          color: styleConfig.inactiveColor || '#FFFFFF',
          // Clean, crisp subtle text shadow (NO heavy black muddy double drop-shadows!)
          textShadow: isLightCanvas
            ? 'none'
            : '0 2px 5px rgba(0, 0, 0, 0.65)',
          backgroundColor: shouldWrapPill ? 'rgba(15, 23, 42, 0.82)' : undefined,
          backdropFilter: shouldWrapPill ? 'blur(14px)' : undefined,
          border: shouldWrapPill ? '1px solid rgba(255, 255, 255, 0.12)' : undefined,
          borderRadius: shouldWrapPill ? '9999px' : undefined,
          padding: shouldWrapPill ? '10px 30px' : undefined,
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '92%',
          boxShadow: shouldWrapPill ? '0 10px 25px -5px rgba(0, 0, 0, 0.35)' : undefined,
          ...styleOverrides,
        }}
      >
        {wordsList.map((w: { word?: string; text?: string; start: number; end: number }, idx: number) => {
          const rawWordStr = String(w?.word || (w as any)?.text || '').trim();
          const isActive = currentTime >= w.start && currentTime <= w.end;
          const cleanWord = rawWordStr.toLowerCase().replace(/[^a-z0-9]/g, '');

          // If solo-word-pop style, only show active word
          if (styleConfig.isSoloWord && !isActive) {
            return null;
          }

          const isEmphasis = Boolean(
            emphasisWords &&
              emphasisWords.length > 0 &&
              cleanWord &&
              emphasisWords.some((ew) => {
                const cleanEW = String(ew || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return cleanEW && (cleanWord.includes(cleanEW) || cleanEW.includes(cleanWord));
              })
          );

          // Word transform & spring
          let wordScale = 1;
          let wordRotation = 0;

          if (isActive) {
            const wordSpring = spring({
              frame: Math.max(0, frame - Math.floor(w.start * fps)),
              fps,
              config: { damping: 11, stiffness: 240 },
            });
            const targetScale = styleConfig.activeScale || 1.18;
            wordScale = interpolate(wordSpring, [0, 1], [0.94, targetScale]);
            wordRotation = styleConfig.activeRotation || 0;
          }

          let displayWord = rawWordStr;
          if (styleConfig.uppercase) {
            displayWord = displayWord.toUpperCase();
          }
          if (styleConfig.hasSparkle && isActive) {
            displayWord = `✦ ${displayWord}`;
          }

          // Active styling
          const wordColor = isActive
            ? (styleConfig.activeColor || '#FFE600')
            : (styleConfig.inactiveColor || 'rgba(255, 255, 255, 0.85)');

          const wordBg = isActive ? styleConfig.activeBg : undefined;
          const wordPadding = isActive ? styleConfig.activePadding : undefined;
          const wordRadius = isActive ? styleConfig.activeBorderRadius : undefined;
          const wordBorder = isActive ? styleConfig.activeBorder : undefined;
          const wordUnderline = isActive ? styleConfig.underline : undefined;
          const wordGlow = isActive && styleConfig.activeGlow ? styleConfig.activeGlow : undefined;

          // Gradient text styling
          const isGradientActive = isActive && styleConfig.isGradient;

          return (
            <span
              key={idx}
              style={{
                color: isGradientActive ? 'transparent' : wordColor,
                background: isGradientActive
                  ? 'linear-gradient(90deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%)'
                  : wordBg,
                WebkitBackgroundClip: isGradientActive ? 'text' : undefined,
                WebkitTextFillColor: isGradientActive ? 'transparent' : undefined,
                padding: wordPadding,
                borderRadius: wordRadius,
                border: wordBorder,
                borderRight: isActive && styleConfig.hasCursor ? '3px solid #FACC15' : wordBorder,
                borderBottom: wordUnderline,
                fontStyle: styleConfig.italic ? 'italic' : 'normal',
                transform: `scale(${wordScale}) rotate(${wordRotation}deg)`,
                transition: 'transform 0.08s ease, color 0.08s ease',
                textShadow: wordGlow || (isLightCanvas ? undefined : '0 1px 3px rgba(0, 0, 0, 0.4)'),
                display: 'inline-block',
                margin: '0 3px',
              }}
            >
              {displayWord}
            </span>
          );
        })}
      </div>
    </div>
  );
};
