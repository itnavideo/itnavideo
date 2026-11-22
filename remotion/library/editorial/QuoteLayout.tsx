import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface QuoteLayoutProps {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  avatarSrc?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

/**
 * QuoteLayout — Dramatic editorial pull quote composition.
 * Features giant decorative serif quotation marks, author portrait avatar,
 * and high-contrast editorial typography.
 */
export function QuoteLayout({
  quote = '“The best way to predict the future is to invent it. Video creation is no longer about editing clips; it is about prompt-driven algorithmic storytelling.”',
  author = 'Alan Kay & Modern Thinkers',
  role = 'Pioneer of Personal Computing',
  company = 'Xerox PARC / MIT',
  avatarSrc = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  accentColor = '#10b981',
  delay = 0,
  width = '100%',
  style,
}: QuoteLayoutProps) {
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
        backgroundColor: '#09090b',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '36px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Giant Decorative Background Quotation Mark */}
      <span
        style={{
          position: 'absolute',
          top: -20,
          right: 20,
          fontSize: 160,
          lineHeight: 1,
          fontFamily: 'Georgia, serif',
          color: accentColor,
          opacity: 0.08,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        “
      </span>

      {/* Main Quote Copy */}
      <blockquote
        style={{
          margin: 0,
          color: '#f4f4f5',
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.5,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          letterSpacing: '-0.01em',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {quote}
      </blockquote>

      {/* Author Credential Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 20,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {avatarSrc && (
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 15px ${accentColor}40`,
              flexShrink: 0,
            }}
          >
            <Img
              src={avatarSrc}
              alt={author}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>{author}</span>
          <span style={{ color: '#a1a1aa', fontSize: 12, fontWeight: 500 }}>
            {role} {company && `• ${company}`}
          </span>
        </div>
      </div>
    </div>
  );
}
