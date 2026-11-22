import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WaterRippleProps {
  title?: string;
  ringCount?: number;
  expansionSpeed?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const WaterRipple: React.FC<WaterRippleProps> = ({
  title = 'Concentric Surface Water Ripple',
  ringCount = 5,
  expansionSpeed = 1,
  primaryColor = '#38BDF8',
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
        background: '#040914',
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
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>◎ HARMONIC OSCILLATION</span>
          <span>•</span>
          <span>WATER RIPPLES</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Ripple Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'radial-gradient(ellipse at 50% 50%, #0369a1 0%, #030a17 80%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Expanding Concentric Rings */}
        {Array.from({ length: ringCount }).map((_, idx) => {
          const progress = ((frame + idx * 16) % 80) / 80;
          const radius = progress * 240;
          const opacity = 1 - progress;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                width: radius,
                height: radius * 0.6, // Perspective oval
                borderRadius: '50%',
                border: `2px solid rgba(255, 255, 255, ${opacity * 0.8})`,
                boxShadow: `0 0 12px rgba(56, 189, 248, ${opacity})`,
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Center Droplet Impact Dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 0 10px #38bdf8',
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
            color: '#7dd3fc',
          }}
        >
          PROPAGATION: 1.4m/s | DAMPING: 0.08
        </div>
      </div>
    </div>
  );
};
