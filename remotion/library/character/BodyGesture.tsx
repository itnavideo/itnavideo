import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BodyGestureProps {
  title?: string;
  pose?: 'presenting' | 'arms-crossed' | 'shrugging' | 'thinking';
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const BodyGesture: React.FC<BodyGestureProps> = ({
  title = 'Full-Body Posture & Gesture Engine',
  pose = 'presenting',
  primaryColor = '#8B5CF6',
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
            background: 'rgba(139, 92, 246, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#a78bfa',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🧍 KINESIC COMMUNICATION</span>
          <span>•</span>
          <span>POSTURE: [{pose.toUpperCase()}]</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Body Posture Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0b0a14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Vector Character in Pose */}
        <svg
          viewBox="0 0 200 300"
          style={{
            width: isVertical ? 200 : 240,
            height: isVertical ? 280 : 300,
            filter: 'drop-shadow(0 10px 25px rgba(139, 92, 246, 0.4))',
          }}
        >
          {/* Head */}
          <circle cx="100" cy="55" r="22" fill="#8b5cf6" />
          {/* Torso */}
          <line x1="100" y1="77" x2="100" y2="165" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />

          {/* Arms adjusted for 'presenting' gesture */}
          <line x1="100" y1="95" x2="55" y2="135" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />
          <line x1="55" y1="135" x2="35" y2="110" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />

          <line x1="100" y1="95" x2="145" y2="120" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />
          <line x1="145" y1="120" x2="175" y2="90" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />

          {/* Legs */}
          <line x1="100" y1="165" x2="75" y2="280" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="165" x2="125" y2="280" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
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
            color: '#c4b5fd',
          }}
        >
          BODY LANGUAGE: ENGAGED & WELCOMING
        </div>
      </div>
    </div>
  );
};
