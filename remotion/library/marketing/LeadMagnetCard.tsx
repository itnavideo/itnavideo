import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LeadMagnetCardProps {
  title?: string;
  downloads?: string;
  badge?: string;
  className?: string;
}

export const LeadMagnetCard: React.FC<LeadMagnetCardProps> = ({
  title = '2026 High-Retention Video Blueprint',
  downloads = '14,250+ Creators',
  badge = 'FREE DOWNLOAD',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          HIGH-CONVERTING LEAD MAGNET
        </span>
        <span className="text-white/40">OPT-IN RATE: 42%</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex items-center space-x-4">
        <div className="w-20 h-28 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-xl flex flex-col justify-between p-2 text-black font-black">
          <span className="text-[8px] bg-black text-white px-1 py-0.5 rounded w-max">PDF EBOOK</span>
          <span className="text-[11px] leading-tight text-white drop-shadow">VIRAL REELS</span>
          <span className="text-[8px] text-white/80">35 PAGES</span>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-2">
          <span className="text-[10px] font-mono text-amber-400 font-bold">{badge}</span>
          <div className="text-sm font-bold text-white leading-snug">{title}</div>
          <div className="text-xs text-white/50 font-mono">Downloaded by {downloads}</div>
          <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs w-max shadow-lg">
            Download Now (Instant) →
          </button>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>DELIVERY: INSTANT EMAIL DISPATCH</span>
        <span>NO CREDIT CARD REQUIRED</span>
      </div>
    </div>
  );
};
