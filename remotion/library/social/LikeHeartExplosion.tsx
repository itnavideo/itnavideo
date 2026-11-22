import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LikeHeartExplosionProps {
  count?: number;
  burstFrame?: number;
  heartColor?: string;
  className?: string;
}

export const LikeHeartExplosion: React.FC<LikeHeartExplosionProps> = ({
  count = 14,
  burstFrame = 10,
  heartColor = '#f43f5e',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - burstFrame,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  // Center big heart trigger
  const centerScale = spring({
    frame: frame - burstFrame,
    fps,
    config: { damping: 8, stiffness: 220 },
  });

  const hearts = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const distance = interpolate(progress, [0, 1], [10, 120 + (i % 3) * 35]);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 16 + (i % 4) * 6;
    const rot = (i * 45 + frame * 3) % 360;
    const opacity = interpolate(progress, [0, 0.7, 1], [0, 1, 0]);

    return { id: i, x, y, size, rot, opacity };
  });

  return (
    <div className={`relative flex items-center justify-center w-64 h-64 ${className}`}>
      {/* Center trigger heart */}
      <div
        className="relative z-10 drop-shadow-2xl"
        style={{
          transform: `scale(${centerScale})`,
        }}
      >
        <svg className="w-16 h-16 fill-current text-rose-500" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Exploding particle hearts */}
      {frame >= burstFrame &&
        hearts.map((h) => (
          <div
            key={h.id}
            className="absolute pointer-events-none drop-shadow-lg"
            style={{
              transform: `translate(${h.x}px, ${h.y}px) rotate(${h.rot}deg)`,
              opacity: h.opacity,
            }}
          >
            <svg
              className="fill-current"
              style={{
                width: `${h.size}px`,
                height: `${h.size}px`,
                color: h.id % 2 === 0 ? heartColor : '#fb7185',
              }}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
    </div>
  );
};
