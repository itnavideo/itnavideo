import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NewspaperProps {
  publicationName?: string;
  issueDate?: string;
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  imageSrc?: string;
  imageCaption?: string;
  highlightKeyword?: string;
  vintageTheme?: boolean;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * Newspaper — Broadsheet newspaper print layout.
 * Features classic masthead typography, multi-column print body,
 * serif drop-cap, photo frame with caption, and animated marker highlight.
 */
export function Newspaper({
  publicationName = 'THE DAILY CHRONICLE',
  issueDate = 'VOL. CXXIV NO. 42 • WEDNESDAY, NOVEMBER 22, 2026 • $2.50',
  headline = 'ARTIFICIAL INTELLIGENCE SURPASSES HUMAN BENCHMARKS IN VIDEO SYNTHESIS',
  subheadline = 'Autonomous agents generate studio-grade cinema compositions in under ninety seconds.',
  bodyText = 'In what technologists are describing as a definitive paradigm shift, algorithmic rendering pipelines have converged with distributed cloud infrastructure to eliminate traditional post-production bottlenecks.',
  imageSrc = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
  imageCaption = 'Fig 1. Automated cloud rendering engine operating at 60 frames per second.',
  highlightKeyword = 'PARADIGM SHIFT',
  vintageTheme = true,
  delay = 0,
  width = '100%',
  height = 420,
}: NewspaperProps) {
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

  // Marker pen highlight width expansion
  const highlightProgress = interpolate(adjustedFrame, [20, 50], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const paperBg = vintageTheme ? '#f4eedb' : '#fafafa';
  const inkColor = '#18181b';

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: paperBg,
        color: inkColor,
        borderRadius: 12,
        border: '1px solid rgba(0, 0, 0, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(0, 0, 0, 0.05)',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'serif',
        transform: `scale(${scale})`,
        opacity,
        overflow: 'hidden',
      }}
    >
      {/* Masthead Header */}
      <div style={{ textAlign: 'center', borderBottom: '3px double #18181b', paddingBottom: 10 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: 'Georgia, serif',
          }}
        >
          {publicationName}
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            borderTop: '1px solid #18181b',
            marginTop: 6,
            paddingTop: 4,
          }}
        >
          <span>WORLD EDITION</span>
          <span>{issueDate}</span>
          <span>PRICE $2.50</span>
        </div>
      </div>

      {/* Main Headline */}
      <div style={{ margin: '14px 0 10px 0' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          {headline}
        </h2>
        {subheadline && (
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: 13,
              fontStyle: 'italic',
              color: '#3f3f46',
              lineHeight: 1.3,
            }}
          >
            {subheadline}
          </p>
        )}
      </div>

      {/* Split Body: Photo & Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, flex: 1, alignItems: 'center' }}>
        {/* Newspaper Column Text */}
        <div style={{ fontSize: 12, lineHeight: 1.5, textAlign: 'justify' }}>
          <span
            style={{
              float: 'left',
              fontSize: 42,
              lineHeight: 0.8,
              fontWeight: 900,
              paddingRight: 8,
              paddingTop: 4,
              fontFamily: 'Georgia, serif',
            }}
          >
            I
          </span>
          {bodyText}

          {/* Marker Pen Animated Highlight */}
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              fontWeight: 800,
              marginLeft: 4,
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>{highlightKeyword}</span>
            <div
              style={{
                position: 'absolute',
                left: -2,
                bottom: 1,
                height: 12,
                width: `${highlightProgress}%`,
                backgroundColor: 'rgba(250, 204, 21, 0.45)', // Fluorescent Yellow
                borderRadius: 2,
                zIndex: 1,
                transition: 'none',
              }}
            />
          </div>
        </div>

        {/* Newspaper Wire Photo Frame */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              width: '100%',
              height: 130,
              overflow: 'hidden',
              border: '1px solid #18181b',
              filter: 'grayscale(100%) contrast(120%)',
            }}
          >
            <Img
              src={imageSrc}
              alt="Newspaper Wire Photo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {imageCaption && (
            <span style={{ fontSize: 9, fontStyle: 'italic', color: '#52525b', lineHeight: 1.2 }}>
              {imageCaption}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
