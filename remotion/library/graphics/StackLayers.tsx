import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StackLayerItem {
  layer: string;
  desc: string;
  color: string;
}

export interface StackLayersProps {
  headline?: string;
  layers?: StackLayerItem[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_LAYERS: StackLayerItem[] = [
  { layer: 'Layer 1: Presentation & UI', desc: 'Next.js App Router & Tailwind CSS', color: '#38bdf8' },
  { layer: 'Layer 2: AI Orchestration', desc: 'Gemini 2.0 Scene Direction & Prompts', color: '#f59e0b' },
  { layer: 'Layer 3: Video Render Grid', desc: 'Remotion Cloud AWS Lambda Cluster', color: '#10b981' },
];

/**
 * StackLayers — 3D expanding deck of architectural layers.
 * Shows isometric/flat translucent planes expanding upward into an exploded tier hierarchy.
 */
export function StackLayers({
  headline = '3-TIER OPERATIONAL STACK',
  layers = DEFAULT_LAYERS,
  accentColor = '#38bdf8',
  delay = 0,
  width = 460,
  height = 360,
}: StackLayersProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const expandSpr = spring({
    frame: Math.max(0, t - 10),
    fps,
    config: { damping: 14, stiffness: 70 },
  });

  const separation = interpolate(expandSpr, [0, 1], [0, 24]);

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
          STACK ISOLATION
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* 3D Stack Stage */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: separation, padding: '0 20px', transition: 'gap 0.2s' }}>
        {layers.map((l, i) => (
          <div
            key={l.layer}
            style={{
              padding: '12px 18px',
              borderRadius: 14,
              background: `linear-gradient(135deg, rgba(255,255,255,0.06), ${l.color}22)`,
              border: `1.5px solid ${l.color}`,
              boxShadow: `0 10px 20px rgba(0,0,0,0.7), 0 0 16px ${l.color}33`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>{l.layer}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{l.desc}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>
        LOOSELY COUPLED • HIGHLY COHESIVE ARCHITECTURE
      </div>
    </div>
  );
}
