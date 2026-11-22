import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface RouteLeg {
  name: string;
  origin: string;
  destination: string;
  mode: 'air' | 'sea';
  color: string;
}

export interface GlobalTransitMapProps {
  title?: string;
  legs?: RouteLeg[];
  className?: string;
}

const DEFAULT_LEGS: RouteLeg[] = [
  { name: 'Trans-Pacific Air Corridor', origin: 'Los Angeles (LAX)', destination: 'Tokyo (NRT)', mode: 'air', color: '#38bdf8' },
  { name: 'Suez Maritime Trade Lane', origin: 'Rotterdam', destination: 'Singapore', mode: 'sea', color: '#10b981' },
  { name: 'North Atlantic Route', origin: 'New York (JFK)', destination: 'Frankfurt (FRA)', mode: 'air', color: '#f59e0b' },
];

export const GlobalTransitMap: React.FC<GlobalTransitMapProps> = ({
  title = 'INTERCONTINENTAL FREIGHT & LOGISTICS MAP',
  legs = DEFAULT_LEGS,
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            GLOBAL TRANSIT
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">{legs.length} MAJOR TRUNKS</span>
      </div>

      {/* Stylized World Map Grid Canvas */}
      <div className="relative w-full aspect-[16/8] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-4">
        {/* Topographic Map Dots Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />

        {/* Global Route Arcs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path
            d="M 220 80 Q 400 40 580 90"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
          />
          <path
            d="M 450 70 Q 520 120 620 150"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
          />
        </svg>

        {/* Overlay Waypoint Badges */}
        <div className="absolute left-[20%] top-[35%] bg-zinc-950 border border-sky-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-sky-400 shadow">
          LAX
        </div>
        <div className="absolute left-[45%] top-[28%] bg-zinc-950 border border-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-400 shadow">
          RTM
        </div>
        <div className="absolute left-[80%] top-[40%] bg-zinc-950 border border-amber-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-amber-400 shadow">
          TYO
        </div>
      </div>

      {/* Legend Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {legs.map((leg, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs font-mono">
            <div className="font-bold text-zinc-200 truncate">{leg.name}</div>
            <div className="text-[10px] text-zinc-500 mt-1 truncate">
              {leg.origin} ➔ {leg.destination}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
