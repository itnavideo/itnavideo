import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FlightPathProps {
  flightNumber?: string;
  origin?: string;
  destination?: string;
  altitude?: string;
  groundSpeed?: string;
  eta?: string;
  className?: string;
}

export const FlightPath: React.FC<FlightPathProps> = ({
  flightNumber = 'ITNA-AIR 408',
  origin = 'SAN FRANCISCO (SFO)',
  destination = 'TOKYO (NRT)',
  altitude = 'FL380 (38,000 FT)',
  groundSpeed = '540 KTS (1,000 KM/H)',
  eta = '04H 25M REMAINING',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const progress = interpolate(frame, [0, fps * 6], [10, 85], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      {/* Flight Telemetry Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            IN-FLIGHT AVIONICS
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {flightNumber} • {origin} ➔ {destination}
          </h3>
        </div>
        <span className="text-xs font-mono text-amber-400 font-bold">{eta}</span>
      </div>

      {/* Flight Trajectory Canvas */}
      <div className="relative w-full aspect-[16/7] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6 flex items-center">
        {/* Curving Flight Path SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 60 140 Q 350 30 640 140"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="6 3"
            style={{ filter: 'drop-shadow(0 0 8px #38bdf8)' }}
          />
        </svg>

        {/* Origin Pin */}
        <div className="absolute left-[8%] bottom-6 text-center">
          <div className="w-3.5 h-3.5 rounded-full bg-sky-400 border-2 border-white mx-auto shadow" />
          <span className="text-[10px] font-mono text-zinc-300 font-bold mt-1 block">SFO</span>
        </div>

        {/* In-Flight Jet Icon Moving along Curve */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${progress}%`,
            top: `${interpolate(progress, [10, 50, 85], [60, 25, 60])}%`,
          }}
        >
          <div className="w-8 h-8 rounded-full bg-sky-500 shadow-[0_0_15px_#38bdf8] flex items-center justify-center text-white text-xs">
            ✈
          </div>
        </div>

        {/* Destination Pin */}
        <div className="absolute right-[8%] bottom-6 text-center">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white mx-auto shadow" />
          <span className="text-[10px] font-mono text-zinc-300 font-bold mt-1 block">NRT</span>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mt-4 px-2">
        <span>ALT: {altitude}</span>
        <span>SPD: {groundSpeed}</span>
      </div>
    </div>
  );
};
