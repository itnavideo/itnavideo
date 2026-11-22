import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CalendarDayCardProps {
  dayOfWeek?: string;
  dayNumber?: number;
  month?: string;
  year?: number;
  className?: string;
}

export const CalendarDayCard: React.FC<CalendarDayCardProps> = ({
  dayOfWeek = 'SUNDAY',
  dayNumber = 22,
  month = 'NOVEMBER',
  year = 2026,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-64 bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden font-mono text-white shadow-2xl flex flex-col items-center " + className}>
      <div className="w-full bg-red-600 px-4 py-2 flex justify-between items-center text-xs font-black tracking-widest uppercase">
        <span>{month}</span>
        <span>{year}</span>
      </div>
      <div className="py-6 flex flex-col items-center">
        <span className="text-6xl font-black tracking-tighter text-white">{dayNumber}</span>
        <span className="text-xs text-red-400 font-bold tracking-widest mt-1 uppercase">{dayOfWeek}</span>
      </div>
      <div className="w-full bg-zinc-900/80 border-t border-white/5 py-2 px-4 text-center text-[10px] text-white/40">
        DAILY TEAR-OFF CALENDAR
      </div>
    </div>
  );
};
