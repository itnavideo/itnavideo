import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WorldGlobeProps {
  size?: number;
  rotationSpeed?: number;
  landColor?: string;
  oceanColor?: string;
  atmosphereGlow?: boolean;
  className?: string;
}

export const WorldGlobe: React.FC<WorldGlobeProps> = ({
  size = 320,
  rotationSpeed = 1,
  landColor = '#38bdf8',
  oceanColor = '#0f172a',
  atmosphereGlow = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const rot = interpolate(frame * rotationSpeed, [0, fps * 10], [0, 360]) % 360;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        transform: `scale(${entry})`,
      }}
    >
      {/* Outer Atmospheric Glow */}
      {atmosphereGlow && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, transparent 55%, ${landColor}44 85%, ${landColor}88 100%)`,
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Globe Sphere */}
      <div
        className="relative rounded-full overflow-hidden border-2 border-sky-500/40 shadow-2xl"
        style={{
          width: size,
          height: size,
          backgroundColor: oceanColor,
          boxShadow: `inset -25px -25px 40px rgba(0,0,0,0.8), 0 0 30px ${landColor}33`,
        }}
      >
        {/* SVG Rotating Meridians & Parallels */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
        >
          {/* Latitude Parallels */}
          {[-45, -20, 0, 20, 45].map((lat, idx) => {
            const y = (size / 2) + (lat / 90) * (size / 2) * 0.85;
            const r = Math.cos((lat * Math.PI) / 180) * (size / 2);
            return (
              <ellipse
                key={idx}
                cx={size / 2}
                cy={y}
                rx={r}
                ry={r * 0.25}
                fill="none"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
            );
          })}

          {/* Longitude Meridians (Rotating Phase) */}
          {[-60, -30, 0, 30, 60].map((lon, idx) => {
            const rx = Math.abs(Math.sin(((lon + rot) * Math.PI) / 180)) * (size / 2);
            return (
              <ellipse
                key={idx}
                cx={size / 2}
                cy={size / 2}
                rx={Math.max(1, rx)}
                ry={size / 2}
                fill="none"
                stroke={landColor}
                strokeWidth="1.2"
                strokeOpacity="0.4"
              />
            );
          })}

          {/* Equator Line */}
          <line
            x1="0"
            y1={size / 2}
            x2={size}
            y2={size / 2}
            stroke={landColor}
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          {/* Prime Meridian */}
          <line
            x1={size / 2}
            y1="0"
            x2={size / 2}
            y2={size}
            stroke={landColor}
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
        </svg>

        {/* Specular Ambient Surface Light */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)',
          }}
        />
      </div>
    </div>
  );
};
