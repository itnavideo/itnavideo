import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AlphabetAnimationProps {
  letter?: string;
  word?: string;
  phonetic?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * AlphabetAnimation — Educational & branded phonetic letter card.
 * High-impact letter bounce with phonetic phonics tags and bold initial card frame.
 */
export function AlphabetAnimation({
  letter = 'A',
  word = 'Artificial Intelligence',
  phonetic = '/ˌɑːtɪˈfɪʃəl/',
  accentColor = '#f59e0b',
  delay = 0,
  width = 280,
  height = 320,
}: AlphabetAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  const letterBounce = spring({
    frame: Math.max(0, t - 6),
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const scale = interpolate(letterBounce, [0, 0.5, 1], [0.4, 1.25, 1]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: `2px solid ${accentColor}`,
        boxShadow: `0 20px 40px rgba(0,0,0,0.85), 0 0 30px ${accentColor}33`,
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Phonetic Badge Top */}
      <div
        style={{
          fontSize: 11,
          color: accentColor,
          fontWeight: 700,
          letterSpacing: '0.1em',
        }}
      >
        {phonetic}
      </div>

      {/* Giant Hero Letter */}
      <div
        style={{
          fontSize: 110,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1,
          transform: `scale(${scale})`,
          textShadow: `0 10px 30px rgba(0,0,0,0.9), 0 0 20px ${accentColor}66`,
        }}
      >
        {letter}
      </div>

      {/* Associated Word Bottom */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
          {word}
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
          Letter {letter} for {word.split(' ')[0]}
        </div>
      </div>
    </div>
  );
}
