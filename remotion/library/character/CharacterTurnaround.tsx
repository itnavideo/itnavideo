import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CharacterTurnaroundProps {
  title?: string;
  rotationSpeed?: number;
  showAngleMarkers?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CharacterTurnaround: React.FC<CharacterTurnaroundProps> = ({
  title = '360° Character Model Turnaround',
  rotationSpeed = 1,
  showAngleMarkers = true,
  primaryColor = '#EC4899',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // 360 degree turntable rotation angle
  const turnAngle = (frame * 2.5 * rotationSpeed) % 360;
  const rad = (turnAngle * Math.PI) / 180;
  const perspectiveScaleX = Math.cos(rad); // Smooth 3D yaw squashing

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
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(236, 72, 153, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>↻ 360° TURNTABLE</span>
          <span>•</span>
          <span>MODEL SHEET SHEET</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Turntable Canvas Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0e0b12',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Rotating Character Silhouette Form */}
        <div
          style={{
            transform: `scaleX(${perspectiveScaleX})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            filter: 'drop-shadow(0 15px 30px rgba(236, 72, 153, 0.4))',
          }}
        >
          {/* Head */}
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f43f5e' }} />
          {/* Torso */}
          <div style={{ width: 48, height: 75, borderRadius: 10, background: '#ec4899', marginTop: 6 }} />
          {/* Legs */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <div style={{ width: 14, height: 90, borderRadius: 6, background: '#be185d' }} />
            <div style={{ width: 14, height: 90, borderRadius: 6, background: '#be185d' }} />
          </div>
        </div>

        {/* Circular Turntable Base Platform */}
        <div
          style={{
            position: 'absolute',
            bottom: 45,
            width: 180,
            height: 40,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            background: 'radial-gradient(ellipse, rgba(236, 72, 153, 0.2) 0%, transparent 80%)',
          }}
        />

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#f472b6',
          }}
        >
          TURNTABLE: {Math.round(turnAngle)}° | POSE: 8-POINT ROTATION
        </div>
      </div>
    </div>
  );
};
