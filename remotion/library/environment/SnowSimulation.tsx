import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SnowSimulationProps {
  title?: string;
  flakeCount?: number;
  windDrift?: number;
  fallSpeed?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const SnowSimulation: React.FC<SnowSimulationProps> = ({
  title = 'Kinetic Snowfall & Blizzard Simulation',
  flakeCount = 45,
  windDrift = 14,
  fallSpeed = 2.5,
  primaryColor = '#E0F2FE',
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
        background: '#040711',
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
            background: 'rgba(224, 242, 254, 0.15)',
            border: '1px solid rgba(224, 242, 254, 0.4)',
            color: '#bae6fd',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>❄ CRYO ENVIRONMENT</span>
          <span>•</span>
          <span>FLURRY DYNAMICS</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Snow Environment Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 50%, #0c1a2e 0%, #030712 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Floating Snowflakes */}
        {Array.from({ length: flakeCount }).map((_, idx) => {
          const seedX = (idx * 29) % 360;
          const seedY = (idx * 47) % 320;
          const currentY = (seedY + frame * (fallSpeed + (idx % 3) * 0.8)) % 340;
          const flutter = Math.sin((frame + idx * 15) * 0.06) * 14;
          const currentX = seedX + flutter + (currentY / 320) * windDrift;
          const size = 3 + (idx % 4) * 2.5;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: currentX,
                top: currentY,
                width: size,
                height: size,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 6px rgba(255,255,255,0.8)',
                opacity: 0.4 + (idx % 3) * 0.25,
                filter: idx % 3 === 0 ? 'blur(1px)' : 'none',
              }}
            />
          );
        })}

        {/* Ground Accumulation Frost Line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 24,
            background: 'linear-gradient(to top, rgba(224, 242, 254, 0.4) 0%, transparent 100%)',
            borderTop: '1px solid rgba(255,255,255,0.3)',
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
            color: '#bae6fd',
          }}
        >
          TEMP: -4°C | WIND: {windDrift}km/h | ACCUMULATION: 3.2cm
        </div>
      </div>
    </div>
  );
};
