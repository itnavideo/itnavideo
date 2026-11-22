import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EventSourcingAppendLogProps {
  streamName?: string;
  currentOffset?: number;
  consumerGroupsCount?: number;
  className?: string;
}

export const EventSourcingAppendLog: React.FC<EventSourcingAppendLogProps> = ({
  streamName = "orders.checkout.events.v1",
  currentOffset = 4892014,
  consumerGroupsCount = 6,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            EVENT SOURCING APPEND-ONLY LOG
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Immutable Stream
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Stream Topic</div>
        <code className="text-emerald-300 font-bold">{streamName}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Head Offset</div>
          <div className="text-white font-bold text-sm mt-0.5">{currentOffset.toLocaleString()}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Consumer Groups</div>
          <div className="text-sky-400 font-bold text-sm mt-0.5">{consumerGroupsCount} Active Consumers</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>State Reconstructable From Zero via Event Replay</span>
      </div>
    </div>
  );
};
