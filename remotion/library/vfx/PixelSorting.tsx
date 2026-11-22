import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface PixelSortingProps {
  children?: React.ReactNode;
  streakCount?: number;
  orientation?: 'horizontal' | 'vertical';
  threshold?: number; // 0.1 to 0.8
  intensity?: number;
  color?: string;
  className?: string;
}

export const PixelSorting: React.FC<PixelSortingProps> = ({
  children,
  streakCount = 14,
  orientation = 'horizontal',
  threshold = 0.4,
  intensity = 1.0,
  color = '#38bdf8',
  className = '',
}) => {
  const frame = useCurrentFrame();

  // Deterministically generate sorting streaks
  const streaks = React.useMemo(() => {
    return Array.from({ length: streakCount }).map((_, i) => {
      const hash = Math.sin(i * 91.3 + 12.7) * 43758.5;
      const r1 = hash - Math.floor(hash);
      const hash2 = Math.sin(i * 37.1 + 84.3) * 43758.5;
      const r2 = hash2 - Math.floor(hash2);

      return {
        id: i,
        pos: r1 * 100,
        thickness: 2 + r2 * 8,
        length: 20 + r1 * 60,
        speed: 0.8 + r2 * 1.5,
      };
    });
  }, [streakCount]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base Layer */}
      <div className="relative z-10">{children}</div>

      {/* Pixel Sorted Luminance Streaks */}
      <div className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-70">
        {streaks.map((s) => {
          // Time-modulated stretching length
          const dynamicLength =
            s.length * (0.6 + 0.4 * Math.sin(frame * 0.1 * s.speed + s.id)) * intensity;

          const isHoriz = orientation === 'horizontal';

          return (
            <div
              key={s.id}
              className="absolute"
              style={{
                top: isHoriz ? `${s.pos}%` : '0%',
                left: isHoriz ? '0%' : `${s.pos}%`,
                width: isHoriz ? `${dynamicLength}%` : `${s.thickness}px`,
                height: isHoriz ? `${s.thickness}px` : `${dynamicLength}%`,
                background: `linear-gradient(${
                  isHoriz ? '90deg' : '180deg'
                }, transparent, ${color}, rgba(255,255,255,0.9), transparent)`,
                filter: 'blur(0.5px)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
