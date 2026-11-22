import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DifferenceBlendProps {
  title?: string;
  formula?: string;
  invertSpeed?: number;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const DifferenceBlend: React.FC<DifferenceBlendProps> = ({
  title = 'Difference Blend & Inversion',
  formula = '| LayerA - LayerB | (Pixel Delta)',
  invertSpeed = 1,
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const sweepX = interpolate(frame % 90, [0, 90], [-100, 100]);

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
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            color: '#a5b4fc',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>◩ PIXEL DELTA</span>
          <span>•</span>
          <span>DIFFERENCE MODE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Difference Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 300 : 300,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0e1017',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Layer 1 Base Graphic */}
        <div
          style={{
            width: isVertical ? 200 : 280,
            height: isVertical ? 200 : 280,
            borderRadius: '50%',
            background: 'conic-gradient(#ff007a, #7928ca, #0070f3, #00dfd8, #ff007a)',
          }}
        />

        {/* Layer 2 Difference Inverting Slider */}
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 220,
            background: '#ffffff',
            mixBlendMode: 'difference',
            borderRadius: 12,
            transform: `translateX(${sweepX}px)`,
          }}
        />

        {/* Formula HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#c7d2fe',
          }}
        >
          {formula}
        </div>
      </div>
    </div>
  );
};
