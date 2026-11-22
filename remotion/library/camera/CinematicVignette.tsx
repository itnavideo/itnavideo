import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CinematicVignetteProps {
  title?: string;
  darkness?: number;
  falloffRadius?: number;
  shape?: 'circular' | 'anamorphic-oval';
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CinematicVignette: React.FC<CinematicVignetteProps> = ({
  title = 'Optical Lens Vignette',
  darkness = 0.85,
  falloffRadius = 55,
  shape = 'anamorphic-oval',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const pulse = Math.sin(frame * 0.08) * 4;

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
      {/* Title */}
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
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#e4e4e7',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>◐ PERIPHERAL FALLOFF</span>
          <span>•</span>
          <span>ANAMORPHIC VIGNETTE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Vignette Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 50%, #312e81 0%, #1e1b4b 50%, #0f172a 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Optical Vignette Shadow Mask */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(${shape === 'circular' ? 'circle' : 'ellipse'} at 50% 50%, transparent ${falloffRadius + pulse}%, rgba(0,0,0,${darkness}) 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Hero Focus Badge */}
        <div
          style={{
            zIndex: 4,
            padding: '12px 24px',
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>CENTER CLARITY</div>
          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
            Optical intensity concentrated at focal axis
          </div>
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#cbd5e1',
          }}
        >
          FALLOFF: {Math.round(falloffRadius)}% | DENSITY: {Math.round(darkness * 100)}%
        </div>
      </div>
    </div>
  );
};
