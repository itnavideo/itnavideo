import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HighlightMaskProps {
  highlightColor?: string;
  text?: string;
  className?: string;
}

export const HighlightMask: React.FC<HighlightMaskProps> = ({
  highlightColor = '#facc15',
  text = 'Autonomous rendering achieved in 48 seconds flat.',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          MARKER HIGHLIGHT MASK
        </span>
        <span className="text-white/40">TRANSLUCENT INK</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-6 flex items-center justify-center text-center">
        <div className="relative inline-block text-lg font-bold text-white">
          <span
            className="absolute inset-0 -skew-y-1 opacity-70 rounded"
            style={{ backgroundColor: highlightColor, zIndex: 0 }}
          />
          <span className="relative z-10 text-black font-black px-2">{text}</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>BLEND MODE: MULTIPLY</span>
        <span>PEN ANGLE: -1.5°</span>
      </div>
    </div>
  );
};
