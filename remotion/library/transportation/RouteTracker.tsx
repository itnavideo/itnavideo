import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RouteTrackerProps {
  orderId?: string;
  origin?: string;
  destination?: string;
  carrier?: string;
  progressPercent?: number; // 0 to 100
  className?: string;
}

export const RouteTracker: React.FC<RouteTrackerProps> = ({
  orderId = 'TRACKING #TR-8849-NY',
  origin = 'Warehouse Fulfillment Center (Newark)',
  destination = 'Recipient Address (Manhattan)',
  carrier = 'ITNA EXPRESS SAME-DAY',
  progressPercent = 68,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const animatedPercent = interpolate(frame, [0, fps * 3], [0, progressPercent], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={`relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 text-xs font-mono">
        <span className="text-sky-400 font-bold">{orderId}</span>
        <span className="text-emerald-400 font-bold">● IN TRANSIT</span>
      </div>

      {/* Progress Track */}
      <div className="relative h-3 bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all"
          style={{ width: `${animatedPercent}%` }}
        />
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div className="flex items-start gap-2 text-zinc-400">
          <span className="text-zinc-600">FROM:</span>
          <span className="text-zinc-200 font-semibold truncate">{origin}</span>
        </div>
        <div className="flex items-start gap-2 text-zinc-400">
          <span className="text-zinc-600">TO:</span>
          <span className="text-zinc-200 font-semibold truncate">{destination}</span>
        </div>
      </div>
    </div>
  );
};
