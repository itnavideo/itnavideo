import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SandstormProps {
  title?: string;
  stormIntensity?: number;
  visibilityKm?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const Sandstorm: React.FC<SandstormProps> = ({
  title = 'Desert Haboob Sandstorm Simulation',
  stormIntensity = 0.85,
  visibilityKm = 0.2,
  primaryColor = '#D97706',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const sandOffset = (frame * 28) % 400;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d0905',
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
            background: 'rgba(217, 119, 6, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#fbbf24',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🏜 ARID METEOROLOGY</span>
          <span>•</span>
          <span>HABOOB SAND WALL</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Sandstorm Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 50%, #78350f 0%, #291205 80%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Fast Streaming Dust Texture Layers */}
        <div
          style={{
            position: 'absolute',
            inset: -50,
            background: 'repeating-linear-gradient(15deg, rgba(217, 119, 6, 0.3) 0px, transparent 15px, rgba(245, 158, 11, 0.35) 30px)',
            transform: `translateX(${-sandOffset}px)`,
            filter: 'blur(3px)',
            opacity: stormIntensity,
          }}
        />

        {/* Dense Airborne Sand Grains */}
        <svg
          viewBox="0 0 400 300"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {Array.from({ length: 30 }).map((_, idx) => {
            const seedX = (idx * 27 + frame * 18) % 420;
            const seedY = (idx * 43) % 280;
            return (
              <line
                key={idx}
                x1={seedX}
                y1={seedY}
                x2={seedX - 25}
                y2={seedY - 6}
                stroke="#fde68a"
                strokeWidth="1.5"
                opacity={0.6}
              />
            );
          })}
        </svg>

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
            color: '#fde68a',
          }}
        >
          VISIBILITY: {visibilityKm}km | GUST: 85km/h | PM10: 950µg/m³
        </div>
      </div>
    </div>
  );
};
