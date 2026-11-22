import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ScreenBlendProps {
  title?: string;
  sourceType?: 'sparks' | 'fireworks' | 'light-leak';
  primaryColor?: string;
  formula?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const ScreenBlend: React.FC<ScreenBlendProps> = ({
  title = 'Screen Blend Compositor',
  sourceType = 'sparks',
  primaryColor = '#FBBF24',
  formula = '1 - (1 - LayerA) × (1 - LayerB)',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

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
            background: 'rgba(251, 191, 36, 0.15)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            color: '#fcd34d',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>☼ ADDITIVE LUMINANCE</span>
          <span>•</span>
          <span>SCREEN MODE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Screen Mode Monitor Frame */}
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
        {/* Dark Background Subject (Night skyline or silhouette) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #0f172a 0%, #1e1b4b 100%)',
          }}
        />

        {/* Screen blended fireworks / lens flare (black box completely disappears) */}
        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor} 0%, rgba(245, 158, 11, 0.6) 40%, transparent 70%)`,
            mixBlendMode: 'screen',
            transform: `scale(${1 + Math.sin(frame * 0.1) * 0.15})`,
            filter: 'blur(10px)',
          }}
        />

        {/* Luminous Core Text */}
        <div
          style={{
            zIndex: 5,
            fontSize: isVertical ? 28 : 36,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: 3,
            textShadow: `0 0 30px ${primaryColor}`,
            mixBlendMode: 'screen',
          }}
        >
          PURE LIGHT
        </div>

        {/* Formula HUD Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#fbbf24',
          }}
        >
          {formula}
        </div>
      </div>
    </div>
  );
};
