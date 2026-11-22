import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface StateMapProps {
  stateName?: string;
  country?: string;
  capital?: string;
  majorCities?: string[];
  highwayCorridor?: string;
  className?: string;
}

export const StateMap: React.FC<StateMapProps> = ({
  stateName = 'CALIFORNIA',
  country = 'UNITED STATES',
  capital = 'SACRAMENTO',
  majorCities = ['SAN FRANCISCO', 'LOS ANGELES', 'SAN DIEGO'],
  highwayCorridor = 'INTERSTATE 5 / PACIFIC COAST HWY',
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
            REGIONAL PROVINCE / STATE
          </div>
          <h3 className="text-base sm:text-2xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {stateName}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">{country}</span>
      </div>

      {/* State Corridor Visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="relative aspect-[4/3] bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center justify-center">
          <svg viewBox="0 0 200 240" className="w-full h-full">
            {/* Stylized Coastal State Outline */}
            <path
              d="M 50 20 L 150 20 L 160 120 L 120 220 L 60 210 Q 50 120 50 20 Z"
              fill="#38bdf8"
              fillOpacity="0.25"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            {/* Highway Spine */}
            <path
              d="M 80 30 Q 100 120 90 200"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </svg>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <span className="text-zinc-500 text-[10px] uppercase">STATE CAPITAL</span>
            <div className="text-sm font-bold text-zinc-100 mt-0.5">{capital}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <span className="text-zinc-500 text-[10px] uppercase">MAIN HIGHWAYS</span>
            <div className="text-xs font-bold text-amber-400 mt-0.5">{highwayCorridor}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <span className="text-zinc-500 text-[10px] uppercase">KEY METROPOLITAN HUBS</span>
            <div className="text-xs text-zinc-300 mt-1 flex flex-wrap gap-1.5">
              {majorCities.map((c, i) => (
                <span key={i} className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
