import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FoldingAnimationProps {
  headline?: string;
  summaryText?: string;
  foldedBadge?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * FoldingAnimation — Compact pocket folding storytelling animation.
 * Folds expanded documentation or specs down into a concise encapsulated summary card.
 */
export function FoldingAnimation({
  headline = 'DISTILLING COMPLEXITY INTO SIMPLICITY',
  summaryText = 'Entire 60-page PDF compressed into an actionable 90-second video script.',
  foldedBadge = 'COMPACT POCKET FORMAT',
  accentColor = '#10b981',
  delay = 0,
  width = 460,
  height = 320,
}: FoldingAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const foldSpr = spring({
    frame: Math.max(0, t - 10),
    fps,
    config: { damping: 14, stiffness: 70 },
  });

  const foldAngle = interpolate(foldSpr, [0, 1], [0, 85]);

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
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          INFORMATION DENSITY
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Folding Card Body */}
      <div
        style={{
          perspective: 800,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Top Folding Half */}
        <div
          style={{
            width: 280,
            height: 60,
            borderRadius: '12px 12px 0 0',
            background: 'linear-gradient(180deg, #27272a, #18181b)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            transformOrigin: 'bottom center',
            transform: `rotateX(${foldAngle}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 800,
            color: accentColor,
            boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
          }}
        >
          {foldedBadge}
        </div>

        {/* Base Resting Half */}
        <div
          style={{
            width: 280,
            height: 70,
            borderRadius: '0 0 12px 12px',
            background: '#18181b',
            border: `1.5px solid ${accentColor}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            textAlign: 'center',
            fontSize: 11,
            color: '#e2e8f0',
            lineHeight: 1.35,
            boxShadow: '0 12px 24px rgba(0,0,0,0.7)',
          }}
        >
          {summaryText}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>
        FOLDED COMPACTLY FOR ZERO COGNITIVE OVERLOAD
      </div>
    </div>
  );
}
