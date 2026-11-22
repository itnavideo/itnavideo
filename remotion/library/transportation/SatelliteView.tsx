import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface SatelliteViewProps {
  imageSrc?: string;
  targetLocation?: string;
  zoomLevel?: string;
  cloudDrift?: boolean;
  className?: string;
}

export const SatelliteView: React.FC<SatelliteViewProps> = ({
  imageSrc = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&q=80',
  targetLocation = 'ORBITAL SATELLITE RECON — SECTOR 7',
  zoomLevel = '10M OPTICAL RESOLUTION',
  cloudDrift = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const driftX = cloudDrift ? interpolate(frame, [0, fps * 10], [0, 20]) : 0;

  return (
    <div
      className={`relative w-full max-w-4xl aspect-[16/9] bg-black border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden select-none ${className}`}
    >
      {/* Background Satellite Imagery */}
      <img
        src={imageSrc}
        alt={targetLocation}
        className="w-full h-full object-cover filter contrast-115 brightness-90"
      />

      {/* Crosshair Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-24 h-24 border border-emerald-400/60 rounded-full" />
        <div className="absolute w-full h-[1px] bg-emerald-400/30" />
        <div className="absolute h-full w-[1px] bg-emerald-400/30" />
      </div>

      {/* Top Telemetry Header */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between text-xs font-mono text-emerald-400 bg-zinc-950/80 px-4 py-2 rounded-lg border border-zinc-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold">{targetLocation}</span>
        </div>
        <span>{zoomLevel}</span>
      </div>
    </div>
  );
};
