import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RainSimulationProps {
  title?: string;
  dropCount?: number;
  rainAngle?: number;
  intensity?: 'light' | 'moderate' | 'storm';
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const RainSimulation: React.FC<RainSimulationProps> = ({
  title = 'Kinetic Precipitation & Rain Simulation',
  dropCount = 35,
  rainAngle = 12,
  intensity = 'moderate',
  primaryColor = '#38BDF8',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const speed = intensity === 'storm' ? 24 : intensity === 'moderate' ? 16 : 10;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05070d',
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
            background: 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🌧 METEOROLOGICAL ENGINE</span>
          <span>•</span>
          <span>{intensity.toUpperCase()} RAINFALL</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Atmospheric Environment Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 30%, #0c1a2e 0%, #030712 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85)',
        }}
      >
        {/* Animated Rain Streaks */}
        <svg
          viewBox="0 0 400 320"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {Array.from({ length: dropCount }).map((_, idx) => {
            const seedX = (idx * 37) % 380;
            const seedY = (idx * 53) % 320;
            const currentY = (seedY + frame * speed) % 340;
            const currentX = seedX + (currentY / 320) * (rainAngle * 4);
            const dropLength = 14 + (idx % 4) * 6;

            return (
              <line
                key={idx}
                x1={currentX}
                y1={currentY}
                x2={currentX + (rainAngle * 0.4)}
                y2={currentY + dropLength}
                stroke={idx % 3 === 0 ? '#38bdf8' : 'rgba(255,255,255,0.45)'}
                strokeWidth={idx % 4 === 0 ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Ground Splash Impact Rings */}
        <div
          style={{
            position: 'absolute',
            bottom: 25,
            width: '85%',
            height: 20,
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          {Array.from({ length: 5 }).map((_, idx) => {
            const splashScale = ((frame + idx * 7) % 18) / 18;
            return (
              <div
                key={idx}
                style={{
                  width: 28,
                  height: 8,
                  borderRadius: '50%',
                  border: `1px solid rgba(56, 189, 248, ${1 - splashScale})`,
                  transform: `scale(${splashScale * 1.5})`,
                }}
              />
            );
          })}
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
            color: '#7dd3fc',
          }}
        >
          PRECIPITATION: {intensity === 'storm' ? '45mm/h' : '15mm/h'} | VECTOR: {rainAngle}°
        </div>
      </div>
    </div>
  );
};
