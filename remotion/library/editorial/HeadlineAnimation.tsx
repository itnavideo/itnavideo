import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HeadlineAnimationProps {
  headline?: string;
  highlightWords?: string[];
  subtitle?: string;
  accentColor?: string;
  highlightColor?: string;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  delay?: number;
}

/**
 * HeadlineAnimation — Kinetic typography headline presenter.
 * Features staggered word pop-in, fluorescent marker highlights,
 * and high-contrast uppercase impact titles.
 */
export function HeadlineAnimation({
  headline = 'THE REVOLUTION OF VIDEO SYNTHESIS IS HAPPENING RIGHT NOW',
  highlightWords = ['REVOLUTION', 'RIGHT NOW'],
  subtitle = 'High-velocity programmatic rendering meets autonomous agency',
  accentColor = '#10b981',
  highlightColor = 'rgba(16, 185, 129, 0.35)',
  align = 'center',
  fontSize = 38,
  delay = 0,
}: HeadlineAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = headline.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        textAlign: align,
        gap: 12,
        width: '100%',
        padding: '0 20px',
      }}
    >
      {/* Animated Words Flow */}
      <h1
        style={{
          margin: 0,
          fontSize,
          fontWeight: 900,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          color: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
          gap: '8px 12px',
        }}
      >
        {words.map((word, index) => {
          const wordFrame = Math.max(0, frame - delay - index * 2.5);
          const spr = spring({
            frame: wordFrame,
            fps,
            config: { damping: 14, stiffness: 120, mass: 0.8 },
          });

          const translateY = interpolate(spr, [0, 1], [30, 0]);
          const opacity = interpolate(spr, [0, 1], [0, 1]);
          const scale = interpolate(spr, [0, 1], [0.85, 1]);

          const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
          const isHighlighted = highlightWords.some(
            (hw) => cleanWord.toLowerCase() === hw.toLowerCase()
          );

          return (
            <span
              key={index}
              style={{
                position: 'relative',
                display: 'inline-block',
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
              }}
            >
              <span
                style={{
                  position: 'relative',
                  zIndex: 2,
                  color: isHighlighted ? accentColor : '#ffffff',
                }}
              >
                {word}
              </span>

              {isHighlighted && (
                <span
                  style={{
                    position: 'absolute',
                    left: -4,
                    right: -4,
                    bottom: 2,
                    height: '35%',
                    backgroundColor: highlightColor,
                    borderRadius: 4,
                    zIndex: 1,
                  }}
                />
              )}
            </span>
          );
        })}
      </h1>

      {/* Subtitle Body */}
      {subtitle && (
        <p
          style={{
            margin: 0,
            color: '#a1a1aa',
            fontSize: 16,
            fontWeight: 500,
            maxWidth: 640,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
