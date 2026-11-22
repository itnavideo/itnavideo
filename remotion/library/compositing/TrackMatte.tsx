import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TrackMatteProps {
  title?: string;
  sourceLayerName?: string;
  matteLayerName?: string;
  mode?: 'alpha' | 'alpha-inverted' | 'luma' | 'luma-inverted';
  accentColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const TrackMatte: React.FC<TrackMatteProps> = ({
  title = 'Track Matte Compositor',
  sourceLayerName = 'Layer 2: Neon Core Footage',
  matteLayerName = 'Layer 1: Typography Shape Stencil',
  mode = 'alpha',
  accentColor = '#3B82F6',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const sweep = interpolate(frame % 75, [0, 75], [-120, 120]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '32px 20px' : '40px 48px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isVertical ? 20 : 28,
          opacity: anim,
          transform: `translateY(${interpolate(anim, [0, 1], [-15, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(59, 130, 246, 0.12)',
            border: `1px solid ${accentColor}40`,
            color: accentColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>▨ TRACK MATTE</span>
          <span>•</span>
          <span>MODE: {mode.toUpperCase()}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Layer Stack Diagram & Monitor */}
      <div
        style={{
          width: isVertical ? '95%' : '80%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Matte Layer (Top) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderRadius: 12,
            background: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#e4e4e7',
                boxShadow: '0 0 8px #ffffff',
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f4f4f5' }}>{matteLayerName}</div>
              <div style={{ fontSize: 11, color: '#71717a' }}>Role: Mask / Stencil Driver</div>
            </div>
          </div>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: 'rgba(255, 255, 255, 0.08)',
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#a1a1aa',
            }}
          >
            MATTE: ACTIVE
          </div>
        </div>

        {/* Dynamic Linker Arrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: accentColor,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span>↓ APPLIES TO TARGET LAYER ↓</span>
        </div>

        {/* Target Source Layer (Bottom) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderRadius: 12,
            background: '#141418',
            border: `1px solid ${accentColor}50`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f4f4f5' }}>{sourceLayerName}</div>
              <div style={{ fontSize: 11, color: accentColor }}>TrkMat: [{mode.toUpperCase()}]</div>
            </div>
          </div>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: `${accentColor}20`,
              fontSize: 11,
              fontFamily: 'monospace',
              color: accentColor,
            }}
          >
            PIXEL MERGED
          </div>
        </div>

        {/* Viewport Preview */}
        <div
          style={{
            height: isVertical ? 160 : 180,
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: '#0d0d10',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, #1e1b4b 70%, transparent 100%)`,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              zIndex: 3,
              fontSize: isVertical ? 28 : 36,
              fontWeight: 900,
              letterSpacing: 4,
              color: '#ffffff',
              textShadow: '0 0 20px rgba(59,130,246,0.8)',
              transform: `translateX(${sweep}px)`,
            }}
          >
            MATTE TRACK
          </div>
        </div>
      </div>
    </div>
  );
};
