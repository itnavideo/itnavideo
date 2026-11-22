import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BlendModeLayerProps {
  title?: string;
  blendMode?: 'screen' | 'multiply' | 'overlay' | 'difference' | 'color-dodge';
  opacity?: number;
  showChannelMeters?: boolean;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const BlendModeLayer: React.FC<BlendModeLayerProps> = ({
  title = 'Blend Mode Layer Matrix',
  blendMode = 'screen',
  opacity = 0.9,
  showChannelMeters = true,
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const rotate = frame * 1.2;

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
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#c084fc',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>◈ COMPOSITING MODE</span>
          <span>•</span>
          <span>MIX-BLEND: {blendMode.toUpperCase()}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Visual Canvas Demonstrating Intersection Blend */}
      <div
        style={{
          width: isVertical ? '95%' : '70%',
          height: isVertical ? 300 : 300,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#050508',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Layer A (Base) */}
        <div
          style={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #3b82f6 0%, #1e1b4b 70%)',
            transform: 'translateX(-40px)',
          }}
        />

        {/* Layer B (Top Blend Layer) */}
        <div
          style={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ec4899 0%, #831843 70%)',
            transform: 'translateX(40px)',
            mixBlendMode: blendMode,
            opacity,
          }}
        />

        {/* Rotating Geometric Overlay */}
        <div
          style={{
            position: 'absolute',
            width: 120,
            height: 120,
            border: '2px dashed #fbbf24',
            transform: `rotate(${rotate}deg)`,
            mixBlendMode: blendMode,
          }}
        />

        {/* HUD Overlay */}
        {showChannelMeters && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              display: 'flex',
              gap: 12,
              background: 'rgba(0,0,0,0.7)',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#a1a1aa',
            }}
          >
            <span>R: 88%</span>
            <span>G: 64%</span>
            <span>B: 95%</span>
            <span style={{ color: '#c084fc' }}>OPACITY: {Math.round(opacity * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
