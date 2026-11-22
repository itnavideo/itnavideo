import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface OrgChartTreeProps {
  ceo?: string;
  execs?: { role: string; name: string }[];
  className?: string;
}

export const OrgChartTree: React.FC<OrgChartTreeProps> = ({
  ceo = 'Elena Rostova (CEO)',
  execs = [
    { role: 'VP Engineering', name: 'Marcus Chen' },
    { role: 'VP Product', name: 'Aaliyah Patel' },
    { role: 'VP Revenue', name: 'David Miller' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
          EXECUTIVE ORGANIZATIONAL CHART
        </span>
        <span className="text-white/40">LEADERSHIP HIERARCHY</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3">
        <div className="px-4 py-2 bg-indigo-950 border border-indigo-500/50 rounded-xl text-center shadow-lg">
          <div className="text-xs font-bold text-indigo-300">{ceo}</div>
          <div className="text-[10px] text-white/50 font-mono">CHIEF EXECUTIVE OFFICER</div>
        </div>

        <div className="w-0.5 h-4 bg-white/20" />

        <div className="grid grid-cols-3 gap-2 w-full">
          {execs.map((ex, i) => (
            <div key={i} className="p-2.5 bg-zinc-900 border border-white/10 rounded-lg text-center">
              <div className="text-[10px] text-white/40 font-mono">{ex.role}</div>
              <div className="text-xs font-bold text-white mt-0.5">{ex.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TOTAL GLOBAL WORKFORCE: 148 FTE</span>
        <span>CROSS-FUNCTIONAL ALIGNMENT</span>
      </div>
    </div>
  );
};
