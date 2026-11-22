import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CalendarYearProgressProps {
  year?: number;
  currentDay?: number;
  totalDays?: number;
  className?: string;
}

export const CalendarYearProgress: React.FC<CalendarYearProgressProps> = ({
  year = 2026,
  currentDay = 326,
  totalDays = 365,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const pct = ((currentDay / totalDays) * 100).toFixed(1);

  return (
    <div className={"w-80 bg-zinc-950 border border-white/10 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="text-white/60 font-bold">{year} YEAR PROGRESS</span>
        <span className="text-emerald-400 font-black">{pct}%</span>
      </div>
      <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden mb-3">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: pct + '%' }} />
      </div>
      <div className="flex justify-between text-[10px] text-white/40">
        <span>Day {currentDay} of {totalDays}</span>
        <span>{totalDays - currentDay} Days Remaining</span>
      </div>
    </div>
  );
};
