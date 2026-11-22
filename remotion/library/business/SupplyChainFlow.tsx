import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SupplyChainFlowProps {
  stages?: string[];
  className?: string;
}

export const SupplyChainFlow: React.FC<SupplyChainFlowProps> = ({
  stages = ['Raw Assets Upload', 'Groq Whisper Extraction', 'Remotion Lambda Renders', 'Cloudinary CDN Distribution'],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          VALUE CHAIN & PIPELINE LOGISTICS
        </span>
        <span className="text-white/40">4 INTEGRATED NODES</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-between space-x-2">
        {stages.map((st, i) => (
          <React.Fragment key={i}>
            <div className="flex-1 p-2.5 bg-zinc-900 border border-white/10 rounded-lg text-center flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center font-mono mb-1">
                {i + 1}
              </div>
              <span className="text-[11px] font-semibold text-white/90 leading-tight">{st}</span>
            </div>
            {i < stages.length - 1 && <span className="text-white/30 font-bold">→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>AVERAGE PIPELINE CYCLE: 84 SECONDS</span>
        <span>BOTTLENECKS: 0 DETECTED</span>
      </div>
    </div>
  );
};
