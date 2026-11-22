import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DustSimulationProps {
  title?: string;
  moteCount?: number;
  sunbeamIntensity?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const DustSimulation: React.FC<DustSimulationProps> = ({
  title = 'Ambient Floating Dust & Motes',
  moteCount = 35,
  sunbeamIntensity = 0.8,
  primaryColor = '#FBBF24',
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
        background: '#070605',
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
            background: 'rgba(251, 191, 36, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#fde047',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>✦ AMBIENT PARTICLES</span>
          <span>•</span>
          <span>SUNBEAM DUST MOTES</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Dust Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 30% 20%, #291804 0%, #0c0a09 80%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Volumetric Sunbeam Ray */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            left: 20,
            width: 200,
            height: 420,
            background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.25) 0%, transparent 70%)',
            transform: 'rotate(-20deg)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating Specular Dust Motes with micro-Brownian drift */}
        {Array.from({ length: moteCount }).map((_, idx) => {
          const seedX = (idx * 31) % 360;
          const seedY = (idx * 43) % 280;
          const driftX = Math.sin((frame + idx * 25) * 0.03) * 18;
          const driftY = Math.cos((frame + idx * 17) * 0.02) * 15;
          const size = 2 + (idx % 3) * 1.5;
          const pulse = Math.sin((frame + idx * 8) * 0.1) * 0.3;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: seedX + driftX,
                top: seedY + driftY,
                width: size,
                height: size,
                borderRadius: '50%',
                background: '#fef08a',
                boxShadow: '0 0 8px rgba(254, 240, 138, 0.9)',
                opacity: 0.4 + pulse,
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
            color: '#fef08a',
          }}
        >
          BROWNIAN PARTICLES: {moteCount} | LUX: 450lm
        </div>
      </div>
    </div>
  );
};
