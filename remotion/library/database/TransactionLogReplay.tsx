import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TransactionLogReplayProps {
  lastCheckpointLSN?: string;
  crashBoundaryLSN?: string;
  replayedRecordsCount?: number;
  replaySpeedRecordsSec?: number;
  className?: string;
}

export const TransactionLogReplay: React.FC<TransactionLogReplayProps> = ({
  lastCheckpointLSN = "0/14B9200",
  crashBoundaryLSN = "0/14C1800",
  replayedRecordsCount = 48500,
  replaySpeedRecordsSec = 12400,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const progress = interpolate(frame, [0, 45], [0, 100], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            TRANSACTION LOG REDO / UNDO REPLAY
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20 font-bold">
          CRASH RECOVERY
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2 font-mono">
        <div>
          <span className="text-3xl font-extrabold text-white">{replayedRecordsCount.toLocaleString()}</span>
          <span className="text-xs text-zinc-400 ml-1">WAL Records Replayed</span>
        </div>
        <span className="text-sm font-bold text-purple-400">{progress.toFixed(0)}% Done</span>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-emerald-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">From Checkpoint LSN</div>
          <div className="text-zinc-300 font-bold text-xs mt-0.5">{lastCheckpointLSN}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Replay Throughput</div>
          <div className="text-emerald-400 font-bold text-xs mt-0.5">{replaySpeedRecordsSec.toLocaleString()} rec/sec</div>
        </div>
      </div>
    </div>
  );
};
