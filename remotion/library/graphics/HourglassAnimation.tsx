import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HourglassAnimationProps {
  headline?: string;
  timeRemainingText?: string;
  subtext?: string;
  sandColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * HourglassAnimation — Finite time & urgency hourglass storytelling graphic.
 * Renders descending particle sand stream draining from top chamber into bottom collection pile.
 */
export function HourglassAnimation({
  headline = 'THE WINDOW OF OPPORTUNITY IS CLOSING',
  timeRemainingText = 'LIMITED FIRST-MOVER ADVANTAGE',
  subtext = 'Those who adopt automated video now win 80% market share',
  sandColor = '#f59e0b',
  delay = 0,
  width = 440,
  height = 400,
}: HourglassAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  // Sand drainage ratio (0 to 1)
  const drainRatio = Math.min(1, t / 90);
  const topSandHeight = 35 * (1 - drainRatio);
  const bottomSandHeight = 35 * drainRatio;

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
        <div style={{ fontSize: 10, fontWeight: 800, color: sandColor, letterSpacing: '0.12em' }}>
          TIME DEFICIT PARADOX
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* SVG Hourglass Structure */}
      <div style={{ position: 'relative', width: 140, height: 180 }}>
        <svg width="100%" height="100%" viewBox="0 0 140 180" style={{ overflow: 'visible' }}>
          {/* Outer Glass Contour */}
          <path
            d="M 20 20 L 120 20 L 75 90 L 120 160 L 20 160 L 65 90 Z"
            fill="rgba(255, 255, 255, 0.04)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Top Sand Fill */}
          <polygon
            points={`
              ${20 + drainRatio * 20},${20 + drainRatio * 35} 
              ${120 - drainRatio * 20},${20 + drainRatio * 35} 
              70,90
            `}
            fill={sandColor}
            opacity={1 - drainRatio * 0.8}
          />

          {/* Falling Sand Stream Line */}
          {drainRatio < 0.98 && (
            <line
              x1="70"
              y1="85"
              x2="70"
              y2="155"
              stroke={sandColor}
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
          )}

          {/* Bottom Accumulating Sand Pyramid */}
          <polygon
            points={`
              ${70 - bottomSandHeight},160 
              ${70 + bottomSandHeight},160 
              70,${160 - bottomSandHeight}
            `}
            fill={sandColor}
          />
        </svg>
      </div>

      {/* Narrative Footer */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>
          {timeRemainingText}
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
          {subtext}
        </div>
      </div>
    </div>
  );
}
