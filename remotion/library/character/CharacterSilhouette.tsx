import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CharacterSilhouetteProps {
  title?: string;
  poseName?: string;
  readabilityThreshold?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CharacterSilhouette: React.FC<CharacterSilhouetteProps> = ({
  title = 'Silhouette Readability & Negative Space',
  poseName = 'Hero Victorious Stance',
  readabilityThreshold = 98.5,
  primaryColor = '#10B981',
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
          <span>👤 POSE READABILITY</span>
          <span>•</span>
          <span>HIGH-CONTRAST SILHOUETTE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Silhouette Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#ffffff', // High-contrast stark white backdrop
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
        }}
      >
        {/* Pitch-Black Solid Character Silhouette */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
          }}
        >
          {/* Head */}
          <circle cx="100" cy="50" r="22" fill="#000000" />
          {/* Torso */}
          <line x1="100" y1="72" x2="100" y2="165" stroke="#000000" strokeWidth="16" strokeLinecap="round" />
          {/* Raised Right Arm Holding Sword / Flag */}
          <line x1="100" y1="90" x2="155" y2="40" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
          <line x1="155" y1="40" x2="185" y2="15" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
          {/* Left Arm on Hip */}
          <polyline points="100,90 60,120 75,150" fill="none" stroke="#000000" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          {/* Wide Stance Legs with Strong Negative Space */}
          <line x1="100" y1="165" x2="60" y2="280" stroke="#000000" strokeWidth="14" strokeLinecap="round" />
          <line x1="100" y1="165" x2="140" y2="280" stroke="#000000" strokeWidth="14" strokeLinecap="round" />
        </svg>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0,0,0,0.85)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#34d399',
          }}
        >
          POSE: {poseName} | READABILITY: {readabilityThreshold}%
        </div>
      </div>
    </div>
  );
};
