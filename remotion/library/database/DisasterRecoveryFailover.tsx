import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DisasterRecoveryFailoverProps {
  primaryRegion?: string;
  standbyRegion?: string;
  failoverDurationSec?: number;
  dnsPropagationSec?: number;
  failoverState?: string;
  className?: string;
}

export const DisasterRecoveryFailover: React.FC<DisasterRecoveryFailoverProps> = ({
  primaryRegion = "us-east-1 (Outage Detected)",
  standbyRegion = "us-west-2 (Promoted Primary)",
  failoverDurationSec = 18.4,
  dnsPropagationSec = 4.2,
  failoverState = "FAILOVER COMPLETE — TRAFFIC ROUTED",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/40 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            CROSS-REGION DR FAILOVER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          {failoverState}
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-red-400 uppercase">Failed Primary</div>
            <div className="text-white font-bold mt-0.5">{primaryRegion}</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-red-900/60 text-red-200 font-bold">DOWN</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-emerald-400 uppercase">Promoted Standby</div>
            <div className="text-emerald-300 font-bold mt-0.5">{standbyRegion}</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-emerald-900/60 text-emerald-200 font-bold">ACTIVE PRIMARY</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Standby Promotion</div>
          <div className="text-emerald-400 font-bold text-sm mt-0.5">{failoverDurationSec}s</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Global Anycast DNS Route</div>
          <div className="text-sky-400 font-bold text-sm mt-0.5">{dnsPropagationSec}s</div>
        </div>
      </div>
    </div>
  );
};
