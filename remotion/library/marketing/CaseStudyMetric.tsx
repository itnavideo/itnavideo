import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface CaseStudyMetricProps {
  headline?: string;
  beforeVal?: string;
  afterVal?: string;
  timeline?: string;
  className?: string;
}

export const CaseStudyMetric: React.FC<CaseStudyMetricProps> = ({
  headline = 'B2B SaaS Growth Case Study',
  beforeVal = '$12K MRR',
  afterVal = '$148K MRR',
  timeline = 'In 90 Days',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          CASE STUDY RESULTS
        </span>
        <span className="text-cyan-400 font-bold">{timeline}</span>
      </div>

      <div className="flex-1 my-4 flex flex-col justify-center space-y-4">
        <div className="text-xs font-mono text-white/60">{headline}</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl">
            <div className="text-[10px] text-white/40 font-mono">BEFORE ITNAVIDEO</div>
            <div className="text-xl font-bold font-mono text-zinc-400 mt-1">{beforeVal}</div>
          </div>
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-xl">
            <div className="text-[10px] text-emerald-400 font-mono">AFTER ITNAVIDEO</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{afterVal}</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ACQUISITION CHANNEL: 9:16 SHORTS</span>
        <span>CHURN REDUCTION: -42%</span>
      </div>
    </div>
  );
};
