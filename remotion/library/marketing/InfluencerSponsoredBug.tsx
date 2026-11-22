import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface InfluencerSponsoredBugProps {
  sponsorName?: string;
  tagline?: string;
  className?: string;
}

export const InfluencerSponsoredBug: React.FC<InfluencerSponsoredBugProps> = ({
  sponsorName = 'Itnavideo Studio',
  tagline = 'AI Programmatic Video Engine',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-zinc-800 text-white/70 font-bold border border-white/20">
          REGULATORY SPONSOR BUG
        </span>
        <span className="text-white/40">FTC COMPLIANT</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center">
        <div className="px-5 py-3 rounded-xl bg-black/80 border border-white/20 flex items-center space-x-3 shadow-2xl backdrop-blur-md">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xs text-white">
            IV
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/50 tracking-wider">PAID PARTNERSHIP WITH</div>
            <div className="text-xs font-bold text-white">{sponsorName}</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CLEAN TRANSPARENCY</span>
        <span>SAFE HARBOR VERIFIED</span>
      </div>
    </div>
  );
};
