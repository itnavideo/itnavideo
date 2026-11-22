import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface GuaranteedBadgeProps {
  days?: number;
  guaranteeText?: string;
  className?: string;
}

export const GuaranteedBadge: React.FC<GuaranteedBadgeProps> = ({
  days = 30,
  guaranteeText = '100% Risk-Free Money Back Guarantee',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          SECURITY & TRUST EMBLEM
        </span>
        <span className="text-emerald-400 font-bold">{days}-DAY WINDOW</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-400 bg-emerald-950/40 flex items-center justify-center text-emerald-300 font-black text-2xl shadow-xl">
          ✓
        </div>
        <div className="text-sm font-bold text-white max-w-xs">{guaranteeText}</div>
        <div className="text-xs text-white/50 max-w-sm">
          If you are not 100% satisfied with Itnavideo in your first {days} days, simply message us for a prompt refund.
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>RISK REVERSAL: MAXIMUM</span>
        <span>NO QUESTIONS ASKED</span>
      </div>
    </div>
  );
};
