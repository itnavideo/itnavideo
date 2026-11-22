import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DebrisSimulationProps {
  title?: string;
  fragmentCount?: number;
  gravity?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const DebrisSimulation: React.FC<DebrisSimulationProps> = ({
  title = 'Ballistic Debris & Shrapnel',
  fragmentCount = 24,
  gravity = 9.8,
  primaryColor = '#F59E0B',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const cycle = (frame % 65) / 65;

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
            background: 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>☄ BALLISTIC PARTICLES</span>
          <span>•</span>
          <span>SHRAPNEL TRAJECTORY</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Debris Viewport Canvas */}
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
        {/* Outward flying fragment particles with tumbling rotation */}
        {Array.from({ length: fragmentCount }).map((_, idx) => {
          const angle = (idx / fragmentCount) * Math.PI * 2;
          const speed = 120 + (idx % 5) * 25;
          const posX = Math.cos(angle) * (speed * cycle);
          const posY = Math.sin(angle) * (speed * cycle) + (cycle * cycle * 90); // Gravity falloff
          const rot = cycle * 720 * (idx % 2 === 0 ? 1 : -1);
          const size = 6 + (idx % 4) * 3;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                transform: `translate(${posX}px, ${posY}px) rotate(${rot}deg)`,
                width: size,
                height: size * 0.7,
                background: idx % 3 === 0 ? '#f59e0b' : idx % 3 === 1 ? '#71717a' : '#d4d4d8',
                boxShadow: '0 0 6px rgba(0,0,0,0.8)',
                opacity: 1 - cycle * 0.5,
              }}
            />
          );
        })}

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
          FRAGMENTS: {fragmentCount} | GRAVITY: {gravity}m/s²
        </div>
      </div>
    </div>
  );
};
