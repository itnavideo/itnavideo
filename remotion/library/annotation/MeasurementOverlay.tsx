import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MeasurementOverlayProps {
  widthPx?: number;
  heightPx?: number;
  className?: string;
}

export const MeasurementOverlay: React.FC<MeasurementOverlayProps> = ({
  widthPx = 1080,
  heightPx = 1920,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          DIMENSION CALIPER OVERLAY
        </span>
        <span className="text-white/40">9:16 VERTICAL ASPECT</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="w-36 h-48 border-2 border-dashed border-cyan-400 relative flex items-center justify-center">
          <span className="text-xs font-black text-cyan-300 bg-black px-2">{widthPx} × {heightPx} px</span>
          <div className="absolute -top-3 text-[10px] text-cyan-400">↔ {widthPx}px</div>
          <div className="absolute -right-12 text-[10px] text-cyan-400 rotate-90">↕ {heightPx}px</div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>RESOLUTION: FHD VERTICAL</span>
        <span>PIXEL RATIO: 1:1 SQUARE</span>
      </div>
    </div>
  );
};
