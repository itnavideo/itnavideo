// remotion/captions/WordElement.tsx
// Pure deterministic individual caption word component with Phase 4 specialized style enhancements

import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { isWordActive } from './utils/cleanWord';

export interface WordElementProps {
  word: string;
  wordIndex?: number;
  presetId?: string;
  start?: number;
  end?: number;
  activeWord?: string | null;
  currentTimeSec?: number;
  textColor?: string;
  highlightColor?: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: number | string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: number | string;
  textStroke?: string;
  textShadow?: string;
  isEmphasis?: boolean;
  scaleOnActive?: boolean;
  activeScaleMultiplier?: number;
  customStyle?: React.CSSProperties;
}

export const WordElement: React.FC<WordElementProps> = ({
  word,
  wordIndex = 0,
  presetId = 'minimal-clean',
  start = 0,
  end = 0,
  activeWord,
  currentTimeSec = 0,
  textColor = '#FFFFFF',
  highlightColor = '#FFD700',
  fontSize,
  fontFamily,
  fontWeight = 800,
  textTransform = 'none',
  letterSpacing,
  textStroke,
  textShadow,
  isEmphasis = false,
  scaleOnActive = true,
  activeScaleMultiplier = 1.15,
  customStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive = isWordActive(word, activeWord);

  // Active word spring pulse
  let pulseScale = 1;
  if (isActive && scaleOnActive) {
    const localWordFrame = Math.max(0, Math.round((currentTimeSec - start) * fps));
    const springVal = spring({
      frame: localWordFrame,
      fps,
      config: { damping: 10, mass: 0.25, stiffness: 220 },
    });
    pulseScale = 0.9 + (activeScaleMultiplier - 0.9) * springVal;
  }

  // 1. MrBeast Shorts Impact: Alternating word colors (yellow, cyan, white) & tilt
  let finalColor = isActive ? highlightColor : textColor;
  let wordTilt = 0;
  if (presetId === 'mrbeast-shorts-impact') {
    const colors = ['#FACC15', '#38BDF8', '#FFFFFF'];
    finalColor = isActive ? highlightColor : colors[wordIndex % colors.length];
    wordTilt = (wordIndex % 2 === 0 ? 1 : -1) * 3;
  }

  // 2. Outline Only: Active word gets solid fill, inactive words transparent fill
  let finalStroke = textStroke;
  if (presetId === 'outline-only') {
    if (isActive) {
      finalColor = highlightColor;
      finalStroke = '2.5px #000000';
    } else {
      finalColor = 'transparent';
      finalStroke = '2.5px #FFFFFF';
    }
  }

  // 3. Hormozi: Active word gets solid green/yellow background box
  let hormoziBadgeStyle: React.CSSProperties = {};
  if (presetId === 'hormozi-viral-pop' && isActive) {
    hormoziBadgeStyle = {
      backgroundColor: '#22C55E',
      color: '#000000',
      padding: '4px 14px',
      borderRadius: '8px',
      boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
    };
  }

  // 4. Neon Pulse: Inner white core + outer cyan/red tube glow + subtle flicker
  let neonFlickerOpacity = 1;
  if (presetId === 'neon-pulse') {
    neonFlickerOpacity = 0.88 + 0.12 * Math.sin(frame * 0.45);
  }

  // 5. Karaoke smooth left-to-right clip fill
  let karaokeProgress = 0;
  if (presetId === 'karaoke' && start < end) {
    karaokeProgress = Math.min(1, Math.max(0, (currentTimeSec - start) / (end - start)));
  }

  // 6. Typewriter character-by-character reveal
  let displayedWord = word;
  if (presetId === 'typewriter') {
    if (currentTimeSec < start) {
      displayedWord = '';
    } else if (currentTimeSec >= end) {
      displayedWord = word;
    } else {
      const charProgress = Math.min(
        word.length,
        Math.floor(((currentTimeSec - start) / (end - start)) * word.length) + 1
      );
      displayedWord = word.slice(0, charProgress);
    }
  }

  const finalFontWeight = isActive ? 900 : fontWeight;

  // 7. Glitch RGB Split rendering
  if (presetId === 'glitch-rgb') {
    const jitterX = isActive ? (frame % 2 === 0 ? 3 : -3) : 0;
    const jitterY = isActive ? (frame % 3 === 0 ? -2 : 2) : 0;

    return (
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize,
          fontFamily,
          fontWeight: finalFontWeight,
          transform: `scale(${pulseScale}) translate(${jitterX}px, ${jitterY}px)`,
          transition: 'transform 0.05s ease',
          margin: '0 6px',
        }}
      >
        {/* Cyan Channel Layer */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: isActive ? '-3px' : '0px',
            color: '#00F5D4',
            opacity: isActive ? 0.85 : 0,
            clipPath: 'inset(10% 0 30% 0)',
            pointerEvents: 'none',
          }}
        >
          {word}
        </span>
        {/* Red Channel Layer */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: isActive ? '3px' : '0px',
            color: '#FF0055',
            opacity: isActive ? 0.85 : 0,
            clipPath: 'inset(40% 0 10% 0)',
            pointerEvents: 'none',
          }}
        >
          {word}
        </span>
        {/* Base Layer */}
        <span
          style={{
            color: isActive ? highlightColor : textColor,
            WebkitTextStroke: textStroke || 'none',
            textShadow: '0 0 12px rgba(0, 245, 212, 0.6)',
          }}
        >
          {word}
        </span>
      </span>
    );
  }

  // 8. Karaoke Smooth Fill Rendering
  if (presetId === 'karaoke') {
    return (
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize,
          fontFamily,
          fontWeight: finalFontWeight,
          color: textColor,
          WebkitTextStroke: textStroke || 'none',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          transform: `scale(${pulseScale})`,
          margin: '0 5px',
        }}
      >
        {/* Base un-filled text */}
        <span>{word}</span>
        {/* Smooth clip fill overlay */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: highlightColor,
            fontWeight: 900,
            clipPath: `inset(0 ${Math.round((1 - karaokeProgress) * 100)}% 0 0)`,
            whiteSpace: 'nowrap',
            textShadow: `0 0 16px ${highlightColor}AA`,
          }}
        >
          {word}
        </span>
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize,
        fontFamily,
        fontWeight: finalFontWeight,
        color: finalColor,
        textTransform: isEmphasis ? 'uppercase' : textTransform,
        letterSpacing,
        WebkitTextStroke: finalStroke || 'none',
        paintOrder: 'stroke fill',
        textShadow: textShadow || (isActive ? `0 0 16px ${highlightColor}88, 0 2px 8px rgba(0,0,0,0.9)` : '0 2px 8px rgba(0,0,0,0.8)'),
        transform: `scale(${pulseScale}) rotate(${wordTilt}deg)`,
        opacity: neonFlickerOpacity,
        transition: 'color 0.08s ease, transform 0.08s ease',
        ...hormoziBadgeStyle,
        ...customStyle,
      }}
    >
      {displayedWord}
    </span>
  );
};
