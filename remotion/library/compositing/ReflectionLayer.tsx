import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ReflectionLayerProps {
  title?: string;
  roughness?: number;
  falloffGradient?: string;
  reflectionOpacity?: number;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const ReflectionLayer: React.FC<ReflectionLayerProps> = ({
  title = 'Planar Fresnel Reflection',
  roughness = 4,
  falloffGradient = 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 80%)',
  reflectionOpacity = 0.6,
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const pulse = Math.sin(frame * 0.08) * 4;

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
          <span>◈ FRESNEL SPECULARITY</span>
          <span>•</span>
          <span>GROUND REFLECTION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Glossy Floor Studio Stage */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#070709',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Top: Actual Hero Object */}
        <div
          style={{
            width: 140,
            height: 90,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 16,
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(236,72,153,0.3)',
            zIndex: 5,
          }}
        >
          GLOSS LOGO
        </div>

        {/* Floor Horizon Seam */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: 'rgba(255, 255, 255, 0.2)',
            margin: '8px 0',
          }}
        />

        {/* Bottom: Inverted Reflection with Gradient Alpha Falloff */}
        <div
          style={{
            width: 140,
            height: 90,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            transform: 'scaleY(-1)',
            opacity: reflectionOpacity,
            filter: `blur(${roughness}px)`,
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 16,
            color: '#ffffff',
          }}
        >
          GLOSS LOGO
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#7dd3fc',
          }}
        >
          ROUGHNESS: {roughness}px | FALLOFF: FRESNEL
        </div>
      </div>
    </div>
  );
};
