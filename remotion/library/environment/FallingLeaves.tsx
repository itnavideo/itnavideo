import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FallingLeavesProps {
  title?: string;
  leafCount?: number;
  season?: 'autumn' | 'spring';
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const FallingLeaves: React.FC<FallingLeavesProps> = ({
  title = 'Seasonal Falling Leaves Simulation',
  leafCount = 20,
  season = 'autumn',
  primaryColor = '#EA580C',
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
        background: '#0a0705',
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
            background: 'rgba(234, 88, 12, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#fb923c',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🍂 BOTANICAL BREEZE</span>
          <span>•</span>
          <span>AUTUMN FOLIAGE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Leaves Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 30%, #2e1005 0%, #0c0806 80%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Tumbling 3D Pitching Leaves */}
        {Array.from({ length: leafCount }).map((_, idx) => {
          const seedX = (idx * 37) % 360;
          const seedY = (idx * 47) % 320;
          const currentY = (seedY + frame * (1.8 + (idx % 3) * 0.6)) % 340;
          const sway = Math.sin((frame + idx * 20) * 0.05) * 28;
          const pitch = Math.sin((frame + idx * 10) * 0.08) * 45;
          const yaw = (frame * 2 + idx * 30) % 360;
          const leafColors = ['#ea580c', '#f59e0b', '#dc2626', '#b45309'];

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: currentY,
                left: seedX + sway,
                transform: `rotate(${yaw}deg) rotateX(${pitch}deg)`,
                width: 18,
                height: 12,
                borderRadius: '50% 0 50% 0',
                background: leafColors[idx % leafColors.length],
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
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
            color: '#fdba74',
          }}
        >
          AERODYNAMIC GLIDE: 3D PITCH & ROLL
        </div>
      </div>
    </div>
  );
};
