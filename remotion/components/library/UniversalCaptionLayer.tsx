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

export const UniversalCaptionLayer: React.FC<UniversalCaptionLayerProps> = ({
  chunks,
  captions,
  captionThemeId,
  themeId = 'glow-viral',
  animationStyle = 'bouncy',
  position = 'bottom',
  styleOverrides,
  emphasisWords = [],
  backgroundTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const activeChunks = chunks || captions || [];
  const activeThemeId = captionThemeId || themeId || 'glow-viral';

  const activeChunk = activeChunks.find(
    (chunk: CaptionChunk) => currentTime >= chunk.start && currentTime <= chunk.end
  );

  if (!activeChunk) return null;

  const theme = getCaptionThemePreset(activeThemeId);
  const { styles } = theme;

  const enterSpring = spring({
    frame: Math.max(0, frame - Math.floor(activeChunk.start * fps)),
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const scale = interpolate(enterSpring, [0, 1], [0.85, 1]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Position calculation (Shorts Safe Zone: bottom set to 360px to clear YouTube Shorts & Reels UI overlays)
  const positionStyles: React.CSSProperties =
    position === 'top'
      ? { top: 75, bottom: 'auto' }
      : position === 'center'
      ? { top: '46%', bottom: 'auto', transform: 'translateY(-50%)' }
      : { bottom: 360, top: 'auto' };

  // Ensure word-level timings are always available for dynamic karaoke highlighting (pure computation, no conditional hooks)
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
  const shouldWrapPill = isLightCanvas || animationStyle === 'capsule' || animationStyle === 'stacy-pill';

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
        @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Anton&family=Bangers&family=Black+Ops+One&family=Caveat:wght@700;900&family=Cinzel:wght@700;900&family=Kalam:wght@700&family=Kaushan+Script&family=Londrina+Solid:wght@400;900&family=Montserrat:wght@700;900&family=Outfit:wght@700;900&family=Titan+One&display=swap');
      `}</style>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontSize: animationStyle === 'handwriting' ? (styles.fontSize || 54) : (styles.fontSize || 46),
          fontFamily:
            animationStyle === 'handwriting'
              ? "'Caveat', 'Kalam', cursive, sans-serif"
              : styles.fontFamily || 'Montserrat, Outfit, system-ui, -apple-system, sans-serif',
          fontWeight: 900,
          textAlign: 'center',
          lineHeight: 1.3,
          color: styles.inactiveTextColor || '#FFFFFF',
          textShadow: styles.textShadow || '0 2px 14px rgba(0,0,0,0.98), 0 0 24px rgba(0,0,0,0.9)',
          filter: 'drop-shadow(0px 4px 18px rgba(0,0,0,0.98)) drop-shadow(0px 2px 8px rgba(0,0,0,0.95))',
          backgroundColor: shouldWrapPill ? 'rgba(7, 11, 20, 0.88)' : styles.backgroundColor,
          backdropFilter: shouldWrapPill ? 'blur(16px)' : undefined,
          border: shouldWrapPill ? '1px solid rgba(255, 255, 255, 0.18)' : undefined,
          borderRadius: shouldWrapPill ? '9999px' : styles.borderRadius,
          padding: shouldWrapPill ? '12px 32px' : styles.padding,
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '92%',
          ...styleOverrides,
        }}
      >
        {wordsList.map((w: { word?: string; text?: string; start: number; end: number }, idx: number) => {
          const rawWordStr = String(w?.word || (w as any)?.text || '').trim();
          const isActive = currentTime >= w.start && currentTime <= w.end;
          const cleanWord = rawWordStr.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isEmphasis = Boolean(
            emphasisWords &&
              emphasisWords.length > 0 &&
              cleanWord &&
              emphasisWords.some((ew) => {
                const cleanEW = String(ew || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                return cleanEW && (cleanWord.includes(cleanEW) || cleanEW.includes(cleanWord));
              })
          );

          // Dynamic Neon / Yellow Karaoke Word Styling
          let wordTransform = 'scale(1)';
          let wordColor = isActive
            ? (styles.activeTextColor || '#FFE600')
            : isEmphasis
            ? '#FFA000'
            : (styles.inactiveTextColor || '#FFFFFF');
          let wordBg: string | undefined = undefined;
          let wordPadding: string | undefined = undefined;
          let wordRadius: string | undefined = undefined;
          let wordShadow = isActive
            ? '0 0 22px rgba(255, 230, 0, 0.95), 0 4px 14px rgba(0,0,0,1)'
            : isEmphasis
            ? '0 0 12px rgba(255, 160, 0, 0.5), 0 2px 8px rgba(0,0,0,0.95)'
            : '0 2px 10px rgba(0,0,0,0.95)';
          let wordUnderline: string | undefined = undefined;

          if (animationStyle === 'decodingyt' || animationStyle === 'marker' || animationStyle === 'highlighter') {
            if (isActive) {
              wordBg = isEmphasis ? '#FF5722' : '#FFE600';
              wordColor = isEmphasis ? '#FFFFFF' : '#070B14';
              wordPadding = '4px 12px';
              wordRadius = '6px';
              wordTransform = isEmphasis ? 'scale(1.22) rotate(-1.5deg)' : 'scale(1.15) rotate(-1deg)';
              wordShadow = isEmphasis
                ? '0 0 24px rgba(255, 87, 34, 0.9), 0 4px 16px rgba(0,0,0,0.9)'
                : '0 0 20px rgba(255, 230, 0, 0.9), 0 4px 14px rgba(0,0,0,0.9)';
            } else {
              wordColor = isEmphasis ? '#FFA000' : '#FFFFFF';
              wordBg = 'transparent';
            }
          } else if (animationStyle === 'capsule' || animationStyle === 'stacy-pill') {
            if (isActive) {
              const pillSpring = spring({
                frame: Math.max(0, frame - Math.floor(w.start * fps)),
                fps,
                config: { damping: 12, stiffness: 220 },
              });
              const pScale = interpolate(pillSpring, [0, 1], [0.95, isEmphasis ? 1.22 : 1.14]);
              wordBg = isEmphasis ? '#FF5722' : '#10B981';
              wordColor = '#FFFFFF';
              wordPadding = '4px 18px';
              wordRadius = '9999px';
              wordTransform = `scale(${pScale})`;
              wordShadow = isEmphasis
                ? '0 0 26px rgba(255, 87, 34, 0.95), 0 4px 16px rgba(0,0,0,1)'
                : '0 0 24px rgba(16, 185, 129, 0.9), 0 4px 14px rgba(0,0,0,1)';
            } else {
              wordColor = isEmphasis ? '#34D399' : '#FFFFFF';
              wordBg = 'transparent';
            }
          } else if (animationStyle === 'mrbeast') {
            if (isActive) {
              wordBg = isEmphasis ? '#FF5722' : '#FFE600';
              wordColor = isEmphasis ? '#FFFFFF' : '#000000';
              wordPadding = '4px 14px';
              wordRadius = '10px';
              wordTransform = isEmphasis ? 'scale(1.22)' : 'scale(1.14)';
              wordShadow = isEmphasis
                ? '0 0 20px rgba(255, 87, 34, 0.95), 0 4px 16px rgba(0,0,0,1)'
                : '0 4px 16px rgba(0,0,0,0.9)';
            } else {
              wordColor = isEmphasis ? '#FFA000' : '#FFFFFF';
              wordBg = 'transparent';
            }
          } else if (animationStyle === 'handwriting') {
            const rot = idx % 2 === 0 ? -2.5 : 2.0;
            if (isActive) {
              const penSpring = spring({
                frame: Math.max(0, frame - Math.floor(w.start * fps)),
                fps,
                config: { damping: 10, stiffness: 220 },
              });
              const hwScale = interpolate(penSpring, [0, 1], [0.94, isEmphasis ? 1.28 : 1.16]);
              wordTransform = `scale(${hwScale}) rotate(${rot}deg)`;
              wordColor = isEmphasis ? '#FF5722' : '#FFA000';
              wordUnderline = `underline wavy ${isEmphasis ? '#FF5722 5px' : '#FFA000 4px'}`;
              wordShadow = '0 0 24px rgba(255, 160, 0, 0.95), 0 2px 14px rgba(0,0,0,1)';
            } else {
              wordColor = isEmphasis ? '#FFA000' : '#FFFFFF';
              wordTransform = `rotate(${rot * 0.4}deg)`;
            }
          } else if (animationStyle === 'bouncy') {
            if (isActive) {
              const wordSpring = spring({
                frame: Math.max(0, frame - Math.floor(w.start * fps)),
                fps,
                config: { damping: 9, stiffness: 250 },
              });
              const bScale = interpolate(wordSpring, [0, 1], [0.94, isEmphasis ? 1.28 : 1.18]);
              wordTransform = `scale(${bScale})`;
              wordColor = isEmphasis ? '#FF5722' : (styles.activeTextColor || '#FFE600');
              wordShadow = isEmphasis
                ? '0 0 24px rgba(255, 87, 34, 0.95), 0 4px 14px rgba(0,0,0,1)'
                : '0 0 22px rgba(255, 230, 0, 0.95), 0 4px 14px rgba(0,0,0,1)';
            }
          } else {
            // Smooth
            if (isActive) {
              wordTransform = isEmphasis ? 'scale(1.2)' : 'scale(1.12)';
              wordColor = isEmphasis ? '#FF5722' : (styles.activeTextColor || '#FFE600');
              wordShadow = '0 0 20px rgba(255, 230, 0, 0.9), 0 3px 12px rgba(0,0,0,1)';
            }
          }

          return (
            <span
              key={idx}
              style={{
                color: wordColor,
                backgroundColor: wordBg,
                padding: wordPadding,
                borderRadius: wordRadius,
                transform: wordTransform,
                transition: 'color 0.1s ease, transform 0.1s ease, background-color 0.1s ease',
                textShadow: wordShadow,
                textDecoration: wordUnderline,
                textUnderlineOffset: '6px',
                display: 'inline-block',
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
