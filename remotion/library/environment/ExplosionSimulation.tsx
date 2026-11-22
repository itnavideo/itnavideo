import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ExplosionSimulationProps {
  title?: string;
  blastScale?: number;
  shockwave?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const ExplosionSimulation: React.FC<ExplosionSimulationProps> = ({
  title = 'Cinematic Fireball Explosion',
  blastScale = 1.4,
  shockwave = true,
  primaryColor = '#EF4444',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Blast expansion cycle
  const cycle = frame % 70;
  const progress = cycle / 70;
  const fireballSize = interpolate(progress, [0, 0.25, 1], [10, 220 * blastScale, 260 * blastScale]);
  const shockwaveRing = interpolate(progress, [0, 0.4, 1], [0, 180 * blastScale, 320 * blastScale]);
  const blastOpacity = interpolate(progress, [0, 0.2, 0.7, 1], [1, 1, 0.4, 0]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090503',
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
          <span>💥 PYROKINETIC BLAST</span>
          <span>•</span>
          <span>FIREBALL SHOCKWAVE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Explosion Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0a0d',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outward Shockwave Ring */}
        {shockwave && (
          <div
            style={{
              position: 'absolute',
              width: shockwaveRing,
              height: shockwaveRing,
              borderRadius: '50%',
              border: `3px solid rgba(254, 240, 138, ${blastOpacity * 0.8})`,
              boxShadow: `0 0 25px rgba(249, 115, 22, ${blastOpacity})`,
            }}
          />
        )}

        {/* Central Fireball Core */}
        <div
          style={{
            position: 'absolute',
            width: fireballSize,
            height: fireballSize,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff 0%, #fde047 25%, #f97316 60%, #991b1b 85%, transparent 100%)',
            opacity: blastOpacity,
            filter: 'blur(6px)',
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
            color: '#fca5a5',
          }}
        >
          OVERPRESSURE: 250kPa | BLAST RADIUS: {Math.round(fireballSize / 4)}m
        </div>
      </div>
    </div>
  );
};
