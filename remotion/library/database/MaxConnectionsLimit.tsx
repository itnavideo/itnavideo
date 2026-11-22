import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MaxConnectionsLimitProps {
  currentConnections?: number;
  maxConnections?: number;
  rejectedConnections?: number;
  reservedSuperuser?: number;
  className?: string;
}

export const MaxConnectionsLimit: React.FC<MaxConnectionsLimitProps> = ({
  currentConnections = 478,
  maxConnections = 500,
  rejectedConnections = 0,
  reservedSuperuser = 10,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const percent = (currentConnections / maxConnections) * 100;
  const animPercent = interpolate(frame, [0, 40], [0, percent], { extrapolateRight: 'clamp' });
  const isCritical = animPercent > 90;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            MAX CONNECTIONS CEILING
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Max: {maxConnections}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-white">{currentConnections}</span>
          <span className="text-xs text-zinc-400 ml-1">/ {maxConnections} Connected</span>
        </div>
        <span className={`text-sm font-bold ${isCritical ? 'text-amber-400' : 'text-emerald-400'}`}>
          {animPercent.toFixed(1)}% Full
        </span>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full ${isCritical ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${animPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Connection Headroom</div>
          <div className="text-white font-bold text-base mt-1">{maxConnections - currentConnections} slots</div>
          <div className="text-[10px] text-zinc-500">Available client slots</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Reserved Superuser</div>
          <div className="text-sky-400 font-bold text-base mt-1">{reservedSuperuser} slots</div>
          <div className="text-[10px] text-zinc-500">Emergency DBA access</div>
        </div>
      </div>
    </div>
  );
};
