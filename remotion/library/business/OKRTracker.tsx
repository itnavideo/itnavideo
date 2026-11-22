import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface OKRTrackerProps {
  objective?: string;
  keyResults?: { text: string; progress: number }[];
  className?: string;
}

export const OKRTracker: React.FC<OKRTrackerProps> = ({
  objective = 'Scale Enterprise Video Engine to 10M Daily Cloud Frames',
  keyResults = [
    { text: 'Reduce Lambda render latency below 45s', progress: 85 },
    { text: 'Achieve 99.95% API uptime on Cloud Run', progress: 98 },
    { text: 'Deploy 50 new Remotion motion primitives', progress: 100 },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          QUARTERLY OKR DASHBOARD
        </span>
        <span className="text-white/40">Q3 EXECUTION</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="text-xs font-bold text-amber-400 font-mono">OBJECTIVE:</div>
        <div className="text-sm font-semibold text-white mb-3">{objective}</div>
        <div className="space-y-2">
          {keyResults.map((kr, i) => {
            const w = interpolate(frame, [0, 30], [0, kr.progress], { extrapolateRight: 'clamp' });
            return (
              <div key={i} className="text-xs space-y-1">
                <div className="flex justify-between text-white/70">
                  <span>KR{i + 1}: {kr.text}</span>
                  <span className="font-mono font-bold text-white">{kr.progress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: w + '%' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>OVERALL COMPLETION: 94.3%</span>
        <span>ON TRACK (GREEN)</span>
      </div>
    </div>
  );
};
