import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ChannelIdentProps {
  channelNumber?: string;
  networkTitle?: string;
  slogan?: string;
  className?: string;
}

export const ChannelIdent: React.FC<ChannelIdentProps> = ({
  channelNumber = '08',
  networkTitle = 'GLOBAL BROADCAST NETWORK',
  slogan = 'THE PULSE OF TRUTH • 24/7 WORLDWIDE',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex items-center space-x-5 " + className}>
      <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-3xl font-black text-white shadow-xl">
        {channelNumber}
      </div>
      <div>
        <div className="text-xs text-red-400 font-bold tracking-widest uppercase">HD CHANNEL IDENT</div>
        <div className="text-lg font-black tracking-tight">{networkTitle}</div>
        <div className="text-xs text-white/50">{slogan}</div>
      </div>
    </div>
  );
};
