import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraParallaxProps {
  title?: string;
  speedRatio?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraParallax: React.FC<CameraParallaxProps> = ({
  title = 'Multi-Speed 3D Camera Parallax',
  speedRatio = 1,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // 3 Differential parallax speeds based on distance Z
  const bgX = interpolate(frame % 120, [0, 60, 120], [-15, 15, -15]);
  const midX = interpolate(frame % 120, [0, 60, 120], [-45, 45, -45]);
  const fgX = interpolate(frame % 120, [0, 60, 120], [-90, 90, -90]);

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
            background: 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>▤ DEPTH DIFFERENTIATION</span>
          <span>•</span>
          <span>MULTI-LAYER PARALLAX</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Parallax Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#090a0f',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Layer 1: Distant Background Stars / Sky (0.2x speed) */}
        <div
          style={{
            position: 'absolute',
            inset: -30,
            background: 'radial-gradient(ellipse at 50% 50%, #1e1b4b 0%, #09090b 80%)',
            transform: `translateX(${bgX}px)`,
            opacity: 0.8,
          }}
        />

        {/* Layer 2: Midground City Skyline (0.5x speed) */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            gap: 20,
            transform: `translateX(${midX}px)`,
            opacity: 0.6,
          }}
        >
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: 32,
                height: 70 + (idx % 3) * 30,
                background: '#4f46e5',
                borderRadius: '4px 4px 0 0',
              }}
            />
          ))}
        </div>

        {/* Layer 3: Foreground Hero Pillars (1.0x speed) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            width: '120%',
            transform: `translateX(${fgX}px)`,
            zIndex: 5,
          }}
        >
          <div style={{ width: 45, height: 180, background: primaryColor, borderRadius: '8px 8px 0 0' }} />
          <div style={{ width: 45, height: 180, background: primaryColor, borderRadius: '8px 8px 0 0' }} />
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#34d399',
            zIndex: 10,
          }}
        >
          FG: 1.0x | MID: 0.5x | BG: 0.2x
        </div>
      </div>
    </div>
  );
};
