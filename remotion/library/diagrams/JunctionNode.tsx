import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface JunctionNodeProps {
  label?: string;
  sublabel?: string;
  northActive?: boolean;
  southActive?: boolean;
  eastActive?: boolean;
  westActive?: boolean;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * JunctionNode — 4-way crossroad junction distribution hub.
 * Visualizes electrical solder point or data bus splitting into cardinal pathways.
 */
export function JunctionNode({
  label = 'Junction X-4',
  sublabel = 'Bus Splitter',
  northActive = true,
  southActive = true,
  eastActive = true,
  westActive = true,
  accentColor = '#10b981',
  delay = 0,
  width = 120,
  height = 120,
}: JunctionNodeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const center = 60;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Cardinal Wire Stems */}
        {northActive && <line x1={center} y1={0} x2={center} y2={center} stroke={accentColor} strokeWidth={2} />}
        {southActive && <line x1={center} y1={center} x2={center} y2={120} stroke={accentColor} strokeWidth={2} />}
        {westActive && <line x1={0} y1={center} x2={center} y2={center} stroke={accentColor} strokeWidth={2} />}
        {eastActive && <line x1={center} y1={center} x2={120} y2={center} stroke={accentColor} strokeWidth={2} />}

        {/* Central Solder Junction Dot */}
        <circle
          cx={center}
          cy={center}
          r={10}
          fill={accentColor}
          boxShadow={`0 0 12px ${accentColor}`}
        />
        <circle cx={center} cy={center} r={4} fill="#ffffff" />
      </svg>

      {/* Junction Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          right: 4,
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '2px 6px',
          borderRadius: 4,
          fontSize: 8,
          fontWeight: 700,
          color: '#ffffff',
        }}
      >
        {label}
      </div>
    </div>
  );
}
