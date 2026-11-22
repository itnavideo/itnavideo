import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MultiplyBlendProps {
  title?: string;
  textureType?: 'parchment' | 'kraft-paper' | 'canvas';
  formula?: string;
  inkColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const MultiplyBlend: React.FC<MultiplyBlendProps> = ({
  title = 'Multiply Blend (Ink & Texture)',
  textureType = 'parchment',
  formula = 'Output = LayerA × LayerB',
  inkColor = '#1e1b4b',
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
            background: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid rgba(217, 119, 6, 0.4)',
            color: '#f59e0b',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⬤ SUBTRACTIVE PIGMENT</span>
          <span>•</span>
          <span>MULTIPLY MODE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Multiply Blend Preview Frame */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 300 : 300,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#d6c7a1', // Textured paper look
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Subtle Paper Fiber Grain */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(#b89f70 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
            opacity: 0.35,
          }}
        />

        {/* Ink Layer multiplied into fibers */}
        <div
          style={{
            zIndex: 4,
            width: isVertical ? 220 : 320,
            height: 160,
            borderRadius: 12,
            background: inkColor,
            mixBlendMode: 'multiply',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fef3c7',
            padding: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 2 }}>PRINTED INK</div>
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>
            White values vanish completely into background
          </div>
        </div>

        {/* Formula HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.75)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#fef08a',
          }}
        >
          {formula}
        </div>
      </div>
    </div>
  );
};
