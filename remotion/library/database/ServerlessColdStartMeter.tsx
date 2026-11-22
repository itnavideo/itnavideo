import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ServerlessColdStartMeterProps {
  coldStartLatencyMs?: number;
  warmLatencyMs?: number;
  pauseAfterInactivityMin?: number;
  className?: string;
}

export const ServerlessColdStartMeter: React.FC<ServerlessColdStartMeterProps> = ({
  coldStartLatencyMs = 650,
  warmLatencyMs = 2.4,
  pauseAfterInactivityMin = 10,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            SERVERLESS COLD START LATENCY
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Pause: {pauseAfterInactivityMin}m
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="text-[10px] text-amber-400 uppercase">Cold Wakeup (From Sleep)</div>
          <div className="text-white font-bold text-lg mt-1">{coldStartLatencyMs} ms</div>
          <div className="text-[10px] text-zinc-500">Includes VM attach + cache warm</div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="text-[10px] text-emerald-400 uppercase">Warm Execution</div>
          <div className="text-emerald-300 font-bold text-lg mt-1">{warmLatencyMs} ms</div>
          <div className="text-[10px] text-zinc-500">Instant pooled execution</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Optimization: Keepwarm scheduler or provisioned minimum ACU</span>
      </div>
    </div>
  );
};
