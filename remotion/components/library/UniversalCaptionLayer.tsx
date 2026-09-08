import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { getCaptionThemePreset } from '../../../services/templates/templateLibrary';

export interface CaptionChunk {
  text: string;
  start: number; // in seconds
  end: number;   // in seconds
  words?: Array<{ word: string; start: number; end: number }>;
}

export interface UniversalCaptionLayerProps {
  chunks?: CaptionChunk[];
  captions?: CaptionChunk[];
  captionThemeId?: string;
  themeId?: string;
  styleOverrides?: React.CSSProperties;
}

export const UniversalCaptionLayer: React.FC<UniversalCaptionLayerProps> = ({
  chunks,
  captions,
  captionThemeId,
  themeId = 'glow-viral',
  styleOverrides,
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

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 65,
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
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          fontSize: styles.fontSize || 48,
          fontFamily: styles.fontFamily || 'system-ui, -apple-system, sans-serif',
          fontWeight: 900,
          textAlign: 'center',
          lineHeight: 1.3,
          color: styles.inactiveTextColor,
          textShadow: styles.textShadow || '0 2px 12px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.9)',
          filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.95)) drop-shadow(0px 2px 6px rgba(0,0,0,0.95))',
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          maxWidth: '90%',
          ...styleOverrides,
        }}
      >
        {activeChunk.words && activeChunk.words.length > 0 ? (
          activeChunk.words.map((w: { word: string; start: number; end: number }, idx: number) => {
            const isActive = currentTime >= w.start && currentTime <= w.end;
            return (
              <span
                key={idx}
                style={{
                  color: isActive ? styles.activeTextColor : styles.inactiveTextColor,
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'color 0.1s ease, transform 0.1s ease',
                  textShadow: isActive ? styles.textShadow : 'none',
                }}
              >
                {w.word}
              </span>
            );
          })
        ) : (
          <span style={{ color: styles.activeTextColor }}>{activeChunk.text}</span>
        )}
      </div>
    </div>
  );
};
