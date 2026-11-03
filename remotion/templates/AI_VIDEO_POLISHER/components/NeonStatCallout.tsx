import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NeonStatCalloutProps {
  statText: string;
  subText?: string;
  triggerFrame?: number;
  neonColor?: string; // default neon green #22C55E
}

export function NeonStatCallout({
  statText,
  subText,
  triggerFrame = 0,
  neonColor = '#22C55E',
}: NeonStatCalloutProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - triggerFrame);

  // Elastic spring overshoot: pops in past 1.0 to 1.12, then settles to 1.0 in ~12 frames
  const popSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 9, mass: 0.45, stiffness: 140 },
  });

  const scale = interpolate(popSpring, [0, 1], [0.65, 1.0]);
  const opacity = interpolate(relFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });

  // Floating particles around the stat
  const particles = [
    { x: -140, y: -40, speed: 0.8, char: '$', delay: 0 },
    { x: 160, y: -50, speed: 1.1, char: '$', delay: 3 },
    { x: -220, y: 30, speed: 0.9, char: '▲', delay: 5 },
    { x: 230, y: 40, speed: 1.2, char: '★', delay: 2 },
    { x: -80, y: -80, speed: 0.7, char: '$', delay: 6 },
    { x: 90, y: -90, speed: 1.0, char: '$', delay: 4 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 160,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Ambient Radial Neon Glow behind the stat */}
      <div
        style={{
          position: 'absolute',
          width: 550,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${neonColor}55 0%, transparent 70%)`,
          filter: 'blur(35px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating particles */}
      {particles.map((p, idx) => {
        const floatY = (relFrame * p.speed * 2) % 120;
        const partOpacity = interpolate(
          (relFrame + p.delay * 5) % 40,
          [0, 20, 40],
          [0, 0.85, 0]
        );
        return (
          <span
            key={idx}
            style={{
              position: 'absolute',
              transform: `translate(${p.x}px, ${p.y - floatY}px)`,
              fontSize: 22,
              fontWeight: 900,
              color: neonColor,
              textShadow: `0 0 12px ${neonColor}`,
              opacity: partOpacity,
              pointerEvents: 'none',
            }}
          >
            {p.char}
          </span>
        );
      })}

      {/* Main Giant Neon Stat Display */}
      <span
        style={{
          fontFamily: 'Montserrat, "Arial Black", sans-serif',
          fontSize: 104,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: neonColor,
          textShadow: `0 0 25px ${neonColor}, 0 0 50px ${neonColor}88, 0 6px 14px rgba(0, 0, 0, 0.95)`,
          WebkitTextStroke: '3px rgba(0, 0, 0, 0.9)',
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        {statText}
      </span>

      {/* Optional Subtext Label */}
      {subText && (
        <span
          style={{
            marginTop: 8,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 22,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#FFFFFF',
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '4px 16px',
            borderRadius: 8,
            border: `1.5px solid ${neonColor}88`,
            boxShadow: `0 0 16px ${neonColor}44`,
          }}
        >
          {subText}
        </span>
      )}
    </div>
  );
}

