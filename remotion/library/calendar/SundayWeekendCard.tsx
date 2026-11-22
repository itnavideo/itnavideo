import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SundayWeekendCardProps {
  title?: string;
  subtext?: string;
  className?: string;
}

export const SundayWeekendCard: React.FC<SundayWeekendCardProps> = ({
  title = 'LAZY SUNDAY MORNING',
  subtext = 'Coffee brewed • Zero alarms • Complete recharge',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-72 bg-gradient-to-br from-amber-950/60 to-zinc-950 border border-amber-500/30 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="text-2xl mb-2">☕</div>
      <div className="text-base font-black tracking-tight text-amber-300 mb-1">{title}</div>
      <p className="text-xs text-white/60">{subtext}</p>
      <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
        WEEKEND MODE ACTIVE
      </div>
    </div>
  );
};
