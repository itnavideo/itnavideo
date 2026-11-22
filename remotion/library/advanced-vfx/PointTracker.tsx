import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PointTrackerProps {
  numPoints?: number;
  className?: string;
}

export const PointTracker: React.FC<PointTrackerProps> = ({
  numPoints = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          MULTI-POINT FEATURE TRACKER
        </span>
        <span className="text-white/40">POINTS: {numPoints} ACTIVE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative grid grid-cols-2 gap-4">
        {Array.from({ length: numPoints }).map((_, i) => (
          <div key={i} className="p-3 bg-black/50 rounded border border-white/10 flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <div className="text-[11px] font-bold text-white">TRACK_PT_0{i + 1}</div>
              <div className="text-[9px] text-white/40">Vel: {(2.4 + i * 0.8).toFixed(1)} px/f</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>OPTICAL FLOW: KLT</span>
        <span>ERROR RESIDUAL: 0.02%</span>
      </div>
    </div>
  );
};
