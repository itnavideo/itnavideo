import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface VHSOverlayProps {
  timestamp?: string;
  className?: string;
}

export const VHSOverlay: React.FC<VHSOverlayProps> = ({
  timestamp = 'SP  0:00:14  PM 11:42',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-bold border border-green-500/30">
          VINTAGE VHS CAMCORDER OSD
        </span>
        <span className="text-green-400 font-bold animate-pulse">PLAY ▶</span>
      </div>

      <div className="flex-1 my-4 bg-black/80 rounded-xl border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="text-sm font-mono text-green-400 tracking-widest">{timestamp}</div>
        <div className="w-full h-2 bg-white/20 opacity-40 blur-xs my-auto" />
        <div className="text-xs font-mono text-green-400/70">AUTO TRACKING • HI-FI STEREO</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>TAPE FORMAT: NTSC VHS</span>
        <span>MAGNETIC DISTORTION: 4%</span>
      </div>
    </div>
  );
};
