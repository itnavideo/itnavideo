import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface TimeRemappingProps {
  keyframes?: { frame: number; sourceFrame: number }[];
  accentColor?: string;
  className?: string;
}

export const TimeRemapping: React.FC<TimeRemappingProps> = ({
  keyframes = [
    { frame: 0, sourceFrame: 0 },
    { frame: 30, sourceFrame: 60 },
    { frame: 60, sourceFrame: 75 },
    { frame: 90, sourceFrame: 180 },
  ],
  accentColor = '#06b6d4',
  className = '',
}) => {
  const frame = useCurrentFrame();

  const framesArr = keyframes.map((k) => k.frame);
  const sourceArr = keyframes.map((k) => k.sourceFrame);

  const virtualSourceFrame = Math.round(
    interpolate(frame, framesArr, sourceArr, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl flex flex-col justify-between text-white font-mono " + className}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-sm font-bold tracking-wider">TIME REMAPPING GRAPH</span>
        </div>
        <div className="text-xs text-white/50">NON-LINEAR TIMELINE</div>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center">
        <div className="text-xs text-cyan-400 mb-1 uppercase tracking-widest font-semibold">
          Source Timecode Scrubber
        </div>
        <div className="text-4xl font-extrabold tracking-tight">
          00:00:{(virtualSourceFrame / 30).toFixed(2)}s
        </div>
        <div className="text-xs text-white/40 mt-2">
          Timeline Frame: {frame} ➔ Remapped Source Frame: {virtualSourceFrame}
        </div>
      </div>

      <div className="bg-black/60 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
        {keyframes.map((k, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="w-2.5 h-2.5 rotate-45 border border-cyan-400 bg-cyan-950 mb-1" />
            <span className="text-[10px] text-white/60">F:{k.frame}</span>
            <span className="text-[9px] text-cyan-400">Src:{k.sourceFrame}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
