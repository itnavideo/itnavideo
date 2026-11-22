import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FootageLoopProps {
  loopCycleFrames?: number;
  mode?: 'forward' | 'ping-pong';
  label?: string;
  className?: string;
}

export const FootageLoop: React.FC<FootageLoopProps> = ({
  loopCycleFrames = 30,
  mode = 'forward',
  label = 'B-ROLL AMBIENT BACKGROUND',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const loopCount = Math.floor(frame / loopCycleFrames);
  const cycleFrame = frame % loopCycleFrames;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          FOOTAGE LOOP ENGINE
        </span>
        <span className="text-white/40">MODE: {mode.toUpperCase()}</span>
      </div>

      <div className="flex-1 my-4 rounded-xl bg-zinc-900 border border-white/10 flex flex-col items-center justify-center">
        <div className="text-4xl font-black text-teal-400 mb-2">
          CYCLE #{loopCount + 1}
        </div>
        <div className="text-xs text-white/50">{label}</div>
        <div className="text-[10px] text-white/40 mt-2">Frame {cycleFrame} / {loopCycleFrames}</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CROSSFADE WINDOW: 6f</span>
        <span>GAPLESS BUFFER: ON</span>
      </div>
    </div>
  );
};
