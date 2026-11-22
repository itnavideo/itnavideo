import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CallToActionBannerProps {
  ctaText?: string;
  directive?: string;
  className?: string;
}

export const CallToActionBanner: React.FC<CallToActionBannerProps> = ({
  ctaText = 'Start Free 5 Video Trial',
  directive = 'LINK IN BIO / COMMENTS',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-emerald-500/30 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          CONVERSION CTA BANNER
        </span>
        <span className="text-white/40">ACTION DRIVER</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center space-y-3">
        <div className="text-xs font-mono text-emerald-400 font-bold animate-pulse">{directive}</div>
        <button className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-base shadow-xl flex items-center space-x-2">
          <span>{ctaText}</span>
          <span>→</span>
        </button>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>END-SCREEN RETENTION HOOK</span>
        <span>CONVERSION RATE: +34%</span>
      </div>
    </div>
  );
};
