import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface CustomerJourneyMapProps {
  steps?: { title: string; touchpoint: string; sentiment: string }[];
  className?: string;
}

export const CustomerJourneyMap: React.FC<CustomerJourneyMapProps> = ({
  steps = [
    { title: 'Discovery', touchpoint: 'TikTok Organic Reel', sentiment: 'Curious' },
    { title: 'Consideration', touchpoint: 'Landing Page & Demo', sentiment: 'Excited' },
    { title: 'Conversion', touchpoint: '1-Click Stripe Checkout', sentiment: 'Delighted' },
    { title: 'Advocacy', touchpoint: 'Referral & Review', sentiment: 'Loyal' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          CUSTOMER JOURNEY MAP
        </span>
        <span className="text-white/40">4 TOUCHPOINTS</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-4 gap-2 items-center">
        {steps.map((st, i) => {
          const active = frame > i * 15;
          return (
            <div
              key={i}
              className={"p-3 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all " +
                (active ? 'bg-zinc-900 border-sky-500/50 shadow-lg' : 'bg-zinc-900/40 border-white/5 opacity-50')}
            >
              <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-400 text-sky-300 font-mono text-xs font-black flex items-center justify-center">
                {i + 1}
              </div>
              <div className="text-xs font-bold text-white">{st.title}</div>
              <div className="text-[10px] text-white/50 leading-tight">{st.touchpoint}</div>
              <div className="px-2 py-0.5 rounded text-[9px] bg-sky-950 text-sky-300 border border-sky-800">
                {st.sentiment}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ATTRIBUTION: FIRST & LAST TOUCH</span>
        <span>AVG CAC: $14.20</span>
      </div>
    </div>
  );
};
