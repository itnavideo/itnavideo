import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CharacterSkeletonProps {
  title?: string;
  boneColor?: string;
  jointGlow?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CharacterSkeleton: React.FC<CharacterSkeletonProps> = ({
  title = 'Biomechanical Character Skeleton',
  boneColor = '#38BDF8',
  jointGlow = true,
  primaryColor = '#0284C7',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const sway = Math.sin(frame * 0.08) * 8;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#060912',
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
            background: 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#38bdf8',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🦴 OSTEOLOGY & KINEMATICS</span>
          <span>•</span>
          <span>SKELETAL ARMATURE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Skeleton Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#070b14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Glowing X-Ray Skeletal Lines */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
            filter: 'drop-shadow(0 0 10px #38bdf8)',
          }}
        >
          {/* Skull Outline */}
          <circle cx="100" cy="50" r="18" fill="none" stroke={boneColor} strokeWidth="2.5" />
          {/* Spine with Vertebrae Segments */}
          <line x1="100" y1="68" x2={100 + sway * 0.3} y2="150" stroke={boneColor} strokeWidth="3" strokeDasharray="6 3" />
          {/* Ribcage oval */}
          <ellipse cx={100 + sway * 0.15} cy="100" rx="26" ry="20" fill="none" stroke={boneColor} strokeWidth="1.5" />
          {/* Pelvis */}
          <polygon points={`80,150 120,150 ${110 + sway * 0.3},175 ${90 + sway * 0.3},175`} fill="none" stroke={boneColor} strokeWidth="2" />
          {/* Femur and Tibia (Legs) */}
          <line x1="85" y1="175" x2={70 - sway * 0.5} y2="230" stroke={boneColor} strokeWidth="2.5" />
          <line x1={70 - sway * 0.5} y1="230" x2={65 - sway * 0.5} y2="285" stroke={boneColor} strokeWidth="2.5" />
          <line x1="115" y1="175" x2={130 + sway * 0.5} y2="230" stroke={boneColor} strokeWidth="2.5" />
          <line x1={130 + sway * 0.5} y1="230" x2={135 + sway * 0.5} y2="285" stroke={boneColor} strokeWidth="2.5" />
          {/* Clavicle and Arms */}
          <line x1="65" y1="80" x2="135" y2="80" stroke={boneColor} strokeWidth="2" />
          <line x1="65" y1="80" x2={45 + sway} y2="135" stroke={boneColor} strokeWidth="2" />
          <line x1={45 + sway} y1="135" x2={35 + sway * 1.4} y2="185" stroke={boneColor} strokeWidth="2" />
          <line x1="135" y1="80" x2={155 - sway} y2="135" stroke={boneColor} strokeWidth="2" />
          <line x1={155 - sway} y1="135" x2={165 - sway * 1.4} y2="185" stroke={boneColor} strokeWidth="2" />

          {/* Glowing Joint Nodes */}
          {jointGlow && (
            <>
              <circle cx="100" cy="50" r="3" fill="#ffffff" />
              <circle cx="65" cy="80" r="3" fill="#ffffff" />
              <circle cx="135" cy="80" r="3" fill="#ffffff" />
              <circle cx={45 + sway} cy="135" r="3" fill="#ffffff" />
              <circle cx={155 - sway} cy="135" r="3" fill="#ffffff" />
              <circle cx="85" cy="175" r="3.5" fill="#ffffff" />
              <circle cx="115" cy="175" r="3.5" fill="#ffffff" />
              <circle cx={70 - sway * 0.5} cy="230" r="3" fill="#ffffff" />
              <circle cx={130 + sway * 0.5} cy="230" r="3" fill="#ffffff" />
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
            color: '#7dd3fc',
          }}
        >
          BONES: 206 | VERTEBRAE: C1-L5 | X-RAY: PASS
        </div>
      </div>
    </div>
  );
};
