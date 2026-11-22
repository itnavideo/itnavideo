import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SubtitleHighlightProps {
  words?: string[];
  activeWordIndex?: number;
  highlightColor?: string;
  inactiveColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_WORDS = ['Automate', 'your', 'entire', 'video', 'editing', 'pipeline'];

/**
 * SubtitleHighlight — Viral short-form subtitle badge with dynamic active word focus.
 * Renders bold centered subtitle reels with glowing highlight boxes around the actively spoken word.
 */
export function SubtitleHighlight({
  words = DEFAULT_WORDS,
  activeWordIndex,
  highlightColor = '#facc15',
  inactiveColor = '#ffffff',
  fontSize = 32,
  delay = 0,
  width = '100%',
  height = 120,
}: SubtitleHighlightProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  // Auto cycle word if not explicitly controlled
  const currentIdx = activeWordIndex !== undefined ? activeWordIndex : Math.floor(t / 8) % words.length;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
        padding: 16,
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {words.map((word, idx) => {
        const isActive = idx === currentIdx;

        return (
          <span
            key={idx}
            style={{
              position: 'relative',
              fontSize,
              fontWeight: 900,
              color: isActive ? '#000000' : inactiveColor,
              backgroundColor: isActive ? highlightColor : 'transparent',
              padding: isActive ? '4px 10px' : '4px 0',
              borderRadius: 8,
              boxShadow: isActive ? `0 0 20px ${highlightColor}` : 'none',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.1s ease',
              textTransform: 'uppercase',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
