import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnTargetBullseyeProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnTargetBullseye: React.FC<HandDrawnTargetBullseyeProps> = ({
  color = '#ef4444',
  size = 130,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const ring1 = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const ring2 = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const ring3 = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          HAND-DRAWN TARGET BULLSEYE
        </span>
        <span className="text-red-400 font-bold">PRECISION FOCUS</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Outer ring */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray="265"
            strokeDashoffset={265 * (1 - ring1)}
          />
          {/* Middle ring */}
          <circle
            cx="50"
            cy="50"
            r="26"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray="165"
            strokeDashoffset={165 * (1 - ring2)}
          />
          {/* Center bullseye dot */}
          <circle cx="50" cy="50" r={10 * ring3} fill={color} />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CONCENTRIC RINGS: 3-TIER SKETCH</span>
        <span>ACCURACY: DEAD CENTER</span>
      </div>
    </div>
  );
};
