import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MagazineLayoutProps {
  magazineTitle?: string;
  issueNumber?: string;
  category?: string;
  headline?: string;
  quote?: string;
  author?: string;
  imageSrc?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * MagazineLayout — High-fashion / modern editorial magazine spread.
 * Features full-bleed hero photography, high-contrast serif typography,
 * folio chapter tags, and dramatic pull quotes.
 */
export function MagazineLayout({
  magazineTitle = 'VOGUE TECH',
  issueNumber = 'ISSUE N° 84',
  category = 'ARCHITECTURE & MOTION',
  headline = 'THE MINIMALIST CODE',
  quote = '“Simplicity is not the lack of clutter, that’s a consequence of simplicity. Simplicity is somehow essentially describing the purpose and place of an object.”',
  author = 'JONY IVE & ITNAVIDEO ESSAYS',
  imageSrc = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
  accentColor = '#10b981',
  delay = 0,
  width = '100%',
  height = 420,
}: MagazineLayoutProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        overflow: 'hidden',
        border: 'none',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Left Column: Full-Bleed Editorial Hero Photo */}
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <Img
          src={imageSrc}
          alt={headline}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, transparent 60%, rgba(9, 9, 11, 0.9) 100%)',
          }}
        />

        {/* Vertical Folio Spine Tag */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 20,
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(9, 9, 11, 0.8)',
            padding: '4px 10px',
            borderRadius: 4,
          }}
        >
          {issueNumber}
        </div>
      </div>

      {/* Right Column: Editorial Typography */}
      <div
        style={{
          padding: '32px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#fff',
        }}
      >
        {/* Top Kicker */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              color: accentColor,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.1em',
            }}
          >
            {category}
          </span>
          <span style={{ color: '#71717a', fontSize: 11, fontWeight: 700 }}>
            {magazineTitle}
          </span>
        </div>

        {/* Main Serif Headline */}
        <div>
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              fontFamily: 'Georgia, serif',
              lineHeight: 1.1,
            }}
          >
            {headline}
          </h2>

          {/* Pull Quote */}
          <blockquote
            style={{
              margin: 0,
              fontSize: 14,
              fontStyle: 'italic',
              color: '#d4d4d8',
              lineHeight: 1.5,
              borderLeft: `3px solid ${accentColor}`,
              paddingLeft: 16,
            }}
          >
            {quote}
          </blockquote>
        </div>

        {/* Author Byline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 14,
          }}
        >
          <span style={{ fontSize: 11, color: '#a1a1aa', fontWeight: 600 }}>
            WORDS BY <strong style={{ color: '#fff' }}>{author}</strong>
          </span>

          <span style={{ fontSize: 10, color: '#71717a', letterSpacing: '0.08em' }}>
            PAGE 42–49
          </span>
        </div>
      </div>
    </div>
  );
}
