import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnCrossProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnCross: React.FC<HandDrawnCrossProps> = ({
  color = '#ef4444',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const stroke1 = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const stroke2 = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          HAND-DRAWN X CROSS
        </span>
        <span className="text-red-400 font-bold">REJECTION / FALSE</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Stroke 1: Top-Left to Bottom-Right */}
          <path
            d="M 18,16 Q 48,52 84,84"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset={120 * (1 - stroke1)}
          />
          {/* Stroke 2: Top-Right to Bottom-Left */}
          <path
            d="M 82,18 Q 52,50 16,82"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset={120 * (1 - stroke2)}
          />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STROKE ORDER: 2-PASS SKETCH</span>
        <span>ORGANIC JITTER: 4%</span>
      </div>
    </div>
  );
};
