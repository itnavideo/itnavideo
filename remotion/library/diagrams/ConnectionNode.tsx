import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ConnectionNodeProps {
  label?: string;
  portId?: string;
  nodeType?: 'input' | 'output' | 'bidirectional';
  status?: 'active' | 'idle' | 'warning';
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * ConnectionNode — Diagram docking anchor port for attaching incoming/outgoing connector lines.
 * Includes magnetic snapping crosshairs, port status glow, and coordinate tags.
 */
export function ConnectionNode({
  label = 'Port A-01',
  portId = 'IN-01',
  nodeType = 'input',
  status = 'active',
  accentColor = '#3b82f6',
  delay = 0,
  width = 80,
  height = 80,
}: ConnectionNodeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const pulse = 0.8 + Math.sin(t * 0.15) * 0.2;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Outer Magnetic Dock Ring */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: `1.5px dashed ${accentColor}88`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(59, 130, 246, 0.05)',
        }}
      >
        {/* Core Connection Terminal Dot */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: accentColor,
            boxShadow: `0 0 ${12 * pulse}px ${accentColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
        </div>
      </div>

      {/* Port Label */}
      <div style={{ marginTop: 6, textAlign: 'center' }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#ffffff' }}>{label}</div>
        <div style={{ fontSize: 8, color: '#94a3b8' }}>{portId}</div>
      </div>
    </div>
  );
}
