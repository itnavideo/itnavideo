import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface IdleAnimationProps {
  title?: string;
  breathingCycle?: number;
  weightShift?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const IdleAnimation: React.FC<IdleAnimationProps> = ({
  title = 'Organic Character Idle & Breathing Loop',
  breathingCycle = 60,
  weightShift = true,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Breathing expansion and subtle weight shift
  const breath = Math.sin((frame / breathingCycle) * Math.PI * 2) * 5;
  const shiftX = Math.sin((frame / (breathingCycle * 2)) * Math.PI * 2) * 4;

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
            background: 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🌬 NATURAL RESPIRATION</span>
          <span>•</span>
          <span>IDLE POSE LOOP</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Idle Character Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0b0f14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Breathing Character Vector */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
            transform: `translateX(${shiftX}px)`,
          }}
        >
          {/* Head */}
          <circle cx="100" cy={55 + breath * 0.4} r="22" fill="#10b981" />
          {/* Breathing Torso Chest Expansion */}
          <rect
            x={82 - breath * 0.3}
            y={80 + breath * 0.2}
            width={36 + breath * 0.6}
            height={85}
            rx="10"
            fill="#34d399"
          />
          {/* Arms hanging naturally */}
          <line x1="78" y1="90" x2="65" y2="170" stroke="#a7f3d0" strokeWidth="5" strokeLinecap="round" />
          <line x1="122" y1="90" x2="135" y2="170" stroke="#a7f3d0" strokeWidth="5" strokeLinecap="round" />
          {/* Legs standing stable */}
          <line x1="88" y1="170" x2="80" y2="280" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
          <line x1="112" y1="170" x2="120" y2="280" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
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
            color: '#34d399',
          }}
        >
          RESPIRATION: 16 BPM | CHEST EXPANSION: ±{Math.abs(breath).toFixed(1)}mm
        </div>
      </div>
    </div>
  );
};
