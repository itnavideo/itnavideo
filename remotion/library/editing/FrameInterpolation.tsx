import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FrameInterpolationProps {
  inputFps?: number;
  outputFps?: number;
  mode?: 'flow' | 'ai-nerf' | 'blend';
  className?: string;
}

export const FrameInterpolation: React.FC<FrameInterpolationProps> = ({
  inputFps = 24,
  outputFps = 60,
  mode = 'flow',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center font-mono text-xs">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          AI FRAME INTERPOLATION
        </span>
        <span className="text-white/50">{inputFps} FPS ➔ {outputFps} FPS</span>
      </div>

      <div className="flex-1 my-4 rounded-xl bg-zinc-900/80 border border-white/10 p-6 flex flex-col justify-center items-center">
        <div className="text-xs uppercase tracking-widest text-indigo-400 font-mono mb-2">
          Interpolated Intermediate Subframes
        </div>
        <div className="flex items-center space-x-3 my-2">
          <div className="px-3 py-2 bg-zinc-800 rounded border border-white/20 text-xs font-mono">Frame N</div>
          <span className="text-indigo-400 font-bold">➔</span>
          <div className="px-3 py-2 bg-indigo-950/80 text-indigo-300 rounded border border-indigo-500/40 text-xs font-mono animate-pulse">
            Subframe +0.5 (AI Generated)
          </div>
          <span className="text-indigo-400 font-bold">➔</span>
          <div className="px-3 py-2 bg-zinc-800 rounded border border-white/20 text-xs font-mono">Frame N+1</div>
        </div>
      </div>

      <div className="font-mono text-xs text-white/40 flex justify-between">
        <span>ALGORITHM: {mode.toUpperCase()}</span>
        <span>FRAME JITTER: 0.00%</span>
      </div>
    </div>
  );
};
