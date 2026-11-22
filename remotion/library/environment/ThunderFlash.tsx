import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ThunderFlashProps {
  title?: string;
  strobeFrequency?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const ThunderFlash: React.FC<ThunderFlashProps> = ({
  title = 'Atmospheric Thunder Flash Strobe',
  strobeFrequency = 90,
  primaryColor = '#60A5FA',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Triple flash sequence simulating sheet lightning
  const cycle = frame % strobeFrequency;
  const isFlashing = (cycle >= 15 && cycle <= 18) || (cycle >= 22 && cycle <= 24) || (cycle >= 28 && cycle <= 30);
  const skyAlpha = isFlashing ? 0.85 : 0.05;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#040711',
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
            background: 'rgba(96, 165, 250, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⛈ SHEET LIGHTNING</span>
          <span>•</span>
          <span>SKY ILLUMINATION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Cloud Silhouette Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: isFlashing ? '#1e3a8a' : '#030712',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.08s ease-out',
        }}
      >
        {/* Sky Flash Glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 60% 30%, rgba(255,255,255,0.9) 0%, rgba(96,165,250,0.7) 40%, transparent 80%)',
            opacity: skyAlpha,
          }}
        />

        {/* Storm Cloud Silhouettes backlit by flash */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: '#090d16' }} />
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: '#090d16', marginLeft: -60, marginTop: -40 }} />
          <div style={{ width: 130, height: 130, borderRadius: '50%', background: '#090d16', marginLeft: -50 }} />
        </div>

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
          INTRA-CLOUD FLASH: {isFlashing ? 'ACTIVE (STROBE)' : 'QUIET'}
        </div>
      </div>
    </div>
  );
};
