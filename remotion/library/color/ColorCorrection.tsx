import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ColorCorrectionProps {
  lift?: number; // -100 to 100
  gamma?: number; // -100 to 100
  gain?: number; // -100 to 100
  offset?: number; // -100 to 100
  label?: string;
  className?: string;
}

export const ColorCorrection: React.FC<ColorCorrectionProps> = ({
  lift = 0,
  gamma = 5,
  gain = 12,
  offset = 0,
  label = 'PRIMARY COLOR BALANCE',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          PRIMARY COLOR CORRECTION
        </span>
        <span className="text-white/40">ACEScc PIPELINE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col justify-center space-y-4">
        <div className="text-center text-xs text-white/50 mb-1">{label}</div>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-lg bg-black/50 border border-white/5">
            <div className="text-[10px] text-white/40 mb-1">LIFT</div>
            <div className="text-lg font-bold text-sky-400">{lift > 0 ? ('+' + lift) : lift}</div>
            <div className="text-[9px] text-white/30">Shadows</div>
          </div>
          <div className="p-3 rounded-lg bg-black/50 border border-white/5">
            <div className="text-[10px] text-white/40 mb-1">GAMMA</div>
            <div className="text-lg font-bold text-emerald-400">{gamma > 0 ? ('+' + gamma) : gamma}</div>
            <div className="text-[9px] text-white/30">Midtones</div>
          </div>
          <div className="p-3 rounded-lg bg-black/50 border border-white/5">
            <div className="text-[10px] text-white/40 mb-1">GAIN</div>
            <div className="text-lg font-bold text-amber-400">{gain > 0 ? ('+' + gain) : gain}</div>
            <div className="text-[9px] text-white/30">Highlights</div>
          </div>
          <div className="p-3 rounded-lg bg-black/50 border border-white/5">
            <div className="text-[10px] text-white/40 mb-1">OFFSET</div>
            <div className="text-lg font-bold text-purple-400">{offset > 0 ? ('+' + offset) : offset}</div>
            <div className="text-[9px] text-white/30">Master</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>COLOR SPACE: REC.709</span>
        <span>FRAME: {frame}</span>
      </div>
    </div>
  );
};
