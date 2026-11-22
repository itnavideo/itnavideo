import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ValuePropositionCanvasProps {
  productPains?: string[];
  customerPains?: string[];
  className?: string;
}

export const ValuePropositionCanvas: React.FC<ValuePropositionCanvasProps> = ({
  productPains = ['1-Click Smart Subtitles', 'Cloud Lambda Render (30fps)', 'Zero Manual Keyframing'],
  customerPains = ['Editing takes 5 hours/video', 'Expensive desktop software', 'Inconsistent subtitle sync'],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          VALUE PROPOSITION FIT
        </span>
        <span className="text-white/40">PROBLEM-SOLUTION FIT</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-2 gap-3 items-center">
        <div className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-2">
          <div className="text-xs font-bold text-rose-400 font-mono">CUSTOMER PAIN POINTS</div>
          {customerPains.map((p, i) => (
            <div key={i} className="text-[11px] text-white/70 flex items-center space-x-1.5">
              <span className="text-rose-400">✗</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
        <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2">
          <div className="text-xs font-bold text-emerald-400 font-mono">ITNAVIDEO PAIN RELIEVERS</div>
          {productPains.map((p, i) => (
            <div key={i} className="text-[11px] text-white/70 flex items-center space-x-1.5">
              <span className="text-emerald-400">✓</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>PRODUCT MARKET FIT SCORE: 88%</span>
        <span>NET PROMOTER SCORE: 76</span>
      </div>
    </div>
  );
};
