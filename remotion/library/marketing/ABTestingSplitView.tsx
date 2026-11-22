import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ABTestingSplitViewProps {
  variantAName?: string;
  variantBName?: string;
  variantAConv?: string;
  variantBConv?: string;
  className?: string;
}

export const ABTestingSplitView: React.FC<ABTestingSplitViewProps> = ({
  variantAName = 'Short Hook (3s Cut)',
  variantBName = 'Story Hook (Question)',
  variantAConv = '2.1% CTR',
  variantBConv = '4.8% CTR (WINNER)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          A/B SPLIT TESTING LAB
        </span>
        <span className="text-white/40">50/50 TRAFFIC SPLIT</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-2 gap-3 items-center">
        <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl flex flex-col justify-between h-full">
          <div>
            <div className="text-[10px] font-mono text-white/40 font-bold">VARIANT A</div>
            <div className="text-xs font-bold text-white mt-1">{variantAName}</div>
          </div>
          <div className="text-sm font-mono text-zinc-400 mt-3">{variantAConv}</div>
        </div>
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-xl flex flex-col justify-between h-full relative">
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-black">
            WINNER
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">VARIANT B</div>
            <div className="text-xs font-bold text-white mt-1">{variantBName}</div>
          </div>
          <div className="text-sm font-mono text-emerald-400 font-bold mt-3">{variantBConv}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STATISTICAL POWER: 99.8%</span>
        <span>+128% MORE CONVERSIONS</span>
      </div>
    </div>
  );
};
