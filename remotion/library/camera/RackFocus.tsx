import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RackFocusProps {
  title?: string;
  focusTarget?: 'foreground' | 'background';
  transitionSpeed?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const RackFocus: React.FC<RackFocusProps> = ({
  title = 'Cinematic Rack Focus Shift',
  focusTarget = 'foreground',
  transitionSpeed = 1,
  primaryColor = '#38BDF8',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Focus pulls back and forth between foreground (0) and background (1)
  const focusProgress = interpolate(frame % 100, [0, 45, 55, 100], [0, 0, 1, 1]);
  const fgBlur = interpolate(focusProgress, [0, 1], [0, 12]);
  const bgBlur = interpolate(focusProgress, [0, 1], [12, 0]);

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
          <span>◎ OPTICAL FOCUS PULL</span>
          <span>•</span>
          <span>RACK FOCUS</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Focus Pull Viewport Frame */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0b10',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background Element (Deep) */}
        <div
          style={{
            position: 'absolute',
            right: '25%',
            width: isVertical ? 100 : 130,
            height: isVertical ? 100 : 130,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#ffffff',
            filter: `blur(${bgBlur}px)`,
            opacity: interpolate(bgBlur, [0, 12], [1, 0.6]),
          }}
        >
          BACKGROUND
        </div>

        {/* Foreground Element (Near) */}
        <div
          style={{
            position: 'absolute',
            left: '20%',
            width: isVertical ? 120 : 160,
            height: isVertical ? 120 : 160,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#ffffff',
            filter: `blur(${fgBlur}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            zIndex: 5,
          }}
        >
          FOREGROUND
        </div>

        {/* Focus Ring Indicator HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#7dd3fc',
          }}
        >
          FOCUS PLANE: {focusProgress < 0.5 ? 'FOREGROUND (1.2m)' : 'BACKGROUND (5.0m)'}
        </div>
      </div>
    </div>
  );
};
