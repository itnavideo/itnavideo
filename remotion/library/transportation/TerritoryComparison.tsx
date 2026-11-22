import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface TerritoryItem {
  name: string;
  areaKm2: string;
  population: string;
  color: string;
}

export interface TerritoryComparisonProps {
  title?: string;
  territoryA?: TerritoryItem;
  territoryB?: TerritoryItem;
  className?: string;
}

const DEFAULT_A: TerritoryItem = {
  name: 'UNITED KINGDOM',
  areaKm2: '242,495 KM²',
  population: '67.3 MILLION',
  color: '#38bdf8',
};

const DEFAULT_B: TerritoryItem = {
  name: 'NEW ZEALAND',
  areaKm2: '268,021 KM²',
  population: '5.1 MILLION',
  color: '#10b981',
};

export const TerritoryComparison: React.FC<TerritoryComparisonProps> = ({
  title = 'LANDMASS & POPULATION SCALE COMPARISON',
  territoryA = DEFAULT_A,
  territoryB = DEFAULT_B,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            GEOGRAPHIC COMPARISON
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Territory A */}
        <div
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg"
          style={{ borderLeftColor: territoryA.color, borderLeftWidth: '4px' }}
        >
          <h4 className="text-base font-serif font-black text-zinc-100 uppercase mb-3">
            {territoryA.name}
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">SURFACE AREA</span>
              <span className="text-zinc-200 font-bold">{territoryA.areaKm2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">POPULATION</span>
              <span className="text-amber-400 font-bold">{territoryA.population}</span>
            </div>
          </div>
        </div>

        {/* Territory B */}
        <div
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg"
          style={{ borderLeftColor: territoryB.color, borderLeftWidth: '4px' }}
        >
          <h4 className="text-base font-serif font-black text-zinc-100 uppercase mb-3">
            {territoryB.name}
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">SURFACE AREA</span>
              <span className="text-zinc-200 font-bold">{territoryB.areaKm2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">POPULATION</span>
              <span className="text-amber-400 font-bold">{territoryB.population}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
