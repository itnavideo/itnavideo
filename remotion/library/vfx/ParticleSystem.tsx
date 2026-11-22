import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface ParticleItem {
  id: number;
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  size: number;
  speed: number;
  opacity: number;
  color: string;
  twinkleSpeed: number;
}

export interface ParticleSystemProps {
  count?: number;
  type?: 'dust' | 'sparks' | 'bokeh' | 'stars';
  speed?: number;
  colors?: string[];
  direction?: 'up' | 'down' | 'float';
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 35,
  type = 'dust',
  speed = 1,
  colors = ['#ffffff', '#38bdf8', '#818cf8', '#f43f5e'],
  direction = 'up',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Generate deterministic particles from mathematical pseudo-random seed
  const particles: ParticleItem[] = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const h1 = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      const r1 = h1 - Math.floor(h1);
      const h2 = Math.sin(i * 269.5 + 183.3) * 43758.5453;
      const r2 = h2 - Math.floor(h2);
      const h3 = Math.sin(i * 419.2 + 371.9) * 43758.5453;
      const r3 = h3 - Math.floor(h3);

      const size =
        type === 'bokeh'
          ? 16 + r1 * 40
          : type === 'sparks'
          ? 2 + r1 * 4
          : type === 'stars'
          ? 2 + r1 * 5
          : 3 + r1 * 6;

      return {
        id: i,
        x: r1 * 100,
        y: r2 * 100,
        size,
        speed: 0.5 + r3 * 1.5,
        opacity: 0.3 + r2 * 0.7,
        color: colors[i % colors.length],
        twinkleSpeed: 1 + r1 * 3,
      };
    });
  }, [count, type, colors]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => {
        // Deterministic drift math
        const time = (frame / fps) * speed * p.speed;

        let curY = p.y;
        if (direction === 'up') {
          curY = (100 - ((p.y + time * 15) % 100));
        } else if (direction === 'down') {
          curY = (p.y + time * 15) % 100;
        } else {
          curY = p.y + Math.sin(time + p.id) * 8;
        }

        const curX = p.x + Math.sin(time * 0.8 + p.id * 1.5) * 6;
        const twinkle =
          0.3 + 0.7 * (0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * p.twinkleSpeed + p.id));
        const finalOpacity = p.opacity * twinkle;

        return (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${curX}%`,
              top: `${curY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: finalOpacity,
              boxShadow:
                type === 'bokeh'
                  ? `0 0 20px ${p.color}`
                  : type === 'sparks'
                  ? `0 0 8px ${p.color}`
                  : undefined,
              filter: type === 'bokeh' ? 'blur(6px)' : undefined,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};
