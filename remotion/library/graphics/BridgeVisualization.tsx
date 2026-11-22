import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BridgeVisualizationProps {
  headline?: string;
  sourceIsland?: string;
  targetIsland?: string;
  bridgeName?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * BridgeVisualization — Chasm-crossing bridge narrative graphic.
 * Connects current painful friction points to automated dream outcomes via a suspension bridge.
 */
export function BridgeVisualization({
  headline = 'BRIDGING THE RETENTION CHASM',
  sourceIsland = 'Hours of Manual Cutting & Burnout',
  targetIsland = '100+ Automated Viral Reels Monthly',
  bridgeName = 'ITNAVIDEO AI PIPELINE',
  accentColor = '#f59e0b',
  delay = 0,
  width = 540,
  height = 360,
}: BridgeVisualizationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const bridgeProgress = interpolate(
    spring({
      frame: Math.max(0, t - 10),
      fps,
      config: { damping: 16, stiffness: 60 },
    }),
    [0, 1],
    [0, 1]
  );

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
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
          TRANSFORMATION BLUEPRINT
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Main Bridge Stage */}
      <div style={{ position: 'relative', width: '100%', height: 180, display: 'flex', alignItems: 'center' }}>
        {/* Left Pain Island */}
        <div
          style={{
            width: 140,
            padding: '12px 10px',
            borderRadius: 14,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1.5px solid #ef4444',
            textAlign: 'center',
            zIndex: 3,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, color: '#ef4444' }}>CURRENT STATE</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', marginTop: 4, lineHeight: 1.25 }}>
            {sourceIsland}
          </div>
        </div>

        {/* Center Suspension Bridge Span */}
        <div style={{ flex: 1, position: 'relative', height: 100, margin: '0 10px' }}>
          <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Bridge Roadway */}
            <line
              x1="0"
              y1="50"
              x2="100%"
              y2="50"
              stroke={accentColor}
              strokeWidth="4"
              strokeDasharray="300"
              strokeDashoffset={interpolate(bridgeProgress, [0, 1], [300, 0])}
            />

            {/* Suspension Cable Arc */}
            <path
              d="M 0 10 Q 110 50, 220 10"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity={bridgeProgress}
            />
          </svg>

          {/* Bridge Center Badge */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#18181b',
              border: `1.5px solid ${accentColor}`,
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 900,
              color: accentColor,
              boxShadow: `0 0 16px ${accentColor}44`,
              whiteSpace: 'nowrap',
              opacity: bridgeProgress > 0.8 ? 1 : 0,
            }}
          >
            {bridgeName}
          </div>
        </div>

        {/* Right Desired Island */}
        <div
          style={{
            width: 140,
            padding: '12px 10px',
            borderRadius: 14,
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1.5px solid #22c55e',
            textAlign: 'center',
            zIndex: 3,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, color: '#22c55e' }}>FUTURE STATE</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', marginTop: 4, lineHeight: 1.25 }}>
            {targetIsland}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>
        TURNING HIGH RESISTANCE CHASM INTO UNIMPEDED THROUGHPUT
      </div>
    </div>
  );
}
