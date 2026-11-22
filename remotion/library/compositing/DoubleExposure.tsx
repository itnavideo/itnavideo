import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DoubleExposureProps {
  title?: string;
  silhouetteType?: 'human-profile' | 'geometric-circle' | 'nature-tree';
  primaryColor?: string;
  accentColor?: string;
  grainIntensity?: number;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const DoubleExposure: React.FC<DoubleExposureProps> = ({
  title = 'Cinematic Double Exposure',
  silhouetteType = 'human-profile',
  primaryColor = '#F43F5E',
  accentColor = '#8B5CF6',
  grainIntensity = 0.2,
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const panY = interpolate(frame % 120, [0, 120], [0, -40]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
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
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fb7185',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>◐ SILHOUETTE BLENDING</span>
          <span>•</span>
          <span>DOUBLE EXPOSURE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Double Exposure Viewport Frame */}
      <div
        style={{
          width: isVertical ? '85%' : '55%',
          height: isVertical ? 360 : 340,
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: '#09090b',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9)',
        }}
      >
        {/* Base Profile Silhouette (Black & White high contrast base) */}
        <svg
          viewBox="0 0 300 400"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          <path
            d="M 50,400 Q 50,280 110,240 Q 90,210 90,170 Q 90,100 150,70 Q 220,100 220,170 Q 220,210 200,240 Q 260,280 260,400 Z"
            fill="#ffffff"
          />
        </svg>

        {/* Secondary Forest / Galaxy Exposure blending in screen mode */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 60%, ${primaryColor} 0%, ${accentColor} 50%, #1e1b4b 100%)`,
            mixBlendMode: 'multiply',
            transform: `translateY(${panY}px)`,
          }}
        />

        {/* Dynamic Light Rays Accent */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.4) 30deg, transparent 60deg)',
            mixBlendMode: 'screen',
            opacity: 0.6,
          }}
        />

        {/* Inner Label */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 18,
            fontSize: 11,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 10px',
            borderRadius: 6,
          }}
        >
          BLEND: SCREEN × MULTIPLY
        </div>
      </div>
    </div>
  );
};
