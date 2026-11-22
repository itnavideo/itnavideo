import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutlierBoxPlotProps {
  columnName?: string;
  minVal?: number;
  q1Val?: number;
  medianVal?: number;
  q3Val?: number;
  maxVal?: number;
  outliersCount?: number;
  className?: string;
}

export const OutlierBoxPlot: React.FC<OutlierBoxPlotProps> = ({
  columnName = "session_duration_sec",
  minVal = 4,
  q1Val = 45,
  medianVal = 180,
  q3Val = 540,
  maxVal = 1420,
  outliersCount = 28,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            OUTLIER BOX-AND-WHISKER PLOT
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {columnName}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 font-mono text-center text-xs mb-3">
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">Min</div>
          <div className="text-white font-bold mt-0.5">{minVal}</div>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">Q1</div>
          <div className="text-sky-300 font-bold mt-0.5">{q1Val}</div>
        </div>
        <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-500/30">
          <div className="text-[10px] text-sky-400 font-bold">Median</div>
          <div className="text-sky-400 font-bold mt-0.5">{medianVal}</div>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">Q3</div>
          <div className="text-sky-300 font-bold mt-0.5">{q3Val}</div>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400">Max</div>
          <div className="text-white font-bold mt-0.5">{maxVal}</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>IQR: {q3Val - q1Val}</span>
        <span className="text-amber-400 font-bold">{outliersCount} Anomalous Outliers Flagged</span>
      </div>
    </div>
  );
};
