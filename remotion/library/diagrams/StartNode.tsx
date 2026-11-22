import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StartNodeProps {
  label?: string;
  triggerType?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * StartNode — Flowchart entry terminal stadium node.
 * Formal visual representation for the initiating trigger or entry state of an algorithm/process.
 */
export function StartNode({
  label = 'PROCESS START',
  triggerType = 'HTTP Webhook Triggered',
  accentColor = '#22c55e',
  delay = 0,
  width = 200,
  height = 70,
}: StartNodeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const pulse = 0.8 + Math.sin(t * 0.12) * 0.2;

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
        background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(9,9,11,0.9) 100%)',
        borderRadius: 9999, // Stadium / Pill terminal shape
        border: `2px solid ${accentColor}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 20px ${accentColor}33`,
        opacity: intro,
        transform: `scale(${interpolate(intro, [0, 1], [0.9, 1])})`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Initiation Play Icon Dot */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 ${12 * pulse}px ${accentColor}`,
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000000" style={{ marginLeft: 2 }}>
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color: '#86efac', marginTop: 1 }}>
          {triggerType}
        </div>
      </div>
    </div>
  );
}
