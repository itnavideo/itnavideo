import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LensDistortionProps {
  title?: string;
  distortionType?: 'barrel' | 'pincushion' | 'fisheye';
  curvature?: number;
  chromaticDispersion?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const LensDistortion: React.FC<LensDistortionProps> = ({
  title = 'Optical Lens Distortion & Aberration',
  distortionType = 'barrel',
  curvature = 16,
  chromaticDispersion = true,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const warpPulse = Math.sin(frame * 0.08) * 4;

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
          <span>⌖ SPHERICAL ABERRATION</span>
          <span>•</span>
          <span>{distortionType.toUpperCase()} CURVATURE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Warped Lens Grid Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0a0f',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Curving Grid Lines representing barrel distortion */}
        <svg
          viewBox="0 0 300 240"
          style={{
            position: 'absolute',
            width: '85%',
            height: '85%',
          }}
        >
          {/* Vertical curves bowing outward */}
          {[-80, -40, 0, 40, 80].map((xOffset, idx) => (
            <path
              key={`v-${idx}`}
              d={`M ${150 + xOffset},20 Q ${150 + xOffset * 1.35 + warpPulse},120 ${150 + xOffset},220`}
              fill="none"
              stroke={idx === 2 ? primaryColor : 'rgba(255,255,255,0.2)'}
              strokeWidth={idx === 2 ? 2 : 1}
            />
          ))}
          {/* Horizontal curves bowing outward */}
          {[-60, -30, 0, 30, 60].map((yOffset, idx) => (
            <path
              key={`h-${idx}`}
              d={`M 30,${120 + yOffset} Q 150,${120 + yOffset * 1.35 + warpPulse} 270,${120 + yOffset}`}
              fill="none"
              stroke={idx === 2 ? primaryColor : 'rgba(255,255,255,0.2)'}
              strokeWidth={idx === 2 ? 2 : 1}
            />
          ))}
        </svg>

        {/* Center Optical Crosshair */}
        <div
          style={{
            zIndex: 5,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: primaryColor,
            boxShadow: `0 0 15px ${primaryColor}`,
          }}
        />

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
          K1 FACTOR: +{curvature + Math.round(warpPulse)}% | CHROMATIC DISPERSION: ON
        </div>
      </div>
    </div>
  );
};
