import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CharacterShadowProps {
  title?: string;
  sunElevationAngle?: number;
  shadowSoftness?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CharacterShadow: React.FC<CharacterShadowProps> = ({
  title = 'Planar Dynamic Character Shadow',
  sunElevationAngle = 35,
  shadowSoftness = 12,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Footstep hopping creates dynamic shadow expansion/contraction
  const hopY = Math.abs(Math.sin(frame * 0.15)) * 14;
  const shadowScale = interpolate(hopY, [0, 14], [1, 0.7]);
  const shadowAlpha = interpolate(hopY, [0, 14], [0.75, 0.4]);

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
          <span>▱ GROUND CONTACT</span>
          <span>•</span>
          <span>OCCLUSION SHADOW</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Shadow Canvas Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(to bottom, #111827 0%, #030712 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated Character Figure */}
        <div
          style={{
            transform: `translateY(${-hopY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#10b981' }} />
          <div style={{ width: 48, height: 80, borderRadius: 10, background: '#059669', marginTop: 4 }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <div style={{ width: 14, height: 70, borderRadius: 6, background: '#047857' }} />
            <div style={{ width: 14, height: 70, borderRadius: 6, background: '#047857' }} />
          </div>
        </div>

        {/* Dynamic Cast Floor Shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            width: 140 * shadowScale,
            height: 28 * shadowScale,
            borderRadius: '50%',
            background: '#000000',
            opacity: shadowAlpha,
            filter: `blur(${shadowSoftness + hopY * 0.5}px)`,
            transform: 'scaleY(0.4) skewX(-20deg)',
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
            color: '#34d399',
          }}
        >
          SOLAR ELEVATION: {sunElevationAngle}° | OCCLUSION: {Math.round(shadowAlpha * 100)}%
        </div>
      </div>
    </div>
  );
};
