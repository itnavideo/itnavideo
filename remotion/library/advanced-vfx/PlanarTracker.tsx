import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PlanarTrackerProps {
  surfaceLabel?: string;
  gridColor?: string;
  className?: string;
}

export const PlanarTracker: React.FC<PlanarTrackerProps> = ({
  surfaceLabel = 'PERSPECTIVE PLANAR SURFACE',
  gridColor = '#f59e0b',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const skew = Math.sin(frame * 0.07) * 8;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          MOCHA 2.5D PLANAR TRACKER
        </span>
        <span className="text-white/40">4-CORNER PIN</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center overflow-hidden">
        <div
          className="w-56 h-36 border-2 border-amber-400/80 bg-amber-950/20 rounded relative flex items-center justify-center"
          style={{ transform: "perspective(300px) rotateY(" + skew + "deg) rotateX(10deg)" }}
        >
          <div className="grid grid-cols-4 grid-rows-3 w-full h-full border border-amber-400/30 opacity-60">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border border-amber-400/20" />
            ))}
          </div>
          <span className="absolute text-[10px] text-amber-300 font-bold">{surfaceLabel}</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>HOMOGRAPHY MATRIX: SOLVED</span>
        <span>SHEAR: {skew.toFixed(1)}°</span>
      </div>
    </div>
  );
};
