import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FireSimulationProps {
  title?: string;
  flameHeight?: number;
  emberCount?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const FireSimulation: React.FC<FireSimulationProps> = ({
  title = 'Kinetic Fire & Ember Simulation',
  flameHeight = 160,
  emberCount = 25,
  primaryColor = '#F97316',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const flicker = Math.sin(frame * 0.3) * 12 + Math.cos(frame * 0.5) * 8;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080503',
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
            background: 'rgba(249, 115, 22, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🔥 THERMAL PYROTECHNICS</span>
          <span>•</span>
          <span>BLAZE COMBUSTION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Fire Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 90%, #451a03 0%, #0c0a09 80%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 20,
        }}
      >
        {/* Rising Glowing Embers */}
        {Array.from({ length: emberCount }).map((_, idx) => {
          const seedX = (idx * 23) % 240 - 120;
          const seedY = (idx * 37) % 260;
          const currentY = (seedY + frame * (4 + (idx % 3) * 2)) % 280;
          const sway = Math.sin((frame + idx * 10) * 0.1) * 16;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                bottom: currentY,
                left: `calc(50% + ${seedX + sway}px)`,
                width: 3 + (idx % 3),
                height: 3 + (idx % 3),
                borderRadius: '50%',
                background: idx % 2 === 0 ? '#fbbf24' : '#ef4444',
                boxShadow: '0 0 8px #f59e0b',
                opacity: 1 - currentY / 280,
              }}
            />
          );
        })}

        {/* Central Fire Tongues (SVG fluid flame shape) */}
        <svg
          viewBox="0 0 200 240"
          style={{
            width: isVertical ? 180 : 220,
            height: flameHeight + flicker,
            filter: 'drop-shadow(0 0 25px rgba(249, 115, 22, 0.7))',
          }}
        >
          <defs>
            <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="85%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <path
            d={`M 100,20 C ${120 + flicker},80 ${150 - flicker},140 160,220 C 140,240 60,240 40,220 C 50,140 ${80 - flicker},80 100,20 Z`}
            fill="url(#fireGrad)"
          />
          <path
            d={`M 100,70 C ${110 + flicker * 0.5},110 ${130 - flicker * 0.5},160 135,220 C 120,230 80,230 65,220 C 70,160 ${90 - flicker * 0.5},110 100,70 Z`}
            fill="#fef08a"
          />
        </svg>

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
          COMBUSTION: 1200°C | EMBER DENSITY: HIGH
        </div>
      </div>
    </div>
  );
};
