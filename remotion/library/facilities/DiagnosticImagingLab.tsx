import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DiagnosticImagingLabProps {
  modality?: string;
  fieldStrength?: string;
  scheduledScans?: number;
  className?: string;
}

export const DiagnosticImagingLab: React.FC<DiagnosticImagingLabProps> = ({
  modality = '3.0T High-Resolution MRI Scanner',
  fieldStrength = '3.0 Tesla Superconducting',
  scheduledScans = 18,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          RADIOLOGY & ADVANCED IMAGING
        </span>
        <span className="text-white/40">RF SHIELDED ROOM</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">{modality}</div>
            <div className="text-xs text-cyan-300 font-mono mt-0.5">{fieldStrength}</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-700">
            MAGNET ON
          </span>
        </div>

        <div className="p-3 bg-zinc-950 rounded-lg border border-white/10 flex items-center justify-around my-2 text-center">
          <div>
            <div className="text-[10px] text-white/40 font-mono">BORE DIAMETER</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">70 cm Wide</div>
          </div>
          <div className="text-white/20">|</div>
          <div>
            <div className="text-[10px] text-white/40 font-mono">HELIUM LEVEL</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">98.4% Normal</div>
          </div>
          <div className="text-white/20">|</div>
          <div>
            <div className="text-[10px] text-white/40 font-mono">TODAY SCANS</div>
            <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">{scheduledScans} Booked</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>CONTROL CONSOLE: DICOM PACS LINKED</span>
          <span className="text-emerald-400 font-mono">FERROUS METAL DETECTOR: ACTIVE</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ACOUSTIC DAMPING: 32 dB</span>
        <span>EMERGENCY QUENCH READY</span>
      </div>
    </div>
  );
};
