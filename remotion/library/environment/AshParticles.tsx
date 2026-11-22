import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AshParticlesProps {
  title?: string;
  ashCount?: number;
  smolderIntensity?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const AshParticles: React.FC<AshParticlesProps> = ({
  title = 'Post-Combustion Volcanic Ash Flakes',
  ashCount = 30,
  smolderIntensity = 0.85,
  primaryColor = '#EF4444',
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
        background: '#070505',
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
            background: 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#f87171',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>☄ VOLCANIC FALLOUT</span>
          <span>•</span>
          <span>SMOLDERING ASH</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Ash Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 80%, #2a0b0b 0%, #080505 80%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Floating, gently descending ash particles */}
        {Array.from({ length: ashCount }).map((_, idx) => {
          const seedX = (idx * 31) % 360;
          const seedY = (idx * 43) % 300;
          const currentY = (seedY + frame * (1.5 + (idx % 3) * 0.5)) % 320;
          const driftX = Math.sin((frame + idx * 15) * 0.05) * 20;
          const rot = (frame * 2 + idx * 40) % 360;
          const isHot = idx % 3 === 0;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: currentY,
                left: seedX + driftX,
                width: 6 + (idx % 3) * 2,
                height: 4 + (idx % 2) * 2,
                borderRadius: 2,
                background: isHot ? '#ef4444' : '#52525b',
                boxShadow: isHot ? '0 0 8px #f97316' : 'none',
                transform: `rotate(${rot}deg)`,
                opacity: 0.6 + (isHot ? 0.3 : 0),
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
            color: '#fca5a5',
          }}
        >
          FALLOUT RATE: 12g/m² | SMOLDER: ACTIVE
        </div>
      </div>
    </div>
  );
};
