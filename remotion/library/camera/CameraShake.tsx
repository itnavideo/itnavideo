import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraShakeProps {
  title?: string;
  intensity?: number;
  frequency?: number;
  shakeType?: 'handheld' | 'earthquake' | 'explosion';
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraShake: React.FC<CameraShakeProps> = ({
  title = 'Handheld Organic Camera Shake',
  intensity = 8,
  frequency = 1.2,
  shakeType = 'handheld',
  primaryColor = '#EF4444',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Deterministic pseudo-random handheld micro-jitter
  const shakeX = Math.sin(frame * 0.4 * frequency) * intensity + Math.cos(frame * 0.7 * frequency) * (intensity * 0.5);
  const shakeY = Math.cos(frame * 0.3 * frequency) * (intensity * 0.8) + Math.sin(frame * 0.9 * frequency) * (intensity * 0.4);
  const shakeRot = Math.sin(frame * 0.25 * frequency) * (intensity * 0.15);

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
            background: 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#f87171',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>〰 DYNAMIC JITTER</span>
          <span>•</span>
          <span>{shakeType.toUpperCase()} MOTION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Shaking Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0a0e',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Shaken Content Container */}
        <div
          style={{
            width: '110%',
            height: '110%',
            position: 'absolute',
            background: 'radial-gradient(circle at 50% 50%, #450a0a 0%, #18181b 80%)',
            transform: `translate(${shakeX}px, ${shakeY}px) rotate(${shakeRot}deg)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 900, color: '#fca5a5', letterSpacing: 3 }}>
            ACTION SCENE
          </div>
          <div style={{ fontSize: 13, color: '#f87171', marginTop: 6 }}>
            Kinetic handheld realism simulation
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
            color: '#fca5a5',
          }}
        >
          DX: {shakeX.toFixed(1)}px | DY: {shakeY.toFixed(1)}px | ROT: {shakeRot.toFixed(2)}°
        </div>
      </div>
    </div>
  );
};
