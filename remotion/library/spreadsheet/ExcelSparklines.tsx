import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ExcelSparklinesProps {
  metrics?: { label: string; trend: number[]; current: string }[];
  className?: string;
}

export const ExcelSparklines: React.FC<ExcelSparklinesProps> = ({
  metrics = [
    { label: "Weekly Revenue", trend: [12, 18, 14, 22, 28, 34], current: "$34,200" },
    { label: "Signups", trend: [450, 420, 510, 640, 780, 890], current: "890 users" },
    { label: "Server Latency", trend: [42, 38, 35, 32, 28, 24], current: "24 ms" },
  ],
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
            IN-CELL SPARKLINES (MICRO TRENDS)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Line & Column
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <span className="text-white font-bold w-36">{m.label}</span>
            <div className="flex items-end space-x-1 h-5 px-3">
              {m.trend.map((val, tIdx) => {
                const maxVal = Math.max(...m.trend);
                const heightPercent = (val / maxVal) * 100;
                return (
                  <div
                    key={tIdx}
                    className="w-1.5 bg-emerald-400 rounded-t-sm"
                    style={{ height: `${heightPercent}%` }}
                  />
                );
              })}
            </div>
            <span className="text-sky-300 font-bold">{m.current}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
