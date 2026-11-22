import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FlightArc {
  from: string;
  to: string;
  color?: string;
}

export interface TransportGlobeProps {
  title?: string;
  size?: number;
  arcs?: FlightArc[];
  className?: string;
}

const DEFAULT_ARCS: FlightArc[] = [
  { from: 'NYC (JFK)', to: 'LONDON (LHR)', color: '#38bdf8' },
  { from: 'LONDON (LHR)', to: 'DUBAI (DXB)', color: '#10b981' },
  { from: 'DUBAI (DXB)', to: 'TOKYO (HND)', color: '#f59e0b' },
];

export const TransportGlobe: React.FC<TransportGlobeProps> = ({
  title = 'GLOBAL TRANSIT AIRLINES NETWORK',
  size = 360,
  arcs = DEFAULT_ARCS,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const pulse = 1 + Math.sin(frame * 0.15) * 0.05;

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            3D SPHERICAL PROJECTION
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold">● ACTIVE HUBS</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Globe Visualization */}
        <div
          className="relative rounded-full flex items-center justify-center border border-zinc-700/80 shadow-2xl"
          style={{
            width: size,
            height: size,
            backgroundColor: '#090d16',
            boxShadow: 'inset 0 0 50px rgba(56,189,248,0.2), 0 0 30px rgba(0,0,0,0.8)',
          }}
        >
          {/* Animated 3D Arcs */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            {/* Latitude Circles */}
            <circle cx={size / 2} cy={size / 2} r={size * 0.42} fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx={size / 2} cy={size / 2} r={size * 0.28} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 2" />

            {/* Flight Bezier Arcs */}
            <path
              d={`M ${size * 0.25} ${size * 0.45} Q ${size * 0.45} ${size * 0.15} ${size * 0.55} ${size * 0.35}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
            />
            <path
              d={`M ${size * 0.55} ${size * 0.35} Q ${size * 0.65} ${size * 0.25} ${size * 0.72} ${size * 0.52}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
            />

            {/* Hub Pin Dots */}
            <circle cx={size * 0.25} cy={size * 0.45} r="4" fill="#38bdf8" />
            <circle cx={size * 0.55} cy={size * 0.35} r="4" fill="#10b981" />
            <circle cx={size * 0.72} cy={size * 0.52} r="4" fill="#f59e0b" />
          </svg>
        </div>

        {/* Flight Legs List */}
        <div className="flex-1 space-y-3 w-full">
          {arcs.map((arc, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between"
              style={{ borderLeftColor: arc.color || '#38bdf8', borderLeftWidth: '4px' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-mono text-xs">✈</span>
                <span className="text-xs font-mono font-bold text-zinc-100">
                  {arc.from} ➔ {arc.to}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                SCHEDULED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
