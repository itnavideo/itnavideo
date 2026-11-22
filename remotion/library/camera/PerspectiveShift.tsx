import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PerspectiveShiftProps {
  title?: string;
  effectType?: 'vertigo-hitchcock' | 'dolly-zoom';
  distortionIntensity?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const PerspectiveShift: React.FC<PerspectiveShiftProps> = ({
  title = 'Vertigo Dolly Zoom (Perspective Shift)',
  effectType = 'vertigo-hitchcock',
  distortionIntensity = 1,
  primaryColor = '#F43F5E',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Hitchcock Vertigo: Background expands dramatically while Subject stays invariant size
  const bgScale = interpolate(frame % 100, [0, 50, 100], [0.8, 1.8, 0.8]);
  const fovDegree = interpolate(bgScale, [0.8, 1.8], [75, 24]);

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
            background: 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#fb7185',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⇳ HITCHCOCK EFFECT</span>
          <span>•</span>
          <span>DOLLY ZOOM</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Viewport Frame */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#08080c',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background Room Perspective expanding/compressing */}
        <div
          style={{
            position: 'absolute',
            inset: -40,
            background: 'radial-gradient(ellipse at 50% 50%, #312e81 0%, #18181b 80%)',
            transform: `scale(${bgScale})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Tunnel Lines */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'repeating-radial-gradient(circle, rgba(255,255,255,0.08) 0px, transparent 40px)',
            }}
          />
        </div>

        {/* Invariant Hero Subject (Size remains perfectly constant) */}
        <div
          style={{
            zIndex: 5,
            width: 110,
            height: 140,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 15px 35px rgba(0,0,0,0.8)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: '#ffffff',
            fontWeight: 800,
            textAlign: 'center',
            padding: 10,
          }}
        >
          <span style={{ fontSize: 24 }}>👤</span>
          <span style={{ fontSize: 11, marginTop: 6 }}>FIXED SCALE</span>
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
            color: '#fca5a5',
          }}
        >
          FOV: {fovDegree.toFixed(0)}° | BG COMPRESSION: {bgScale.toFixed(2)}x
        </div>
      </div>
    </div>
  );
};
