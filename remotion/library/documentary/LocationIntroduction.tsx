import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LocationIntroductionProps {
  cityName?: string;
  country?: string;
  coordinates?: string;
  elevation?: string;
  localTime?: string;
  classification?: string; // e.g. "RESTRICTED AIRSPACE"
  className?: string;
}

export const LocationIntroduction: React.FC<LocationIntroductionProps> = ({
  cityName = 'GENEVA',
  country = 'SWITZERLAND',
  coordinates = '46°12\'15"N 06°08\'55"E',
  elevation = 'ELEV 375M',
  localTime = '02:45 CET',
  classification = 'DIPLOMATIC ENCLAVE',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 90 },
  });

  const blink = Math.sin(frame * 0.25) > 0;

  return (
    <div
      className={`relative inline-flex flex-col bg-zinc-950/90 border border-zinc-800 backdrop-blur-md rounded-xl p-5 shadow-2xl max-w-md ${className}`}
      style={{
        transform: `translateY(${interpolate(entry, [0, 1], [25, 0])}px)`,
        opacity: entry,
      }}
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-500 border-b border-zinc-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              blink ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-900'
            }`}
          />
          <span className="text-red-400 font-semibold">{classification}</span>
        </div>
        <span>{localTime}</span>
      </div>

      {/* Main City & Region Headline */}
      <div className="mb-3">
        <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-widest text-zinc-100 uppercase">
          {cityName}
        </h3>
        <p className="text-xs font-mono tracking-wider text-amber-500 uppercase mt-0.5">
          {country}
        </p>
      </div>

      {/* Coordinates & Technical Grid */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-900/80 rounded-lg px-3 py-2 border border-zinc-800/80">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{coordinates}</span>
        </div>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-500">{elevation}</span>
      </div>
    </div>
  );
};
