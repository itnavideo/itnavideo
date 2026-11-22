import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface MarketingFunnelStageProps {
  stages?: { name: string; count: string; rate: string; color: string }[];
  className?: string;
}

export const MarketingFunnelStage: React.FC<MarketingFunnelStageProps> = ({
  stages = [
    { name: 'Awareness (Ad Impressions)', count: '250,000', rate: '100%', color: '#6366f1' },
    { name: 'Interest (Site Visitors)', count: '38,500', rate: '15.4%', color: '#8b5cf6' },
    { name: 'Decision (Lead Opt-ins)', count: '6,200', rate: '2.5%', color: '#ec4899' },
    { name: 'Action (Paying Customers)', count: '1,480', rate: '0.6%', color: '#10b981' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          AIDA CONVERSION FUNNEL
        </span>
        <span className="text-white/40">FULL FUNNEL ANALYTICS</span>
      </div>

      <div className="flex-1 my-4 flex flex-col justify-center space-y-3">
        {stages.map((st, i) => {
          const widthProgress = interpolate(frame - i * 8, [0, 20], [0, 100 - i * 18], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div key={i} className="flex flex-col space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-300">{st.name}</span>
                <span className="font-mono text-emerald-400 font-bold">{st.count} ({st.rate})</span>
              </div>
              <div className="w-full h-7 bg-zinc-900 rounded-lg overflow-hidden p-1 flex items-center border border-white/5">
                <div
                  className="h-full rounded transition-all duration-300 flex items-center px-3"
                  style={{ width: widthProgress + '%', backgroundColor: st.color }}
                >
                  <span className="text-[10px] font-black text-white/90 drop-shadow">STAGE {i + 1}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>OVERALL CONVERSION: 3.84%</span>
        <span>BENCHMARK: TOP 10% TIER</span>
      </div>
    </div>
  );
};
