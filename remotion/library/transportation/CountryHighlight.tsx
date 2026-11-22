import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface CountryHighlightProps {
  countryName?: string;
  capitalCity?: string;
  population?: string;
  areaKm2?: string;
  currency?: string;
  highlightColor?: string;
  className?: string;
}

export const CountryHighlight: React.FC<CountryHighlightProps> = ({
  countryName = 'JAPAN (日本)',
  capitalCity = 'TOKYO',
  population = '125.1 MILLION',
  areaKm2 = '377,975 KM²',
  currency = 'JPY (¥)',
  highlightColor = '#ef4444',
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
          <div className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-bold">
            SOVEREIGN TERRITORY PROFILE
          </div>
          <h3 className="text-base sm:text-2xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {countryName}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">CAPITAL: {capitalCity}</span>
      </div>

      {/* Silhouette Graphic & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Country Island Arc SVG Map */}
        <div className="relative aspect-[4/3] bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-center p-4">
          <svg viewBox="0 0 300 240" className="w-full h-full">
            {/* Stylized Archipelagic Polygon Chain */}
            <path
              d="M 60 170 Q 110 130 160 110 T 220 50 Q 240 30 250 40 T 230 70 Q 180 120 130 150 Z"
              fill={highlightColor}
              fillOpacity="0.35"
              stroke={highlightColor}
              strokeWidth="2.5"
              filter="drop-shadow(0 0 10px rgba(239,68,68,0.4))"
            />
            {/* Capital Star */}
            <circle cx="180" cy="100" r="5" fill="#ffffff" stroke={highlightColor} strokeWidth="2" />
            <text x="190" y="104" fill="#ffffff" className="text-[10px] font-mono font-black uppercase">
              {capitalCity}
            </text>
          </svg>
        </div>

        {/* Demographic Data Cards */}
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between">
            <span className="text-zinc-500">TOTAL POPULATION</span>
            <span className="text-zinc-100 font-bold">{population}</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between">
            <span className="text-zinc-500">SURFACE AREA</span>
            <span className="text-zinc-100 font-bold">{areaKm2}</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between">
            <span className="text-zinc-500">CURRENCY</span>
            <span className="text-amber-400 font-bold">{currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
