import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PartnershipEcosystemMapProps {
  categories?: { label: string; count: string }[];
  className?: string;
}

export const PartnershipEcosystemMap: React.FC<PartnershipEcosystemMapProps> = ({
  categories = [
    { label: 'Cloud Providers (AWS & GCP)', count: '2 Tier-1' },
    { label: 'AI Foundation Models (Gemini & Groq)', count: '4 Models' },
    { label: 'Agency Channel Resellers', count: '120+ Certified' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          STRATEGIC PARTNERSHIP ALLIANCES
        </span>
        <span className="text-white/40">ECOSYSTEM SYNERGY</span>
      </div>

      <div className="flex-1 my-4 space-y-2.5 flex flex-col justify-center">
        {categories.map((c, i) => (
          <div key={i} className="p-3 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90">{c.label}</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold">
              {c.count}
            </span>
          </div>
        ))}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>INTEGRATION STATUS: 100% OPERATIONAL</span>
        <span>CHANNEL REVENUE SHARE: 24%</span>
      </div>
    </div>
  );
};
