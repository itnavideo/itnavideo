import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WhiteBalanceProps {
  temperature?: number; // in Kelvin e.g. 5600
  tint?: number; // -50 to 50 (Green to Magenta)
  className?: string;
}

export const WhiteBalance: React.FC<WhiteBalanceProps> = ({
  temperature = 5600,
  tint = 4,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          WHITE BALANCE & KELVIN
        </span>
        <span className="text-white/40">DAYLIGHT D56</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/90 rounded-xl border border-white/10 p-5 flex flex-col justify-center items-center">
        <div className="text-4xl font-black text-amber-400 mb-1">{temperature}K</div>
        <div className="text-xs text-white/60 mb-4">Color Temperature (Kelvin)</div>
        <div className="w-full h-3 rounded-full bg-gradient-to-r from-blue-500 via-white to-amber-500 mb-2" />
        <div className="text-[10px] text-white/40 flex justify-between w-full">
          <span>2500K (Tungsten)</span>
          <span>Tint: {tint > 0 ? ('+' + tint) : tint}</span>
          <span>10000K (Shade)</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SENSOR CALIBRATION: AUTO</span>
        <span>NEUTRAL GRAY REF: 18%</span>
      </div>
    </div>
  );
};
