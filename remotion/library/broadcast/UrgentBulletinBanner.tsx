import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface UrgentBulletinBannerProps {
  headline?: string;
  subtext?: string;
  urgencyLevel?: 'BREAKING' | 'SPECIAL REPORT' | 'CRITICAL ALERT';
  className?: string;
}

export const UrgentBulletinBanner: React.FC<UrgentBulletinBannerProps> = ({
  headline = 'GLOBAL MARKETS IN RECORD SURGE FOLLOWING TRADE DEAL',
  subtext = 'LIVE COVERAGE: New international accords signed in Geneva summit',
  urgencyLevel = 'CRITICAL ALERT',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full bg-gradient-to-r from-red-700 via-red-600 to-zinc-950 p-4 border-l-8 border-yellow-400 font-mono text-white shadow-2xl " + className}>
      <div className="flex items-center space-x-2 mb-1">
        <span className="px-2 py-0.5 rounded bg-black text-yellow-400 text-[10px] font-black uppercase tracking-widest">
          {urgencyLevel}
        </span>
        <span className="text-[10px] text-white/70">SPECIAL BROADCAST BULLETIN</span>
      </div>
      <h2 className="text-xl font-black tracking-tight leading-tight uppercase drop-shadow mb-1">
        {headline}
      </h2>
      <p className="text-xs text-white/80">{subtext}</p>
    </div>
  );
};
