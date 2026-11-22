import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ThermalVisionProps {
  palette?: 'ironbow' | 'rainbow' | 'white-hot';
  maxTemp?: number; // e.g. 42 C
  minTemp?: number; // e.g. 18 C
  className?: string;
}

export const ThermalVision: React.FC<ThermalVisionProps> = ({
  palette = 'ironbow',
  maxTemp = 41.5,
  minTemp = 18.2,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          FLIR THERMAL HEATMAP
        </span>
        <span className="text-white/40">PALETTE: {palette.toUpperCase()}</span>
      </div>

      <div
        className="flex-1 my-4 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #7c2d12 40%, #e11d48 70%, #fef08a 100%)',
        }}
      >
        <div className="text-center z-10 text-white drop-shadow-md">
          <div className="text-3xl font-black tracking-tight">{maxTemp}°C MAX</div>
          <div className="text-xs text-yellow-200 mt-1">Body Heat Signature Detected</div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>MIN: {minTemp}°C</span>
        <span>EMISSIVITY: 0.98</span>
      </div>
    </div>
  );
};
