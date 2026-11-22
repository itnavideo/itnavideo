import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CharacterRevealProps {
  text?: string;
  framesPerChar?: number;
  showCursor?: boolean;
  accentColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * CharacterReveal — Terminal monospace character-by-character typewriter reveal with blinking cursor.
 */
export function CharacterReveal({
  text = 'SYSTEM INITIALIZED: REMOTION 2026',
  framesPerChar = 2,
  showCursor = true,
  accentColor = '#22c55e',
  fontSize = 28,
  delay = 0,
  width = '100%',
  height = 100,
}: CharacterRevealProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const charCount = Math.min(text.length, Math.floor(t / framesPerChar));
  const visibleText = text.slice(0, charCount);
  const cursorBlink = Math.floor(t / 8) % 2 === 0;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
        fontFamily: 'monospace, "Courier New", Courier, sans-serif',
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '0.08em',
          textShadow: `0 0 12px ${accentColor}44`,
        }}
      >
        <span>{visibleText}</span>
        {showCursor && (
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: fontSize,
              backgroundColor: cursorBlink ? accentColor : 'transparent',
              marginLeft: 4,
              verticalAlign: 'middle',
              boxShadow: cursorBlink ? `0 0 8px ${accentColor}` : 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
