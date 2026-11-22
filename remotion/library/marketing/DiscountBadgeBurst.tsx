import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface DiscountBadgeBurstProps {
  percentOff?: number;
  label?: string;
  className?: string;
}

export const DiscountBadgeBurst: React.FC<DiscountBadgeBurstProps> = ({
  percentOff = 50,
  label = 'OFF TODAY ONLY',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 60], [-10, 10], { extrapolateRight: 'clamp' });

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          STARBURST DISCOUNT BADGE
        </span>
        <span className="text-white/40">PROMO STICKER</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <div
          className="w-40 h-40 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 p-2 shadow-2xl flex flex-col items-center justify-center text-black border-4 border-white"
          style={{ transform: "rotate(" + rotation + "deg)" }}
        >
          <span className="text-4xl font-black font-mono leading-none tracking-tight">{percentOff}%</span>
          <span className="text-[11px] font-black tracking-wider text-center mt-1">{label}</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>VISUAL HOOK: HIGH CONTRAST</span>
        <span>CTR IMPACT: +28%</span>
      </div>
    </div>
  );
};
