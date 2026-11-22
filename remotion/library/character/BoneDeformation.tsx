import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BoneDeformationProps {
  title?: string;
  bendAngle?: number;
  weightHeatmap?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const BoneDeformation: React.FC<BoneDeformationProps> = ({
  title = 'Skin Weight & Bone Mesh Deformation',
  bendAngle = 45,
  weightHeatmap = true,
  primaryColor = '#F59E0B',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const currentBend = interpolate(Math.sin(frame * 0.08), [-1, 1], [-bendAngle, bendAngle]);

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
            background: 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🦾 VERTEX SKINNING</span>
          <span>•</span>
          <span>BONE WEIGHTS</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Deformation Canvas Viewport */}
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
        {/* Bending Arm Joint with Weight Gradient (Red = 1.0, Yellow = 0.5, Blue = 0.0) */}
        <svg
          viewBox="0 0 300 240"
          style={{
            width: isVertical ? 260 : 320,
            height: isVertical ? 220 : 260,
          }}
        >
          <defs>
            <linearGradient id="weightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Upper Bone Segment (Static) */}
          <line x1="60" y1="120" x2="150" y2="120" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          <circle cx="60" cy="120" r="7" fill="#fbbf24" />
          <circle cx="150" cy="120" r="9" fill="#ef4444" />

          {/* Lower Bone Segment (Bending around joint) */}
          <g transform={`rotate(${currentBend}, 150, 120)`}>
            <line x1="150" y1="120" x2="240" y2="120" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <circle cx="240" cy="120" r="7" fill="#3b82f6" />
          </g>

          {/* Soft Deformed Mesh Outline */}
          <path
            d={`M 60,95 Q 150,${95 - currentBend * 0.4} ${150 + Math.cos((currentBend * Math.PI) / 180) * 90},${120 + Math.sin((currentBend * Math.PI) / 180) * 90 - 25} L ${150 + Math.cos((currentBend * Math.PI) / 180) * 90},${120 + Math.sin((currentBend * Math.PI) / 180) * 90 + 25} Q 150,${145 + currentBend * 0.4} 60,145 Z`}
            fill="url(#weightGrad)"
            opacity="0.35"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
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
            color: '#fde68a',
          }}
        >
          JOINT BEND: {currentBend.toFixed(1)}° | INFLUENCE: HEATMAP
        </div>
      </div>
    </div>
  );
};
