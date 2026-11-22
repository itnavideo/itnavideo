import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EdgeMatteProps {
  title?: string;
  feather?: number;
  chokeValue?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const EdgeMatte: React.FC<EdgeMatteProps> = ({
  title = 'Edge Matte Refinement & Choker',
  feather = 12,
  chokeValue = -4,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const pulse = Math.sin(frame * 0.1) * 3;

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
          <span>▱ SUB-PIXEL ANTI-ALIASING</span>
          <span>•</span>
          <span>EDGE MATTE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Edge Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 300 : 300,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0a0d',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated Choked Outline */}
        <div
          style={{
            width: isVertical ? 170 : 220,
            height: isVertical ? 170 : 220,
            borderRadius: 28,
            border: `2px dashed ${primaryColor}`,
            boxShadow: `0 0 ${feather + pulse}px ${primaryColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(16, 185, 129, 0.08)',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f4f4f5' }}>MATTE CORE</span>
          <span style={{ fontSize: 11, color: '#a1a1aa', marginTop: 4 }}>
            Feather: {feather}px | Choke: {chokeValue}px
          </span>
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
            color: '#34d399',
          }}
        >
          EDGE PROFILE: GAUSSIAN ROLLOFF
        </div>
      </div>
    </div>
  );
};
