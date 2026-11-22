import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AlphaMatteProps {
  title?: string;
  subtitle?: string;
  matteType?: 'alpha' | 'alpha-inverted';
  revealProgress?: number;
  primaryColor?: string;
  accentColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const AlphaMatte: React.FC<AlphaMatteProps> = ({
  title = 'Alpha Matte Stencil',
  subtitle = 'Masking layer transparency via shape luminance threshold',
  matteType = 'alpha',
  revealProgress,
  primaryColor = '#10B981',
  accentColor = '#6366F1',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85, mass: 0.8 },
  });

  const progress = revealProgress ?? interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const strokeDash = interpolate(progress, [0, 1], [0, 1000]);
  const fillOpacity = interpolate(progress, [0.3, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 40%, #18181b 0%, #09090b 100%)',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '32px 20px' : '48px 40px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.6,
        }}
      />

      {/* Header Info */}
      <div
        style={{
          zIndex: 10,
          textAlign: 'center',
          marginBottom: isVertical ? 24 : 32,
          transform: `translateY(${interpolate(anim, [0, 1], [-20, 0])}px)`,
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
            background: 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          <span>● COMPOSITING</span>
          <span>•</span>
          <span>{matteType === 'alpha' ? 'ALPHA MATTE' : 'ALPHA INVERTED'}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
        <p style={{ margin: '6px 0 0', fontSize: isVertical ? 13 : 15, color: '#a1a1aa' }}>{subtitle}</p>
      </div>

      {/* Interactive Composite Canvas */}
      <div
        style={{
          zIndex: 10,
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 360,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          background: '#0a0a0c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Layer 1: Radiant Backdrop Gradient (Source Video Simulation) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(${frame * 2}deg, ${accentColor}, #ec4899, #f59e0b, ${primaryColor})`,
            filter: 'blur(30px)',
            opacity: 0.85,
          }}
        />

        {/* Checkerboard Pattern underneath showing alpha cutouts */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(45deg, #18181b 25%, transparent 25%),
              linear-gradient(-45deg, #18181b 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #18181b 75%),
              linear-gradient(-45deg, transparent 75%, #18181b 75%)
            `,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
            opacity: matteType === 'alpha' ? 0.4 : 0.8,
            mixBlendMode: 'difference',
          }}
        />

        {/* Dynamic Alpha Stencil Mask */}
        <svg
          viewBox="0 0 400 240"
          style={{
            width: '85%',
            height: '85%',
            zIndex: 5,
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.8))',
          }}
        >
          <defs>
            <linearGradient id="matteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
            <mask id="shapeMask">
              <rect width="400" height="240" fill={matteType === 'alpha' ? '#000000' : '#ffffff'} />
              <circle cx="200" cy="120" r="75" fill={matteType === 'alpha' ? '#ffffff' : '#000000'} />
              <polygon points="200,60 235,100 280,100 245,130 260,175 200,145 140,175 155,130 120,100 165,100" fill={matteType === 'alpha' ? '#000000' : '#ffffff'} />
            </mask>
          </defs>

          {/* Stencil Shape Outline Path with Dash Animation */}
          <circle
            cx="200"
            cy="120"
            r="75"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="3"
            strokeDasharray="600"
            strokeDashoffset={600 - strokeDash}
          />
          <text
            x="200"
            y="125"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize="28"
            fontWeight="900"
            letterSpacing="3"
            opacity={fillOpacity}
          >
            ALPHA
          </text>
        </svg>

        {/* Matte Boundary Hud Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#e4e4e7',
          }}
        >
          CUT: {Math.round(progress * 100)}% | CH: RGBA
        </div>
      </div>
    </div>
  );
};
