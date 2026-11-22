import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CharacterRigProps {
  title?: string;
  characterType?: 'stickman' | 'business-host' | 'casual-creator';
  showBones?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CharacterRig: React.FC<CharacterRigProps> = ({
  title = '2D Puppet Character Rig',
  characterType = 'business-host',
  showBones = true,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Subtle natural idle movement
  const breatheY = Math.sin(frame * 0.08) * 4;
  const armSwing = Math.sin(frame * 0.06) * 12;

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
          <span>👤 KINEMATIC RIGGING</span>
          <span>•</span>
          <span>HIERARCHICAL SKELETON</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Rig Canvas Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0c0d14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Character Puppet Vector Skeleton */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))',
          }}
        >
          {/* Head */}
          <circle cx="100" cy={55 + breatheY} r="22" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          {/* Torso */}
          <line x1="100" y1={77 + breatheY} x2="100" y2="160" stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
          {/* Left Arm */}
          <line
            x1="100"
            y1={90 + breatheY}
            x2={65 + armSwing}
            y2={130 + breatheY}
            stroke="#60a5fa"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1={65 + armSwing}
            y1={130 + breatheY}
            x2={50 + armSwing * 1.3}
            y2={175}
            stroke="#60a5fa"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Right Arm */}
          <line
            x1="100"
            y1={90 + breatheY}
            x2={135 - armSwing}
            y2={130 + breatheY}
            stroke="#60a5fa"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1={135 - armSwing}
            y1={130 + breatheY}
            x2={150 - armSwing * 1.3}
            y2={175}
            stroke="#60a5fa"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Left Leg */}
          <line x1="100" y1="160" x2="75" y2="225" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
          <line x1="75" y1="225" x2="70" y2="280" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
          {/* Right Leg */}
          <line x1="100" y1="160" x2="125" y2="225" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
          <line x1="125" y1="225" x2="130" y2="280" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />

          {/* Joint Rig Controller Handles (Yellow Dots) */}
          {showBones && (
            <>
              <circle cx="100" cy={55 + breatheY} r="4" fill="#fbbf24" />
              <circle cx="100" cy={90 + breatheY} r="4" fill="#fbbf24" />
              <circle cx="100" cy="160" r="5" fill="#fbbf24" />
              <circle cx={65 + armSwing} cy={130 + breatheY} r="3.5" fill="#fbbf24" />
              <circle cx={135 - armSwing} cy={130 + breatheY} r="3.5" fill="#fbbf24" />
              <circle cx="75" cy="225" r="4" fill="#fbbf24" />
              <circle cx="125" cy="225" r="4" fill="#fbbf24" />
            </>
          )}
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
          JOINTS: 14 | PARENT: ROOT_HIP | SOLVER: FK/IK
        </div>
      </div>
    </div>
  );
};
