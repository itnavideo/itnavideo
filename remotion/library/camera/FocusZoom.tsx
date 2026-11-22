import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FocusZoomProps {
  title?: string;
  zoomFactor?: number;
  targetLabel?: string;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const FocusZoom: React.FC<FocusZoomProps> = ({
  title = 'Crash Snap Focus Zoom',
  zoomFactor = 2.4,
  targetLabel = 'CRITICAL METRIC',
  primaryColor = '#8B5CF6',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Snap punch zoom curve
  const currentZoom = interpolate(frame % 90, [0, 20, 70, 90], [1, zoomFactor, zoomFactor, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
            background: 'rgba(139, 92, 246, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#a78bfa',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🔍 RAPID PUNCH-IN</span>
          <span>•</span>
          <span>SNAP ZOOM</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Viewport Canvas with Dynamic Zoom Scale */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0b10',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Zooming Scene Container */}
        <div
          style={{
            transform: `scale(${currentZoom})`,
            transition: 'transform 0.05s ease-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '16px 28px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: 2,
              boxShadow: '0 10px 30px rgba(124, 58, 237, 0.5)',
            }}
          >
            {targetLabel}
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
            color: '#c4b5fd',
          }}
        >
          MAGNIFICATION: {currentZoom.toFixed(2)}x | VELOCITY: PUNCH RAMP
        </div>
      </div>
    </div>
  );
};
