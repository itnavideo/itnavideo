import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MotionTrackerProps {
  targetLabel?: string;
  trackerColor?: string;
  className?: string;
}

export const MotionTracker: React.FC<MotionTrackerProps> = ({
  targetLabel = 'SUBJECT_HEAD_01',
  trackerColor = '#10b981',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const tx = Math.sin(frame * 0.08) * 40;
  const ty = Math.cos(frame * 0.06) * 25;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          MOTION TRACKER POINT
        </span>
        <span className="text-white/40">STATUS: LOCKED (100%)</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center overflow-hidden">
        <div
          className="w-16 h-16 border border-dashed rounded relative flex items-center justify-center transition-transform"
          style={{
            borderColor: trackerColor,
            transform: "translate(" + tx + "px, " + ty + "px)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: trackerColor }} />
          <div className="absolute -top-4 -left-1 text-[9px] font-bold" style={{ color: trackerColor }}>
            {targetLabel}
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>X: {(120 + tx).toFixed(1)}px • Y: {(80 + ty).toFixed(1)}px</span>
        <span>CONFIDENCE: 99.4%</span>
      </div>
    </div>
  );
};
