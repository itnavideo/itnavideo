import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface HandGestureProps {
  title?: string;
  gestureType?: 'pointing' | 'thumbs-up' | 'peace' | 'wave' | 'pinch';
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const HandGesture: React.FC<HandGestureProps> = ({
  title = 'Expressive Hand Pose & Gesture',
  gestureType = 'thumbs-up',
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Cycle gestures if not locked
  const gestureList: ('pointing' | 'thumbs-up' | 'peace' | 'wave' | 'pinch')[] = [
    'thumbs-up', 'pointing', 'peace', 'wave', 'pinch'
  ];
  const activeIdx = Math.floor((frame / 30) % gestureList.length);
  const currentGesture = gestureType ?? gestureList[activeIdx];

  const gestureIcons: Record<string, string> = {
    'thumbs-up': '👍',
    'pointing': '👉',
    'peace': '✌️',
    'wave': '👋',
    'pinch': '🤏',
  };

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
          <span>✋ MANUAL ARTICULATION</span>
          <span>•</span>
          <span>GESTURE: [{currentGesture.toUpperCase()}]</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Hand Gesture Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0b1015',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated Hand Hero Icon with Pulse */}
        <div
          style={{
            fontSize: isVertical ? 75 : 95,
            filter: 'drop-shadow(0 15px 30px rgba(16, 185, 129, 0.4))',
            transform: `scale(${1 + Math.sin(frame * 0.1) * 0.08})`,
            transition: 'transform 0.1s ease',
          }}
        >
          {gestureIcons[currentGesture] || '👍'}
        </div>

        {/* Gestures selector strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            display: 'flex',
            gap: 10,
          }}
        >
          {gestureList.map((g, idx) => (
            <div
              key={idx}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                background: g === currentGesture ? primaryColor : 'rgba(255,255,255,0.08)',
                color: g === currentGesture ? '#09090b' : '#ffffff',
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              {g}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
