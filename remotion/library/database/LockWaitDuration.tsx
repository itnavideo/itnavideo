import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LockWaitDurationProps {
  waitingPid?: number;
  blockingPid?: number;
  lockType?: string;
  relation?: string;
  waitDurationSec?: number;
  className?: string;
}

export const LockWaitDuration: React.FC<LockWaitDurationProps> = ({
  waitingPid = 18420,
  blockingPid = 12095,
  lockType = "ExclusiveLock",
  relation = "public.orders",
  waitDurationSec = 14.8,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animWait = interpolate(frame, [0, 45], [0, waitDurationSec], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            LOCK CONTENTION DETECTED
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/20">
          BLOCKING
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-4 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-red-400">{animWait.toFixed(1)}s</span>
          <span className="text-xs text-zinc-400 ml-2">Lock Wait Duration</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-400">Relation</div>
          <div className="text-sm font-bold text-zinc-200">{relation}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 grid grid-cols-3 gap-2 font-mono text-xs">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase">Waiting Process</div>
          <div className="text-amber-400 font-bold mt-1">PID #{waitingPid}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-400 uppercase">Lock Mode</div>
          <div className="text-purple-400 font-bold mt-1">{lockType}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-400 uppercase">Blocking Process</div>
          <div className="text-red-400 font-bold mt-1">PID #{blockingPid}</div>
        </div>
      </div>
    </div>
  );
};
