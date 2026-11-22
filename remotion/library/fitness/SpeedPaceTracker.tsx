import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SpeedPaceTrackerProps {
  pace?: string;
  speedKmh?: number;
  distanceKm?: number;
  elevationGainM?: number;
  activity?: 'RUNNING' | 'CYCLING' | 'ROWING';
  className?: string;
}

export const SpeedPaceTracker: React.FC<SpeedPaceTrackerProps> = ({
  pace = "4'32\"",
  speedKmh = 13.2,
  distanceKm = 8.45,
  elevationGainM = 142,
  activity = 'RUNNING',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const distFill = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 80 } });

  const animatedDistance = (distanceKm * distFill).toFixed(2);

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 16, 22, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(6, 182, 212, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
            {activity} GPS TRACKER
          </span>
          <span className="text-zinc-400 text-[11px]">⛰ +{elevationGainM}m elevation</span>
        </div>

        {/* Big Distance & Pace Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          {/* Distance */}
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase font-bold">DISTANCE</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{animatedDistance}</span>
              <span className="text-zinc-400 text-xs font-bold">KM</span>
            </div>
          </div>

          {/* Average Pace */}
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase font-bold">AVG PACE</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-cyan-400">{pace}</span>
              <span className="text-zinc-400 text-xs font-bold">/KM</span>
            </div>
          </div>
        </div>

        {/* Speed Bar */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span>Speed: <strong className="text-white">{speedKmh} km/h</strong></span>
          <span className="text-emerald-400 font-bold">● GPS LOCKED</span>
        </div>
      </div>
    </div>
  );
};
