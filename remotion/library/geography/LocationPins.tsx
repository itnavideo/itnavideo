import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LocationPinProps {
  type?: 'drop' | 'pulse' | 'numbered' | 'card' | 'radar';
  label?: string;
  sublabel?: string;
  number?: number;
  color?: string;
  size?: number;
  delay?: number;
  style?: React.CSSProperties;
}

/**
 * LocationPins — Multi-style geographic pin marker suite.
 * Features bouncing spring drop, radar scan ripples, numbered step badges,
 * and elevated glassmorphic callout cards.
 */
export function LocationPins({
  type = 'drop',
  label = 'Silicon Valley HQ',
  sublabel = '37.3861° N, 122.0839° W',
  number = 1,
  color = '#10b981',
  size = 40,
  delay = 0,
  style,
}: LocationPinProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Bouncing drop entrance spring
  const dropSpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 11, stiffness: 120, mass: 0.7 },
  });

  const translateY = interpolate(dropSpr, [0, 1], [-60, 0]);
  const opacity = interpolate(dropSpr, [0, 1], [0, 1]);

  // Pulse ripple
  const pulseLoop = (adjustedFrame % 35) / 35;
  const rippleScale = 1 + pulseLoop * 2.5;
  const rippleOpacity = (1 - pulseLoop) * 0.7;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${translateY}px)`,
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* 1. Card Pin Mode */}
      {type === 'card' && (
        <div
          style={{
            marginBottom: 8,
            padding: '6px 14px',
            borderRadius: 10,
            backgroundColor: 'rgba(9, 9, 11, 0.9)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${color}`,
            boxShadow: `0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px ${color}40`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{label}</span>
          {sublabel && (
            <span style={{ color: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }}>
              {sublabel}
            </span>
          )}
        </div>
      )}

      {/* Pin Body / Glyph */}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pulse / Radar Waves */}
        {(type === 'pulse' || type === 'radar') && (
          <div
            style={{
              position: 'absolute',
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: '50%',
              border: `2px solid ${color}`,
              transform: `scale(${rippleScale})`,
              opacity: rippleOpacity,
            }}
          />
        )}

        {/* Numbered Pin Badge */}
        {type === 'numbered' ? (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 14px ${color}80`,
            }}
          >
            <span
              style={{
                transform: 'rotate(45deg)',
                color: '#09090b',
                fontSize: size * 0.45,
                fontWeight: 900,
              }}
            >
              {number}
            </span>
          </div>
        ) : (
          /* Classic Teardrop Pin */
          <svg width={size} height={size * 1.25} viewBox="0 0 24 30" fill={color}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18c0-6.63-5.37-12-12-12zm0 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
          </svg>
        )}
      </div>

      {/* Ground Shadow Dot */}
      <div
        style={{
          width: 14,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          marginTop: -2,
        }}
      />
    </div>
  );
}
