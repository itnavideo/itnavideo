import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WaterCycleDiagramProps {
  className?: string;
}

export const WaterCycleDiagram: React.FC<WaterCycleDiagramProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Floating arrows motion
  const evapY = -((frame * 1.5) % 30);
  const rainY = (frame * 2) % 30;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-sky-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 16, 24, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(14, 165, 233, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-sky-400 font-bold uppercase tracking-wider text-[10px]">
            HYDROLOGICAL WATER CYCLE
          </span>
          <span className="text-zinc-500 text-[10px]">GLOBAL FLUX</span>
        </div>

        {/* Cycle Schematic Visual */}
        <div className="grid grid-cols-2 gap-3 my-3">
          {/* Evaporation */}
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col">
            <span className="text-[10px] text-amber-400 font-bold">1. EVAPORATION</span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-white">
              <span style={{ transform: `translateY(${evapY}px)` }}>↑</span>
              <span>Ocean Vapor Rise</span>
            </div>
          </div>

          {/* Condensation */}
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col">
            <span className="text-[10px] text-purple-400 font-bold">2. CONDENSATION</span>
            <span className="text-xs text-white mt-1">☁️ Cloud Nucleation</span>
          </div>

          {/* Precipitation */}
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex flex-col">
            <span className="text-[10px] text-sky-400 font-bold">3. PRECIPITATION</span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-white">
              <span style={{ transform: `translateY(${rainY}px)` }}>↓</span>
              <span>Rainfall & Snow</span>
            </div>
          </div>

          {/* Surface Runoff */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col">
            <span className="text-[10px] text-emerald-400 font-bold">4. SURFACE RUNOFF</span>
            <span className="text-xs text-white mt-1">🌊 Watershed Flow</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-400 text-center pt-2 border-t border-white/10">
          Conservation of Mass: Closed Earth Atmospheric System
        </div>
      </div>
    </div>
  );
};
