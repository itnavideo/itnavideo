import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WalkCycleProps {
  title?: string;
  stepSpeed?: number;
  showFloor?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const WalkCycle: React.FC<WalkCycleProps> = ({
  title = 'Classical 8-Frame Walk Cycle',
  stepSpeed = 1,
  showFloor = true,
  primaryColor = '#3B82F6',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Classical walk cycle sinusoidal phasing
  const cycle = (frame * 0.15 * stepSpeed) % (Math.PI * 2);
  const leg1Angle = Math.sin(cycle) * 28;
  const leg2Angle = Math.sin(cycle + Math.PI) * 28;
  const arm1Angle = Math.sin(cycle + Math.PI) * 24;
  const arm2Angle = Math.sin(cycle) * 24;
  const bodyBob = Math.abs(Math.sin(cycle)) * 8; // Double bob per cycle (up on passing, down on contact)

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
            background: 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#60a5fa',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🚶 LOCOMOTION KINEMATICS</span>
          <span>•</span>
          <span>WALK CYCLE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Walking Character Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0d16',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Walking Stick Character */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))',
          }}
        >
          {/* Head with Body Bob */}
          <circle cx="100" cy={55 - bodyBob} r="20" fill="#38bdf8" />
          {/* Torso */}
          <line x1="100" y1={75 - bodyBob} x2="100" y2={165 - bodyBob} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

          {/* Left Arm (Opposite Leg) */}
          <line
            x1="100"
            y1={90 - bodyBob}
            x2={100 + Math.sin((arm1Angle * Math.PI) / 180) * 45}
            y2={90 - bodyBob + Math.cos((arm1Angle * Math.PI) / 180) * 45}
            stroke="#94a3b8"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Right Arm */}
          <line
            x1="100"
            y1={90 - bodyBob}
            x2={100 + Math.sin((arm2Angle * Math.PI) / 180) * 45}
            y2={90 - bodyBob + Math.cos((arm2Angle * Math.PI) / 180) * 45}
            stroke="#cbd5e1"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Left Leg */}
          <line
            x1="100"
            y1={165 - bodyBob}
            x2={100 + Math.sin((leg1Angle * Math.PI) / 180) * 80}
            y2={165 - bodyBob + Math.cos((leg1Angle * Math.PI) / 180) * 80}
            stroke="#3b82f6"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Right Leg */}
          <line
            x1="100"
            y1={165 - bodyBob}
            x2={100 + Math.sin((leg2Angle * Math.PI) / 180) * 80}
            y2={165 - bodyBob + Math.cos((leg2Angle * Math.PI) / 180) * 80}
            stroke="#60a5fa"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        {/* Floor Contact Ground Line */}
        {showFloor && (
          <div
            style={{
              position: 'absolute',
              bottom: 45,
              width: '80%',
              height: 2,
              background: 'rgba(255, 255, 255, 0.25)',
              boxShadow: '0 0 10px rgba(255,255,255,0.4)',
            }}
          />
        )}

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
            color: '#93c5fd',
          }}
        >
          CADENCE: 110 STEPS/MIN | PHASE: CONTACT/PASSING
        </div>
      </div>
    </div>
  );
};
