import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface CityLandmark {
  name: string;
  x: number; // %
  y: number; // %
}

export interface CityMapProps {
  cityName?: string;
  country?: string;
  landmarks?: CityLandmark[];
  className?: string;
}

const DEFAULT_LANDMARKS: CityLandmark[] = [
  { name: 'Financial District', x: 45, y: 35 },
  { name: 'Central Grand Station', x: 55, y: 55 },
  { name: 'Waterfront Harbor', x: 25, y: 70 },
];

export const CityMap: React.FC<CityMapProps> = ({
  cityName = 'NEW YORK CITY (MANHATTAN)',
  country = 'NEW YORK, USA',
  landmarks = DEFAULT_LANDMARKS,
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
            URBAN METROPOLITAN GRID
          </div>
          <h3 className="text-base sm:text-2xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {cityName}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">{country}</span>
      </div>

      {/* Urban Grid Canvas with River Vector */}
      <div className="relative w-full aspect-[16/9] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-4">
        {/* Street Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-35" />

        {/* Winding River Curve */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 120 0 Q 150 120 100 240 Q 60 300 80 400"
            fill="none"
            stroke="#0284c7"
            strokeWidth="28"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Landmarks */}
        {landmarks.map((l, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 bg-zinc-950/90 border border-sky-400/80 px-2.5 py-1 rounded shadow-lg"
              style={{
                left: `${l.x}%`,
                top: `${l.y}%`,
                transform: `translate(-50%, -50%) scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-zinc-100 uppercase whitespace-nowrap">
                {l.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
