import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraDollyProps {
  title?: string;
  direction?: 'in' | 'out';
  trackLength?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraDolly: React.FC<CameraDollyProps> = ({
  title = 'Linear Camera Dolly (Push-In)',
  direction = 'in',
  trackLength = 160,
  primaryColor = '#F59E0B',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const dollyZ = interpolate(frame % 90, [0, 45, 90], direction === 'in' ? [0.8, 1.4, 0.8] : [1.4, 0.8, 1.4]);
  const cartY = interpolate(frame % 90, [0, 45, 90], [40, -40, 40]);

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
            background: 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⇈ Z-AXIS TRACK</span>
          <span>•</span>
          <span>DOLLY {direction.toUpperCase()}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Dolly Track Perspective Visualizer */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0d0d12',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Converging Dolly Track Rails */}
        <svg
          viewBox="0 0 200 300"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <line x1="70" y1="20" x2="30" y2="280" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <line x1="130" y1="20" x2="170" y2="280" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          {/* Sleepers */}
          {Array.from({ length: 8 }).map((_, idx) => (
            <line
              key={idx}
              x1={65 - idx * 4}
              y1={50 + idx * 30}
              x2={135 + idx * 4}
              y2={50 + idx * 30}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Dolly Cart Icon moving on rails */}
        <div
          style={{
            zIndex: 5,
            width: 70,
            height: 50,
            borderRadius: 8,
            background: primaryColor,
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${cartY}px) scale(${dollyZ})`,
            boxShadow: `0 10px 25px ${primaryColor}60`,
          }}
        >
          <span style={{ fontSize: 20 }}>🛒</span>
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
            color: '#fbbf24',
          }}
        >
          ZOOM/DOLLY: {dollyZ.toFixed(2)}x | RAIL DIST: {Math.round(cartY + 40)}cm
        </div>
      </div>
    </div>
  );
};
