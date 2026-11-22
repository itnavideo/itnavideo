import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface EmailNewsletterCardProps {
  title?: string;
  subscribers?: string;
  frequency?: string;
  className?: string;
}

export const EmailNewsletterCard: React.FC<EmailNewsletterCardProps> = ({
  title = 'The Viral Creator Dispatch',
  subscribers = '85,000+',
  frequency = 'Every Tuesday at 9 AM',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          NEWSLETTER OPT-IN MOCKUP
        </span>
        <span className="text-teal-400 font-bold">{subscribers} READERS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-center space-y-3">
        <div className="text-base font-bold text-white">{title}</div>
        <div className="text-xs text-white/50">{frequency} — 1 viral video breakdown and 3 actionable retention frameworks.</div>
        <div className="flex items-center space-x-2">
          <input
            disabled
            placeholder="creator@example.com"
            className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs text-white/60 font-mono"
          />
          <button className="px-4 py-2 bg-teal-500 text-black font-bold text-xs rounded-lg shadow-lg">
            Join Free →
          </button>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>OPEN RATE: 48.2%</span>
        <span>UNSUBSCRIBE ANYTIME</span>
      </div>
    </div>
  );
};
