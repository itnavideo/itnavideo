import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraProjectionProps {
  title?: string;
  projectionAngle?: number;
  frustumColor?: string;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraProjection: React.FC<CameraProjectionProps> = ({
  title = '2.5D Camera Projection Mapping',
  projectionAngle = 35,
  frustumColor = '#38BDF8',
  primaryColor = '#0284C7',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const tilt = interpolate(Math.sin(frame * 0.05), [-1, 1], [-12, 12]);

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
        perspective: 900,
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
            background: 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#38bdf8',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>◸ 2.5D CAMERA MAP</span>
          <span>•</span>
          <span>PROJECTION CONE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Projection Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0a0f',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Projected Frustum Ray Pyramid */}
        <svg
          viewBox="0 0 300 240"
          style={{
            position: 'absolute',
            width: '85%',
            height: '85%',
            transform: `rotateY(${tilt}deg)`,
          }}
        >
          {/* Origin Projector Camera */}
          <circle cx="50" cy="120" r="10" fill={frustumColor} />
          {/* Frustum Rays */}
          <line x1="50" y1="120" x2="250" y2="40" stroke={frustumColor} strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="50" y1="120" x2="250" y2="200" stroke={frustumColor} strokeWidth="1.5" strokeDasharray="4 4" />
          {/* 3D Geometry Screen Plane */}
          <polygon
            points="250,40 280,70 280,170 250,200"
            fill="rgba(56, 189, 248, 0.2)"
            stroke={frustumColor}
            strokeWidth="2"
          />
        </svg>

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
            color: '#7dd3fc',
          }}
        >
          FRUSTUM: {projectionAngle}° | PROJECTION: SPATIAL 2.5D
        </div>
      </div>
    </div>
  );
};
