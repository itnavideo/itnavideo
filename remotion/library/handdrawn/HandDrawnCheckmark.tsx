import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface HandDrawnCheckmarkProps {
  color?: string;
  size?: number;
  className?: string;
}

export const HandDrawnCheckmark: React.FC<HandDrawnCheckmarkProps> = ({
  color = '#10b981',
  size = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          HAND-DRAWN CHECKMARK
        </span>
        <span className="text-emerald-400 font-bold">VERIFIED / TRUE</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M 18,52 Q 35,74 44,82 Q 62,45 86,18"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="130"
            strokeDashoffset={130 * (1 - progress)}
          />
        </svg>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STROKE TYPE: FLUENT MARKER</span>
        <span>VERIFICATION STAMP</span>
      </div>
    </div>
  );
};
