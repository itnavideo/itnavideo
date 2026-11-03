import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NeonStatCalloutProps {
  statText: string;
  subText?: string;
  triggerFrame?: number;
  neonColor?: string; // default neon green #22C55E or electric yellow #FACC15
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

  // Elastic spring overshoot: pops past 1.0 to 1.14 then snaps to 1.0 for high mobile punch
  const popSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 9, mass: 0.45, stiffness: 140 },
  });

  const scale = interpolate(popSpring, [0, 1], [0.65, 1.0]);
  const opacity = interpolate(relFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });

  // Floating particles around the stat in 9:16 vertical space
  const particles = [
    { x: -160, y: -60, speed: 0.9, char: '$', delay: 0 },
    { x: 180, y: -70, speed: 1.2, char: '$', delay: 2 },
    { x: -120, y: 50, speed: 0.8, char: '▲', delay: 4 },
    { x: 150, y: 60, speed: 1.1, char: '★', delay: 1 },
    { x: -70, y: -110, speed: 0.7, char: '$', delay: 5 },
    { x: 80, y: -120, speed: 1.0, char: '$', delay: 3 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 640, // Positioned on upper chest / center in 9:16 vertical screen
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
          width: 480,
          height: 240,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${neonColor}66 0%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating particles */}
      {particles.map((p, idx) => {
        const floatY = (relFrame * p.speed * 2.5) % 150;
        const partOpacity = interpolate(
          (relFrame + p.delay * 5) % 40,
          [0, 20, 40],
          [0, 0.9, 0]
        );
        return (
          <span
            key={idx}
            style={{
              position: 'absolute',
              transform: `translate(${p.x}px, ${p.y - floatY}px)`,
              fontSize: 26,
              fontWeight: 900,
              color: neonColor,
              textShadow: `0 0 14px ${neonColor}`,
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
          fontSize: 112,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: neonColor,
          textShadow: `0 0 28px ${neonColor}, 0 0 60px ${neonColor}88, 0 8px 16px rgba(0, 0, 0, 0.95)`,
          WebkitTextStroke: '3.5px rgba(0, 0, 0, 0.95)',
          lineHeight: 1,
          textAlign: 'center',
          maxWidth: '92%',
        }}
      >
        {statText}
      </span>

      {/* Optional Subtext Label */}
      {subText && (
        <span
          style={{
            marginTop: 12,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 24,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#FFFFFF',
            background: 'rgba(0, 0, 0, 0.85)',
            padding: '6px 20px',
            borderRadius: 12,
            border: `2px solid ${neonColor}88`,
            boxShadow: `0 0 20px ${neonColor}44`,
          }}
        >
          {subText}
        </span>
      )}
    </div>
  );
}

