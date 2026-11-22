import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LocationCoordinatesProps {
  latitude?: string;
  longitude?: string;
  elevation?: string;
  heading?: string;
  sectorName?: string;
  crosshair?: boolean;
  className?: string;
}

export const LocationCoordinates: React.FC<LocationCoordinatesProps> = ({
  latitude = '37°14\'06"N',
  longitude = '115°48\'40"W',
  elevation = '1,360M MSL',
  heading = 'HDG 284°',
  sectorName = 'SECTOR 4 / GROOM LAKE',
  crosshair = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 90 },
  });

  const radarRotate = interpolate(frame, [0, fps * 6], [0, 360]);

  return (
    <div
      className={`relative inline-flex items-center gap-4 bg-zinc-950/85 border border-zinc-800 text-zinc-300 font-mono text-xs px-4 py-2.5 rounded-xl backdrop-blur-md shadow-2xl select-none ${className}`}
      style={{
        transform: `translateY(${interpolate(entry, [0, 1], [15, 0])}px)`,
        opacity: entry,
      }}
    >
      {/* Radar Crosshair Icon */}
      {crosshair && (
        <div className="relative w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center shrink-0">
          <div
            className="absolute inset-0 rounded-full border-t border-emerald-400"
            style={{ transform: `rotate(${radarRotate}deg)` }}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        </div>
      )}

      {/* Telemetry Readouts */}
      <div className="flex flex-col gap-0.5">
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
          {sectorName}
        </div>
        <div className="flex items-center gap-2 text-zinc-100 font-bold tracking-wider">
          <span>{latitude}</span>
          <span className="text-zinc-600">/</span>
          <span>{longitude}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400 border-l border-zinc-800 pl-3">
        <span>{elevation}</span>
        <span className="text-zinc-600">•</span>
        <span className="text-amber-500">{heading}</span>
      </div>
    </div>
  );
};
