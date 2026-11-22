import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WordByWordRevealProps {
  sentence?: string;
  framesPerWord?: number;
  activeColor?: string;
  inactiveColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * WordByWordReveal — Teleprompter & keynote word progression reveal.
 * Illuminates words sequentially in synchrony with speech cadence.
 */
export function WordByWordReveal({
  sentence = 'Creativity is intelligence having fun in computational video.',
  framesPerWord = 6,
  activeColor = '#f59e0b',
  inactiveColor = 'rgba(255, 255, 255, 0.25)',
  fontSize = 32,
  delay = 0,
  width = '100%',
  height = 140,
}: WordByWordRevealProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const words = sentence.split(' ');
  const activeIndex = Math.min(words.length - 1, Math.floor(t / framesPerWord));

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
        padding: '20px 24px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {words.map((w, idx) => {
        const isCurrent = idx === activeIndex;
        const isPast = idx < activeIndex;

        const spr = spring({
          frame: Math.max(0, t - idx * framesPerWord),
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const scale = isCurrent ? interpolate(spr, [0, 0.5, 1], [1, 1.2, 1.05]) : 1;

        return (
          <span
            key={idx}
            style={{
              fontSize,
              fontWeight: isCurrent || isPast ? 800 : 600,
              color: isCurrent ? activeColor : isPast ? '#ffffff' : inactiveColor,
              transform: `scale(${scale})`,
              transition: 'color 0.15s ease',
              textShadow: isCurrent ? `0 0 16px ${activeColor}88` : 'none',
              display: 'inline-block',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
}
