import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface HeatDistortionProps {
  title?: string;
  mirageIntensity?: number;
  wavelength?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const HeatDistortion: React.FC<HeatDistortionProps> = ({
  title = 'Optical Heat Shimmer & Mirage Distortion',
  mirageIntensity = 1,
  wavelength = 24,
  primaryColor = '#F59E0B',
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
        background: '#0a0805',
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
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#fbbf24',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>♨ THERMAL REFRACTION</span>
          <span>•</span>
          <span>HEAT HAZE MIRAGE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Heat Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(to top, #451a03 0%, #1c1917 60%, #0c0a09 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Wavy Heat Shimmer Lines */}
        <svg
          viewBox="0 0 300 240"
          style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => {
            const yPos = 80 + idx * 22;
            const phase = frame * 0.15 + idx * 1.2;
            const wave = Math.sin(phase) * (8 * mirageIntensity);

            return (
              <path
                key={idx}
                d={`M 20,${yPos} Q 80,${yPos - wave} 150,${yPos + wave} T 280,${yPos - wave}`}
                fill="none"
                stroke="rgba(254, 240, 138, 0.45)"
                strokeWidth="2"
                filter="blur(1px)"
              />
            );
          })}
        </svg>

        {/* Shimmering Center Text */}
        <div
          style={{
            zIndex: 5,
            fontSize: isVertical ? 26 : 34,
            fontWeight: 900,
            letterSpacing: 4,
            color: '#fef08a',
            textShadow: '0 0 20px #f59e0b',
            transform: `skewX(${Math.sin(frame * 0.2) * 4}deg) translateY(${Math.sin(frame * 0.3) * 2}px)`,
          }}
        >
          HEAT HAZE
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#fef08a',
          }}
        >
          GROUND TEMP: 54°C | REFRACTION INDEX: 1.0003
        </div>
      </div>
    </div>
  );
};
