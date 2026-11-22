import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TectonicPlatesProps {
  plateA?: string;
  plateB?: string;
  boundaryType?: string;
  magnitude?: string;
  className?: string;
}

export const TectonicPlates: React.FC<TectonicPlatesProps> = ({
  plateA = 'PACIFIC PLATE',
  plateB = 'NORTH AMERICAN PLATE',
  boundaryType = 'CONVERGENT SUBDUCTION ZONE',
  magnitude = 'M 7.2 SEISMIC RISK',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const shift = Math.sin(frame * 0.1) * 3;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-rose-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(18, 12, 10, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(244, 63, 94, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">
            TECTONIC CRUST DYNAMICS
          </span>
          <span className="text-zinc-500 text-[10px]">{boundaryType}</span>
        </div>

        {/* Tectonic Cross Section Graphic */}
        <div className="h-32 my-3 rounded-xl bg-zinc-950 border border-white/10 p-3 relative flex items-center justify-between overflow-hidden">
          {/* Left Plate Block */}
          <div
            className="w-36 h-20 rounded bg-amber-900/60 border border-amber-600/40 p-2 flex flex-col justify-between transition-transform"
            style={{ transform: `translateX(${shift}px)` }}
          >
            <span className="text-[10px] font-bold text-amber-200">{plateA}</span>
            <span className="text-[9px] text-zinc-400">Continental Crust →</span>
          </div>

          {/* Fault Line Shockwave */}
          <div className="w-1 h-full bg-rose-500 shadow-[0_0_12px_#f43f5e] relative flex items-center justify-center">
            <span className="w-4 h-4 rounded-full border border-rose-400 animate-ping absolute" />
          </div>

          {/* Right Subducting Plate Block */}
          <div
            className="w-36 h-20 rounded bg-sky-900/60 border border-sky-600/40 p-2 flex flex-col justify-between transition-transform"
            style={{ transform: `translateY(8px) translateX(${-shift}px)` }}
          >
            <span className="text-[10px] font-bold text-sky-200">{plateB}</span>
            <span className="text-[9px] text-zinc-400">← Oceanic Trench</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <span className="text-rose-400 font-bold">{magnitude}</span>
          <span className="text-zinc-400 text-[10px]">Velocity: 4.5 cm/yr</span>
        </div>
      </div>
    </div>
  );
};
