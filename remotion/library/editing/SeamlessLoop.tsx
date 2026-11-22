import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SeamlessLoopProps {
  durationInFrames?: number;
  label?: string;
  accentColor?: string;
  className?: string;
}

export const SeamlessLoop: React.FC<SeamlessLoopProps> = ({
  durationInFrames = 60,
  label = 'INFINITE REEL SEAMLESS MOTIF',
  accentColor = '#a855f7',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const progress = (frame % durationInFrames) / durationInFrames;
  const rotation = progress * 360;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          SEAMLESS LOOP (TIKTOK/REEL)
        </span>
        <span className="text-white/40">END ➔ START MATCH</span>
      </div>

      <div className="flex-1 my-4 rounded-xl bg-black/60 border border-white/10 relative flex items-center justify-center overflow-hidden">
        <div
          className="w-40 h-40 rounded-full border-4 border-dashed border-purple-400 flex items-center justify-center"
          style={{ transform: 'rotate(' + rotation + 'deg)' }}
        >
          <div className="w-20 h-20 rounded-full bg-purple-950/40 border border-purple-500/50 flex items-center justify-center text-xs font-bold">
            ∞
          </div>
        </div>
        <div className="absolute bottom-4 text-xs text-white/60 font-semibold">{label}</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>PERFECT HARMONIC SYNC</span>
        <span>PHASE: {(progress * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};
