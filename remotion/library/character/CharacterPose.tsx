import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CharacterPoseProps {
  title?: string;
  showLineOfAction?: boolean;
  contrapposto?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CharacterPose: React.FC<CharacterPoseProps> = ({
  title = 'Hero Keyframe Pose & Line of Action',
  showLineOfAction = true,
  contrapposto = true,
  primaryColor = '#F59E0B',
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
          <span>⚡ DYNAMIC POSTURING</span>
          <span>•</span>
          <span>CONTRAPPOSTO BALANCE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Posing Canvas Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0d0d14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Curving Line of Action Guide (Red S-Curve) */}
        {showLineOfAction && (
          <svg
            viewBox="0 0 200 300"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <path
              d="M 115,40 Q 80,140 120,260"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
          </svg>
        )}

        {/* Dynamic Pose Vector Form */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
            filter: 'drop-shadow(0 10px 25px rgba(245, 158, 11, 0.4))',
          }}
        >
          {/* Head */}
          <circle cx="115" cy="55" r="22" fill="#fbbf24" />
          {/* Contrapposto Shoulders (Tilted left up, right down) */}
          <line x1="75" y1="88" x2="155" y2="98" stroke="#ffffff" strokeWidth="4" />
          {/* Torso */}
          <line x1="115" y1="77" x2="95" y2="165" stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
          {/* Pelvis (Tilted opposite to shoulders) */}
          <line x1="75" y1="170" x2="135" y2="158" stroke="#ffffff" strokeWidth="4" />
          {/* Left Weight-Bearing Leg */}
          <line x1="85" y1="170" x2="80" y2="280" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
          {/* Right Relaxed Free Leg */}
          <line x1="125" y1="160" x2="145" y2="275" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
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
          LINE OF ACTION: S-CURVE | BALANCE: WEIGHT-BEARING LEFT
        </div>
      </div>
    </div>
  );
};
