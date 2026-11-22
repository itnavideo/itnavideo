import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ExposureControlProps {
  evStops?: number; // -3 to +3
  showZebra?: boolean;
  className?: string;
}

export const ExposureControl: React.FC<ExposureControlProps> = ({
  evStops = 0.65,
  showZebra = true,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          EXPOSURE COMPENSATION
        </span>
        <span className="text-white/40">STOP METER</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="text-5xl font-black text-yellow-400 mb-1">
          {evStops > 0 ? ('+' + evStops.toFixed(2)) : evStops.toFixed(2)} EV
        </div>
        <div className="text-xs text-white/50">Photographic Exposure Stops</div>
        {showZebra && (
          <div className="mt-3 px-3 py-1 rounded bg-yellow-950/80 border border-yellow-500/40 text-[10px] text-yellow-300">
            ZEBRA STRIPES: 100% IRE CLIPPING GUARD
          </div>
        )}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ISO: 800 BASE</span>
        <span>SHUTTER: 180°</span>
      </div>
    </div>
  );
};
