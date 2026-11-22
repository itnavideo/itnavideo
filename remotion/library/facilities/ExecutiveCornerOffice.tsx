import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ExecutiveCornerOfficeProps {
  floorNumber?: number;
  occupantTitle?: string;
  viewOrientation?: string;
  className?: string;
}

export const ExecutiveCornerOffice: React.FC<ExecutiveCornerOfficeProps> = ({
  floorNumber = 68,
  occupantTitle = 'Chief Strategy Officer Suite',
  viewOrientation = 'North-East Skyline & Bay View',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          EXECUTIVE CORNER OFFICE
        </span>
        <span className="text-white/40">LEVEL {floorNumber}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="text-base font-bold text-white">{occupantTitle}</div>
          <div className="text-xs text-amber-300 font-mono mt-0.5">{viewOrientation}</div>
        </div>

        <div className="space-y-2 my-2 bg-zinc-950 p-3 rounded-lg border border-white/5 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">Desk Furnishing:</span>
            <span className="text-white">Custom Walnut & Steel Desk</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Acoustic Rating:</span>
            <span className="text-amber-400 font-mono">STC 55 Soundproof Glazing</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Private Lounge:</span>
            <span className="text-emerald-400 font-mono">Espresso Bar & Library Included</span>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>SMART GLASS PRIVACY TOGGLE: READY</span>
          <span className="text-amber-400 font-mono">EXECUTIVE SECURE ACCESS</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>BIOMETRIC ENTRANCE SENSOR</span>
        <span>CLIMATE ZONE: DUAL INDEPENDENT</span>
      </div>
    </div>
  );
};
