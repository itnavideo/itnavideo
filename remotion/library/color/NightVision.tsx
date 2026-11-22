import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NightVisionProps {
  phosphorType?: 'P43 Green' | 'White Phosphor';
  gain?: number;
  showReticule?: boolean;
  className?: string;
}

export const NightVision: React.FC<NightVisionProps> = ({
  phosphorType = 'P43 Green',
  gain = 85,
  showReticule = true,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono overflow-hidden " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          GEN-3 NIGHT VISION (NVG)
        </span>
        <span className="text-emerald-400 font-bold">{phosphorType}</span>
      </div>

      <div className="flex-1 my-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 relative overflow-hidden flex items-center justify-center p-4">
        {/* Binocular circle mask preview */}
        <div className="w-48 h-48 rounded-full border-4 border-emerald-500/60 bg-emerald-900/30 flex items-center justify-center relative">
          {showReticule && (
            <div className="text-emerald-400 font-mono text-[10px] text-center">
              + RETICULE ACTIVE +<br />
              <span className="text-[9px] text-emerald-300/60">IR ILLUMINATOR ON</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-emerald-400/60 flex justify-between z-10">
        <span>PHOTOMULTIPLIER GAIN: {gain}%</span>
        <span>BATTERY: 94%</span>
      </div>
    </div>
  );
};
