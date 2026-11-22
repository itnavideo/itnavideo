import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WindSimulationProps {
  title?: string;
  windSpeedKmh?: number;
  gustiness?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const WindSimulation: React.FC<WindSimulationProps> = ({
  title = 'Aerodynamic Wind & Gust Simulation',
  windSpeedKmh = 45,
  gustiness = 1.2,
  primaryColor = '#06B6D4',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const gust = Math.sin(frame * 0.1) * 15;

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
            background: 'rgba(6, 182, 212, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>≋ FLUID DYNAMICS</span>
          <span>•</span>
          <span>WINDSTREAM VECTORS</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Wind Streamlines Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#080d14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Dynamic Gust Streamlines */}
        <svg
          viewBox="0 0 400 240"
          style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => {
            const streamY = 40 + idx * 35;
            const flowOffset = (frame * 12 + idx * 45) % 400;

            return (
              <path
                key={idx}
                d={`M -50,${streamY} Q 100,${streamY - 15 + gust} 220,${streamY + 10} T 450,${streamY - 5}`}
                fill="none"
                stroke={idx % 2 === 0 ? primaryColor : 'rgba(255,255,255,0.3)'}
                strokeWidth={idx % 3 === 0 ? 3 : 1.5}
                strokeDasharray="40 25"
                strokeDashoffset={-flowOffset}
                opacity={0.7}
              />
            );
          })}
        </svg>

        {/* Bending Grass / Vegetation Wind Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 25,
            display: 'flex',
            gap: 16,
          }}
        >
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: 4,
                height: 50 + (idx % 3) * 15,
                background: '#10b981',
                borderRadius: '2px 2px 0 0',
                transformOrigin: '50% 100%',
                transform: `rotate(${25 + gust * 0.8}deg)`,
              }}
            />
          ))}
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
            color: '#67e8f9',
          }}
        >
          VELOCITY: {Math.round(windSpeedKmh + gust)}km/h | BEAUFORT: SCALE 6
        </div>
      </div>
    </div>
  );
};
