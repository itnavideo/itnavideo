import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ConnectionPoolSaturationProps {
  activeConnections?: number;
  idleConnections?: number;
  waitingQueue?: number;
  maxConnections?: number;
  poolManager?: string;
  className?: string;
}

export const ConnectionPoolSaturation: React.FC<ConnectionPoolSaturationProps> = ({
  activeConnections = 92,
  idleConnections = 8,
  waitingQueue = 14,
  maxConnections = 100,
  poolManager = "PgBouncer / Transaction Mode",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const saturation = (activeConnections / maxConnections) * 100;
  const animSat = interpolate(frame, [0, 40], [0, saturation], { extrapolateRight: 'clamp' });
  const isNearLimit = animSat > 85;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isNearLimit ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            CONNECTION POOL SATURATION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {poolManager}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-white">{activeConnections}</span>
          <span className="text-xs text-zinc-400 ml-1">/ {maxConnections} Max Connections</span>
        </div>
        <span className={`text-sm font-bold ${isNearLimit ? 'text-amber-400' : 'text-emerald-400'}`}>
          {animSat.toFixed(1)}% Full
        </span>
      </div>

      <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden flex mb-4">
        <div
          className={`h-full ${isNearLimit ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${animSat}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Active</div>
          <div className="text-amber-400 font-bold text-sm mt-0.5">{activeConnections}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Idle</div>
          <div className="text-zinc-400 font-bold text-sm mt-0.5">{idleConnections}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20">
          <div className="text-[10px] text-zinc-400 uppercase">Waiting Queue</div>
          <div className="text-red-400 font-bold text-sm mt-0.5">{waitingQueue} clients</div>
        </div>
      </div>
    </div>
  );
};
