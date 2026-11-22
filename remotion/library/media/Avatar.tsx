import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AvatarProps {
  src?: string;
  name?: string;
  role?: string;
  size?: number;
  status?: 'speaking' | 'online' | 'busy' | 'offline';
  pulseRings?: boolean;
  glowColor?: string;
  verified?: boolean;
  style?: React.CSSProperties;
}

/**
 * Avatar — Animated presenter / speaker / creator profile component.
 * Features reactive soundwave pulse rings when status='speaking',
 * online indicator badge, verified checkmark, and name/role tags.
 */
export function Avatar({
  src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  name,
  role,
  size = 110,
  status = 'speaking',
  pulseRings = true,
  glowColor = '#10b981',
  verified = true,
  style,
}: AvatarProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrySpr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const entryScale = interpolate(entrySpr, [0, 1], [0.8, 1]);
  const entryOpacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Speaking pulse rings
  const isSpeaking = status === 'speaking';
  const pulse1 = isSpeaking ? (frame % 30) / 30 : 0;
  const pulse2 = isSpeaking ? ((frame + 15) % 30) / 30 : 0;

  const ringScale1 = 1 + pulse1 * 0.35;
  const ringOpacity1 = (1 - pulse1) * 0.6;

  const ringScale2 = 1 + pulse2 * 0.35;
  const ringOpacity2 = (1 - pulse2) * 0.6;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        transform: `scale(${entryScale})`,
        opacity: entryOpacity,
        ...style,
      }}
    >
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
        {/* Pulsing Acoustic Speech Rings */}
        {pulseRings && isSpeaking && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `2px solid ${glowColor}`,
                transform: `scale(${ringScale1})`,
                opacity: ringOpacity1,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `2px solid ${glowColor}`,
                transform: `scale(${ringScale2})`,
                opacity: ringOpacity2,
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Circular Avatar Container */}
        <div
          style={{
            position: 'relative',
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `3px solid ${isSpeaking ? glowColor : 'rgba(255, 255, 255, 0.2)'}`,
            boxShadow: isSpeaking
              ? `0 0 24px ${glowColor}60, 0 8px 24px rgba(0, 0, 0, 0.6)`
              : '0 8px 20px rgba(0, 0, 0, 0.5)',
            backgroundColor: '#18181b',
          }}
        >
          <Img
            src={src}
            alt={name || 'Speaker Avatar'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Online / Speaking Dot Status */}
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: Math.max(14, size * 0.16),
            height: Math.max(14, size * 0.16),
            borderRadius: '50%',
            backgroundColor:
              status === 'speaking' || status === 'online'
                ? '#10b981'
                : status === 'busy'
                  ? '#ef4444'
                  : '#71717a',
            border: '2.5px solid #09090b',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {status === 'speaking' && (
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: '#fff',
              }}
            />
          )}
        </div>
      </div>

      {/* Name & Role Kicker */}
      {(name || role) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            textAlign: 'center',
          }}
        >
          {name && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#f4f4f5',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              <span>{name}</span>
              {verified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#38bdf8">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </div>
          )}
          {role && (
            <span
              style={{
                color: '#a1a1aa',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {role}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
