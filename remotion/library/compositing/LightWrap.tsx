import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LightWrapProps {
  title?: string;
  lightIntensity?: number;
  wrapWidth?: number;
  lightColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const LightWrap: React.FC<LightWrapProps> = ({
  title = 'Optical Light Wrap VFX',
  lightIntensity = 0.85,
  wrapWidth = 24,
  lightColor = '#38BDF8',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const pulse = Math.sin(frame * 0.08) * 6;

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
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>☼ PHOTOMETRIC INTEGRATION</span>
          <span>•</span>
          <span>LIGHT WRAP</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Light Wrap Studio Frame */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#07070a',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Blinding Background Light Source */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 30%, ${lightColor} 0%, #0369a1 40%, #020617 80%)`,
            opacity: 0.8,
          }}
        />

        {/* Foreground Subject Silhouette */}
        <div
          style={{
            zIndex: 4,
            width: isVertical ? 160 : 200,
            height: isVertical ? 200 : 220,
            borderRadius: '50% 50% 10% 10%',
            background: '#09090b',
            boxShadow: `inset 0 0 ${wrapWidth + pulse}px ${lightColor}`,
            border: `1px solid ${lightColor}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#a1a1aa' }}>SUBJECT SILHOUETTE</span>
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#7dd3fc',
          }}
        >
          EDGE BLEED: {wrapWidth}px | INTENSITY: {Math.round(lightIntensity * 100)}%
        </div>
      </div>
    </div>
  );
};
