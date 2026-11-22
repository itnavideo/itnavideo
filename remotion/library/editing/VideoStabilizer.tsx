import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface VideoStabilizerProps {
  jitterAmount?: number;
  className?: string;
}

export const VideoStabilizer: React.FC<VideoStabilizerProps> = ({
  jitterAmount = 8,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const rawJitterX = Math.sin(frame * 0.8) * jitterAmount;
  const rawJitterY = Math.cos(frame * 0.9) * jitterAmount;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center font-mono text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          WARP STABILIZER 2.0
        </span>
        <span className="text-white/40">SMOOTHNESS: 65%</span>
      </div>

      <div className="flex-1 my-4 rounded-xl bg-zinc-900/80 border border-white/10 relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute w-72 h-44 border border-dashed border-red-500/40 rounded-lg flex items-start justify-end p-2 text-[9px] font-mono text-red-400"
          style={{ transform: 'translate(' + rawJitterX + 'px, ' + rawJitterY + 'px)' }}
        >
          RAW SHAKY CROP
        </div>

        <div className="w-64 h-36 border-2 border-teal-400 bg-teal-950/20 rounded-lg flex flex-col items-center justify-center text-teal-300 font-mono text-xs z-10">
          <span>STABILIZED HORIZON LOCK</span>
          <span className="text-[10px] text-white/50 mt-1">3-Axis Gyro Damping</span>
        </div>
      </div>

      <div className="font-mono text-xs text-white/40 flex justify-between">
        <span>CROP OVERHEAD: 112%</span>
        <span>ROLL / PITCH COMPENSATED</span>
      </div>
    </div>
  );
};
