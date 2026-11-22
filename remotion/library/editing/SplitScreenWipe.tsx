import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface SplitScreenWipeProps {
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  dividerColor?: string;
  className?: string;
}

export const SplitScreenWipe: React.FC<SplitScreenWipeProps> = ({
  direction = 'horizontal',
  dividerColor = '#38bdf8',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const wipePos = interpolate(frame, [0, 60], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div className={"relative w-full h-full bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden text-white flex flex-col justify-between p-6 " + className}>
      <div className="flex justify-between items-center font-mono text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          SPLIT SCREEN WIPE TRANSITION
        </span>
        <span className="text-white/40">POS: {wipePos.toFixed(0)}%</span>
      </div>

      <div className="flex-1 my-4 rounded-xl border border-white/10 relative overflow-hidden flex">
        <div
          className="h-full bg-sky-950/40 flex items-center justify-center font-mono text-xs font-bold text-sky-300"
          style={{ width: wipePos + '%' }}
        >
          CLIP B (REVEALED)
        </div>
        <div className="flex-1 h-full bg-zinc-800/60 flex items-center justify-center font-mono text-xs font-bold text-white/50">
          CLIP A (OUTGOING)
        </div>
        <div
          className="absolute top-0 bottom-0 w-1 shadow-lg"
          style={{ left: wipePos + '%', backgroundColor: dividerColor }}
        />
      </div>

      <div className="font-mono text-xs text-white/40 flex justify-between z-10">
        <span>FEATHER: 0px</span>
        <span>ANGLE: 90°</span>
      </div>
    </div>
  );
};
