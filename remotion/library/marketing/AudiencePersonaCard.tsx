import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudiencePersonaCardProps {
  personaName?: string;
  role?: string;
  painPoint?: string;
  channel?: string;
  className?: string;
}

export const AudiencePersonaCard: React.FC<AudiencePersonaCardProps> = ({
  personaName = 'Creator Chris',
  role = 'Solo YouTuber & Course Creator',
  painPoint = 'Spends 20+ hours weekly cutting captions and matching visuals',
  channel = 'YouTube Shorts, Instagram Reels, TikTok',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-400 font-bold border border-fuchsia-500/30">
          IDEAL CUSTOMER PROFILE (ICP)
        </span>
        <span className="text-white/40">AUDIENCE TARGETING</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-black text-lg">
            CC
          </div>
          <div>
            <div className="text-sm font-bold text-white">{personaName}</div>
            <div className="text-xs text-white/50">{role}</div>
          </div>
        </div>

        <div className="space-y-2 mt-3 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="text-rose-400 font-bold font-mono">PRIMARY PAIN: </span>
            <span className="text-white/80">{painPoint}</span>
          </div>
          <div>
            <span className="text-emerald-400 font-bold font-mono">ACTIVE CHANNELS: </span>
            <span className="text-white/80">{channel}</span>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>EST. MARKET SIZE: 4.2M CREATORS</span>
        <span>WILLINGNESS TO PAY: $29-$79/MO</span>
      </div>
    </div>
  );
};
