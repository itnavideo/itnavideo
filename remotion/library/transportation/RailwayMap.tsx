import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface RailwayStation {
  name: string;
  distance: string;
  stopType: 'origin' | 'station' | 'terminus';
}

export interface RailwayMapProps {
  corridorName?: string;
  speedKmh?: string;
  stations?: RailwayStation[];
  className?: string;
}

const DEFAULT_STATIONS: RailwayStation[] = [
  { name: 'Tokyo Central', distance: '0 KM', stopType: 'origin' },
  { name: 'Nagoya Station', distance: '342 KM', stopType: 'station' },
  { name: 'Kyoto Station', distance: '476 KM', stopType: 'station' },
  { name: 'Shin-Osaka', distance: '515 KM', stopType: 'terminus' },
];

export const RailwayMap: React.FC<RailwayMapProps> = ({
  corridorName = 'TOKAIDO SHINKANSEN BULLET TRAIN CORRIDOR',
  speedKmh = '285 KM/H (MAX OPERATING)',
  stations = DEFAULT_STATIONS,
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
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            HIGH-SPEED RAILWAY
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {corridorName}
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold">🚅 {speedKmh}</span>
      </div>

      {/* Railway Track Progression */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {stations.map((st, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mb-2 shadow-[0_0_8px_#34d399]" />
              <div className="text-xs font-serif font-bold text-zinc-100 uppercase">{st.name}</div>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 mt-3">{st.distance}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
