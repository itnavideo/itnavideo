import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface VUMeterProps {
  className?: string;
}

export const VUMeter: React.FC<VUMeterProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const needleAngle = -45 + (Math.sin(frame * 0.12) * 0.5 + 0.5) * 90;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          ANALOG VU NEEDLE METER
        </span>
        <span className="text-white/40">BALLISTICS: 300ms</span>
      </div>

      <div className="flex-1 my-4 bg-amber-100 rounded-xl border-4 border-zinc-800 p-4 relative overflow-hidden flex flex-col justify-between text-zinc-900">
        <div className="text-center text-xs font-bold tracking-widest text-zinc-700">VOLUME UNITS</div>
        <div className="flex justify-between text-[10px] font-bold px-4">
          <span>-20</span>
          <span>-10</span>
          <span>-7</span>
          <span>-3</span>
          <span className="text-red-600">0</span>
          <span className="text-red-600">+3</span>
        </div>
        {/* Needle */}
        <div className="w-full flex justify-center items-end h-20 relative">
          <div
            className="w-0.5 h-20 bg-zinc-900 origin-bottom shadow"
            style={{ transform: 'rotate(' + needleAngle.toFixed(1) + 'deg)' }}
          />
          <div className="w-4 h-4 rounded-full bg-zinc-900 absolute -bottom-2" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>0 VU = +4 dBu</span>
        <span>HEADROOM: 18 dB</span>
      </div>
    </div>
  );
};
