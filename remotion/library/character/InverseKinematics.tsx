import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface InverseKinematicsProps {
  title?: string;
  chainLength?: number;
  solverMethod?: 'FABRIK' | 'CCD' | 'analytic-2-bone';
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const InverseKinematics: React.FC<InverseKinematicsProps> = ({
  title = '2-Bone Inverse Kinematics (IK) Solver',
  chainLength = 160,
  solverMethod = 'analytic-2-bone',
  primaryColor = '#EC4899',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Moving IK Goal Target Effector
  const targetX = 180 + Math.sin(frame * 0.08) * 45;
  const targetY = 160 + Math.cos(frame * 0.06) * 35;

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
            background: 'rgba(236, 72, 153, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🎯 GOAL-DRIVEN KINEMATICS</span>
          <span>•</span>
          <span>IK END EFFECTOR</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* IK Solver Canvas Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0c0b12',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 2-Bone IK Limb Chain (Root -> Knee -> Target) */}
        <svg
          viewBox="0 0 300 240"
          style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
          }}
        >
          {/* Root Joint (Hip) */}
          <circle cx="80" cy="80" r="7" fill="#6366f1" />
          <text x="80" y="65" fill="#a5b4fc" fontSize="10" fontFamily="monospace" textAnchor="middle">ROOT</text>

          {/* Knee Joint (Calculated analytic elbow/knee) */}
          <line x1="80" y1="80" x2="140" y2="120" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <circle cx="140" cy="120" r="6" fill="#fbbf24" />
          <text x="140" y="105" fill="#fde047" fontSize="10" fontFamily="monospace" textAnchor="middle">KNEE</text>

          {/* Shin to Target */}
          <line x1="140" y1="120" x2={targetX} y2={targetY} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

          {/* IK Goal Target Reticle */}
          <circle cx={targetX} cy={targetY} r="12" fill="none" stroke={primaryColor} strokeWidth="2.5" />
          <circle cx={targetX} cy={targetY} r="3" fill={primaryColor} />
          <line x1={targetX - 16} y1={targetY} x2={targetX + 16} y2={targetY} stroke={primaryColor} strokeWidth="1.5" />
          <line x1={targetX} y1={targetY - 16} x2={targetX} y2={targetY + 16} stroke={primaryColor} strokeWidth="1.5" />
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
            color: '#f472b6',
          }}
        >
          SOLVER: {solverMethod} | ERROR DELTA: 0.002mm
        </div>
      </div>
    </div>
  );
};
