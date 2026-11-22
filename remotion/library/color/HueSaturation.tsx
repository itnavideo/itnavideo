import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HueSaturationProps {
  hueShift?: number; // -180 to 180
  saturation?: number; // 0 to 200
  luminance?: number; // -100 to 100
  className?: string;
}

export const HueSaturation: React.FC<HueSaturationProps> = ({
  hueShift = 15,
  saturation = 110,
  luminance = 0,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-400 font-bold border border-fuchsia-500/30">
          HUE / SATURATION / LIGHTNESS
        </span>
        <span className="text-white/40">HSL CHANNELS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col justify-center space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">Master Hue Shift</span>
            <span className="text-fuchsia-400 font-bold">{hueShift}°</span>
          </div>
          <div className="w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">Saturation Boost</span>
            <span className="text-cyan-400 font-bold">{saturation}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-700 overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: (saturation / 2) + '%' }} />
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>VIBRANCE MAPPING: ON</span>
        <span>SKIN TONE PROTECT: ENABLED</span>
      </div>
    </div>
  );
};
