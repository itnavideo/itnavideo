import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface EndNodeProps {
  label?: string;
  statusCode?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * EndNode — Flowchart double-concentric terminal exit node.
 * Formal visual representation for completion, exit states, and error halts.
 */
export function EndNode({
  label = 'PROCESS COMPLETE',
  statusCode = 'Status: 200 OK / Success',
  accentColor = '#ef4444',
  delay = 0,
  width = 190,
  height = 70,
}: EndNodeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(9,9,11,0.9) 100%)',
        borderRadius: 9999, // Stadium / Pill terminal shape
        border: `2px solid ${accentColor}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 20px ${accentColor}33`,
        opacity: intro,
        transform: `scale(${interpolate(intro, [0, 1], [0.9, 1])})`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Concentric Double-Ring Stop Icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `2px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 3,
            background: accentColor,
          }}
        />
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color: '#fca5a5', marginTop: 1 }}>
          {statusCode}
        </div>
      </div>
    </div>
  );
}
