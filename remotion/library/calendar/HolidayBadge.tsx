import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HolidayBadgeProps {
  holidayName?: string;
  dateStr?: string;
  emoji?: string;
  className?: string;
}

export const HolidayBadge: React.FC<HolidayBadgeProps> = ({
  holidayName = 'NEW YEAR 2027',
  dateStr = 'JANUARY 1',
  emoji = '🎉',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"inline-flex items-center bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-400/40 rounded-full px-4 py-2 font-mono text-white shadow-xl space-x-3 backdrop-blur-md " + className}>
      <span className="text-2xl">{emoji}</span>
      <div>
        <div className="text-xs font-black tracking-widest text-amber-300 uppercase">{holidayName}</div>
        <div className="text-[10px] text-white/60 font-bold">{dateStr} • PUBLIC HOLIDAY</div>
      </div>
    </div>
  );
};
