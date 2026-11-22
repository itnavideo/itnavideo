import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LumaMatteProps {
  title?: string;
  subtitle?: string;
  inverted?: boolean;
  contrast?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const LumaMatte: React.FC<LumaMatteProps> = ({
  title = 'Luminance Matte Engine',
  subtitle = 'Extracting transparency based on high-contrast grayscale luma values',
  inverted = false,
  contrast = 1.4,
  primaryColor = '#F59E0B',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 15, stiffness: 90 } });
  const pulse = Math.sin(frame * 0.08) * 10;
  const lumaThreshold = interpolate(frame % 90, [0, 45, 90], [10, 85, 10]);

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
        padding: isVertical ? '32px 20px' : '48px 40px',
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
          transform: `translateY(${interpolate(anim, [0, 1], [-15, 0])}px)`,
          opacity: anim,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            borderRadius: 9999,
            background: 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: 8,
          }}
        >
          <span>◐ LUMA MATTE</span>
          <span>•</span>
          <span>{inverted ? 'INVERTED LUMA' : 'STANDARD LUMA'}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
        <p style={{ margin: '6px 0 0', fontSize: isVertical ? 13 : 15, color: '#a1a1aa' }}>{subtitle}</p>
      </div>

      {/* Visual Workspace Split: Luma Channel vs Output */}
      <div
        style={{
          width: isVertical ? '95%' : '75%',
          display: 'grid',
          gridTemplateColumns: isVertical ? '1fr' : '1fr 1fr',
          gap: 16,
          height: isVertical ? 380 : 260,
        }}
      >
        {/* Left: Raw Grayscale Luma Map */}
        <div
          style={{
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: '#121215',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 14,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#a1a1aa', letterSpacing: 1 }}>
            INPUT: GRAYSCALE LUMA MAP
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at ${50 + pulse}% 50%, #ffffff 0%, #71717a 40%, #000000 85%)`,
              filter: `contrast(${contrast})`,
              mixBlendMode: inverted ? 'difference' : 'normal',
            }}
          />
          <div
            style={{
              zIndex: 2,
              marginTop: 'auto',
              background: 'rgba(0,0,0,0.7)',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#fbbf24',
              alignSelf: 'flex-start',
            }}
          >
            ISO LUMA: {Math.round(lumaThreshold)}%
          </div>
        </div>

        {/* Right: Matted Composite Video Layer */}
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${primaryColor}50`,
            background: '#0e0e11',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 14,
            boxShadow: `0 10px 30px -10px ${primaryColor}20`,
          }}
        >
          <div style={{ zIndex: 3, fontSize: 11, fontWeight: 700, color: primaryColor, letterSpacing: 1 }}>
            COMPOSITE OUTPUT (MATTED LAYER)
          </div>

          {/* Under-layer colorful visual */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
              maskImage: `radial-gradient(circle at ${50 + pulse}% 50%, black 20%, transparent 80%)`,
              WebkitMaskImage: `radial-gradient(circle at ${50 + pulse}% 50%, black 20%, transparent 80%)`,
            }}
          />

          <div
            style={{
              zIndex: 3,
              marginTop: 'auto',
              background: 'rgba(0,0,0,0.7)',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#34d399',
              alignSelf: 'flex-start',
            }}
          >
            OPACITY = LUMA(Y)
          </div>
        </div>
      </div>
    </div>
  );
};
