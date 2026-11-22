import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RunCycleProps {
  title?: string;
  runSpeed?: number;
  torsoLean?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const RunCycle: React.FC<RunCycleProps> = ({
  title = 'High-Speed Sprint Run Cycle',
  runSpeed = 1.4,
  torsoLean = 16,
  primaryColor = '#EF4444',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Rapid run cycle with airborne flight apex
  const cycle = (frame * 0.28 * runSpeed) % (Math.PI * 2);
  const leg1Angle = Math.sin(cycle) * 45;
  const leg2Angle = Math.sin(cycle + Math.PI) * 45;
  const arm1Angle = Math.sin(cycle + Math.PI) * 40;
  const arm2Angle = Math.sin(cycle) * 40;
  const flightY = Math.abs(Math.sin(cycle)) * 16;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090505',
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
          <span>🏃 ATHLETIC SPRINT</span>
          <span>•</span>
          <span>FLIGHT PHASE LOCOMOTION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Runner Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#12080a',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Speed Wind Streaks */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(to right, rgba(239, 68, 68, 0.1) 0px, transparent 20px)',
            opacity: 0.5,
          }}
        />

        {/* Sprinting Stick Character */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
            transform: `rotate(${torsoLean}deg) translateY(${-flightY}px)`,
            filter: 'drop-shadow(0 10px 25px rgba(239, 68, 68, 0.4))',
          }}
        >
          {/* Head */}
          <circle cx="100" cy="55" r="20" fill="#f87171" />
          {/* Torso */}
          <line x1="100" y1="75" x2="100" y2="165" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />

          {/* Arms with high pump angle */}
          <line
            x1="100"
            y1="90"
            x2={100 + Math.sin((arm1Angle * Math.PI) / 180) * 55}
            y2={90 + Math.cos((arm1Angle * Math.PI) / 180) * 55}
            stroke="#fca5a5"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="90"
            x2={100 + Math.sin((arm2Angle * Math.PI) / 180) * 55}
            y2={90 + Math.cos((arm2Angle * Math.PI) / 180) * 55}
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Legs with powerful stride */}
          <line
            x1="100"
            y1="165"
            x2={100 + Math.sin((leg1Angle * Math.PI) / 180) * 95}
            y2={165 + Math.cos((leg1Angle * Math.PI) / 180) * 95}
            stroke="#ef4444"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="165"
            x2={100 + Math.sin((leg2Angle * Math.PI) / 180) * 95}
            y2={165 + Math.cos((leg2Angle * Math.PI) / 180) * 95}
            stroke="#f87171"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        {/* Floor Line */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            width: '80%',
            height: 2,
            background: 'rgba(239, 68, 68, 0.4)',
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
            color: '#fca5a5',
          }}
        >
          PACE: 24km/h | AIR TIME: 42% FLIGHT
        </div>
      </div>
    </div>
  );
};
