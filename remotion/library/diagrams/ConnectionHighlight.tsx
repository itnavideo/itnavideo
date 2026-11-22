import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ConnectionHighlightProps {
  pathLabel?: string;
  sourceNode?: string;
  targetNode?: string;
  statusBadge?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ConnectionHighlight — Active trace illumination overlay for emphasizing critical execution paths.
 * Highlights primary dependencies or execution channels in enterprise diagrams.
 */
export function ConnectionHighlight({
  pathLabel = 'CRITICAL PATH ACTIVATED',
  sourceNode = 'API Gateway',
  targetNode = 'Auth Service Cluster',
  statusBadge = 'Latency 1.2ms',
  accentColor = '#f59e0b',
  delay = 0,
  width = 440,
  height = 90,
}: ConnectionHighlightProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const pulse = 0.85 + Math.sin(t * 0.12) * 0.15;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        boxSizing: 'border-box',
        background: 'linear-gradient(90deg, rgba(245,158,11,0.15) 0%, rgba(24,24,27,0.95) 50%, rgba(245,158,11,0.15) 100%)',
        borderRadius: 16,
        border: `1.5px solid ${accentColor}`,
        boxShadow: `0 0 ${20 * pulse}px ${accentColor}44`,
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Left Node & Source */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
        <div>
          <div style={{ fontSize: 10, color: accentColor, fontWeight: 800, letterSpacing: '0.1em' }}>
            {pathLabel}
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
            {sourceNode} <span style={{ color: accentColor }}>→</span> {targetNode}
          </div>
        </div>
      </div>

      {/* Latency Pill */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '4px 10px',
          borderRadius: 8,
          fontSize: 10,
          fontWeight: 700,
          color: '#cbd5e1',
        }}
      >
        {statusBadge}
      </div>
    </div>
  );
}
