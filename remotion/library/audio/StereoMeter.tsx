import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface StereoMeterProps {
  className?: string;
}

export const StereoMeter: React.FC<StereoMeterProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          GONIOMETER / LISSAJOUS SCOPE
        </span>
        <span className="text-white/40">PHASE CORRELATION</span>
      </div>

      <div className="flex-1 my-4 bg-black/80 rounded-xl border border-white/10 p-4 relative flex items-center justify-center overflow-hidden">
        <div
          className="w-24 h-24 border-2 border-teal-400 rounded-full"
          style={{ transform: "rotate(45deg) scaleX(" + (0.8 + Math.sin(frame * 0.1) * 0.4) + ")" }}
        />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#fff" strokeOpacity="0.1" />
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>STEREO PHASE: +1.0 (IN PHASE)</span>
        <span>WIDTH: NORMAL</span>
      </div>
    </div>
  );
};
