import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface OperatingTheaterSuiteProps {
  orNumber?: string;
  surgicalSpecialty?: string;
  airChangesPerHour?: number;
  className?: string;
}

export const OperatingTheaterSuite: React.FC<OperatingTheaterSuiteProps> = ({
  orNumber = 'OR SUITE 06',
  surgicalSpecialty = 'Cardiothoracic & Vascular Surgery',
  airChangesPerHour = 24,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          STERILE SURGICAL THEATER
        </span>
        <span className="text-white/40">{orNumber}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">{surgicalSpecialty}</div>
            <div className="text-xs text-sky-400 font-mono">Positive Pressure Sterile Environment</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs border border-emerald-500/40">
            STERILITY: 100%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">HEPA VENTILATION</div>
            <div className="text-xs font-bold text-sky-400 mt-1">{airChangesPerHour} ACH Filtered</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">ANESTHESIA CART</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">Calibrated & Ready</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">LIGHTING ILLUMINANCE</div>
            <div className="text-xs font-bold text-white mt-1">160,000 Lux LED</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>SURGICAL SCRUB ACCESS: VERIFIED</span>
          <span className="text-sky-300 font-mono">TIME-OUT PROTOCOL COMPLETED</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TEMPERATURE: 19.5°C</span>
        <span>HUMIDITY: 45% (SPEC RATED)</span>
      </div>
    </div>
  );
};
