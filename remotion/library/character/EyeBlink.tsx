import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EyeBlinkProps {
  title?: string;
  blinkInterval?: number;
  saccadeTracking?: boolean;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const EyeBlink: React.FC<EyeBlinkProps> = ({
  title = 'Ocular Saccade & Natural Eye Blink',
  blinkInterval = 75,
  saccadeTracking = true,
  primaryColor = '#38BDF8',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Natural blink closure on frames 10-15 of cycle
  const cycle = frame % blinkInterval;
  const isBlinking = cycle >= 12 && cycle <= 16;
  const eyeHeight = isBlinking ? 2 : 28;

  // Gaze tracking drift
  const gazeX = Math.sin(frame * 0.05) * 8;
  const gazeY = Math.cos(frame * 0.04) * 4;

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
          <span>👁 OCULAR TRACKING</span>
          <span>•</span>
          <span>SACCADIC BLINK</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Eyes Canvas Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#080c14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
        }}
      >
        {/* Left Eye */}
        <div
          style={{
            width: 70,
            height: eyeHeight,
            borderRadius: '50%',
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
            transition: 'height 0.06s ease',
          }}
        >
          {/* Iris and Pupil */}
          <div
            style={{
              position: 'absolute',
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#0284c7',
              border: '2px solid #0369a1',
              transform: `translate(${gazeX}px, ${gazeY}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#000000' }} />
            <div style={{ position: 'absolute', top: 3, right: 3, width: 4, height: 4, borderRadius: '50%', background: '#ffffff' }} />
          </div>
        </div>

        {/* Right Eye */}
        <div
          style={{
            width: 70,
            height: eyeHeight,
            borderRadius: '50%',
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
            transition: 'height 0.06s ease',
          }}
        >
          {/* Iris and Pupil */}
          <div
            style={{
              position: 'absolute',
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#0284c7',
              border: '2px solid #0369a1',
              transform: `translate(${gazeX}px, ${gazeY}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#000000' }} />
            <div style={{ position: 'absolute', top: 3, right: 3, width: 4, height: 4, borderRadius: '50%', background: '#ffffff' }} />
          </div>
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
            color: '#7dd3fc',
          }}
        >
          GAZE: ({Math.round(gazeX)}, {Math.round(gazeY)}) | BLINK: {isBlinking ? 'CLOSED' : 'OPEN'}
        </div>
      </div>
    </div>
  );
};
