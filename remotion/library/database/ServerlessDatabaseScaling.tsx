import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ServerlessDatabaseScalingProps {
  currentACU?: number;
  minACU?: number;
  maxACU?: number;
  cpuUtilizationPercent?: number;
  className?: string;
}

export const ServerlessDatabaseScaling: React.FC<ServerlessDatabaseScalingProps> = ({
  currentACU = 16.0,
  minACU = 0.5,
  maxACU = 64.0,
  cpuUtilizationPercent = 74.2,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animACU = interpolate(frame, [0, 45], [minACU, currentACU], { extrapolateRight: 'clamp' });
  const progress = ((animACU - minACU) / (maxACU - minACU)) * 100;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            SERVERLESS AUTO-SCALING (ACU)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          ZERO-DOWNTIME SCALE
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-sky-400">{animACU.toFixed(1)}</span>
          <span className="text-xs text-zinc-400 ml-2">Active ACUs (~{(animACU * 2).toFixed(0)} GB RAM)</span>
        </div>
        <span className="text-xs text-zinc-400">Scale Range: {minACU} - {maxACU} ACUs</span>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">CPU Trigger</div>
          <div className="text-white font-bold text-base mt-1">{cpuUtilizationPercent}% Load</div>
          <div className="text-[10px] text-zinc-500">Auto-scaled up in 450ms</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Billing Impact</div>
          <div className="text-emerald-400 font-bold text-base mt-1">Scale-to-Zero Ready</div>
          <div className="text-[10px] text-zinc-500">Pay only when queried</div>
        </div>
      </div>
    </div>
  );
};
