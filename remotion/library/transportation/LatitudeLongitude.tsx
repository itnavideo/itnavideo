import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface LatitudeLongitudeProps {
  latitude?: string;
  longitude?: string;
  elevation?: string;
  utcTime?: string;
  satelliteCount?: number;
  className?: string;
}

export const LatitudeLongitude: React.FC<LatitudeLongitudeProps> = ({
  latitude = '40°42\'46"N',
  longitude = '74°00\'22"W',
  elevation = '10M MSL',
  utcTime = '12:15:32 UTC',
  satelliteCount = 12,
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
      className={`relative inline-flex flex-col bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 shadow-xl backdrop-blur-md font-mono text-xs select-none ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-2 mb-2">
        <span className="text-emerald-400 font-bold">● GPS FIX 3D</span>
        <span>{utcTime}</span>
      </div>

      <div className="space-y-1 text-zinc-100 font-bold tracking-wider">
        <div>LAT: {latitude}</div>
        <div>LON: {longitude}</div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80 mt-2">
        <span>ELEV: {elevation}</span>
        <span className="text-amber-400 font-semibold">{satelliteCount} SATELLITES</span>
      </div>
    </div>
  );
};
