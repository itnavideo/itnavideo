import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SmokeSimulationProps {
  title?: string;
  puffCount?: number;
  dissipationRate?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const SmokeSimulation: React.FC<SmokeSimulationProps> = ({
  title = 'Volumetric Smoke Plume Simulation',
  puffCount = 14,
  dissipationRate = 1,
  primaryColor = '#94A3B8',
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
            background: 'rgba(148, 163, 184, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#cbd5e1',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>☁ VOLUMETRIC AEROSOL</span>
          <span>•</span>
          <span>SMOKE DIFFUSION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Smoke Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0b0c10',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Billowing Smoke Puffs rising and expanding */}
        {Array.from({ length: puffCount }).map((_, idx) => {
          const cycle = (frame + idx * 18) % 120;
          const progress = cycle / 120;
          const currentY = interpolate(progress, [0, 1], [120, -120]);
          const currentScale = interpolate(progress, [0, 1], [0.6, 2.6]);
          const currentOpacity = interpolate(progress, [0, 0.3, 1], [0, 0.5, 0]);
          const driftX = Math.sin((frame + idx * 10) * 0.04) * 35;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                transform: `translate(${driftX}px, ${currentY}px) scale(${currentScale})`,
                width: 75,
                height: 75,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(148, 163, 184, 0.6) 0%, rgba(71, 85, 105, 0.2) 60%, transparent 80%)',
                opacity: currentOpacity,
                filter: 'blur(10px)',
              }}
            />
          );
        })}

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
            color: '#cbd5e1',
          }}
        >
          DENSITY: 0.82kg/m³ | EXPANSION: VOLUMETRIC
        </div>
      </div>
    </div>
  );
};
