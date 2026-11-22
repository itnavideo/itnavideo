import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnSunProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnSun: React.FC<HandDrawnSunProps> = ({
  color = '#f97316',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const circleProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
          HAND-DRAWN SUN DOODLE
        </span>
        <span className="text-orange-400 font-bold">ENERGY / OPTIMISM</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="22"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray="140"
            strokeDashoffset={140 * (1 - circleProgress)}
          />
          {/* 8 Wavy Sun Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={"rotate(" + angle + " 50 50)"}>
              <line x1="50" y1="18" x2="50" y2="8" stroke={color} strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SOLAR RADIANCE PATTERN</span>
        <span>WARMTH / BRIGHT FUTURE</span>
      </div>
    </div>
  );
};
