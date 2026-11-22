import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FogSimulationProps {
  title?: string;
  fogDensity?: number;
  driftSpeed?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const FogSimulation: React.FC<FogSimulationProps> = ({
  title = 'Low-Lying Ground Fog Simulation',
  fogDensity = 0.75,
  driftSpeed = 1,
  primaryColor = '#E2E8F0',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const fogX1 = interpolate(frame % 200, [0, 200], [-60, 60]);
  const fogX2 = interpolate((frame + 80) % 200, [0, 200], [60, -60]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#06070a',
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
            background: 'rgba(226, 232, 240, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#e2e8f0',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🌫 ATMOSPHERIC MIST</span>
          <span>•</span>
          <span>GROUND FOG</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Fog Studio Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #05060a 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Mysterious Forest Silhouettes in Background */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            gap: 24,
            opacity: 0.35,
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: 20,
                height: 110 + (idx % 3) * 30,
                background: '#475569',
                borderRadius: '8px 8px 0 0',
              }}
            />
          ))}
        </div>

        {/* Fog Bank Layer 1 */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: -100,
            right: -100,
            height: 140,
            background: 'radial-gradient(ellipse at 50% 100%, rgba(226, 232, 240, 0.45) 0%, transparent 75%)',
            filter: 'blur(20px)',
            transform: `translateX(${fogX1}px)`,
          }}
        />

        {/* Fog Bank Layer 2 */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: -80,
            right: -80,
            height: 100,
            background: 'radial-gradient(ellipse at 50% 100%, rgba(203, 213, 225, 0.5) 0%, transparent 70%)',
            filter: 'blur(15px)',
            transform: `translateX(${fogX2}px)`,
          }}
        />

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
            color: '#e2e8f0',
          }}
        >
          HUMIDITY: 98% | VISIBILITY: 15m
        </div>
      </div>
    </div>
  );
};
