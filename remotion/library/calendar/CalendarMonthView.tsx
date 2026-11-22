import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CalendarMonthViewProps {
  monthName?: string;
  activeDay?: number;
  totalDays?: number;
  className?: string;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  monthName = 'NOVEMBER 2026',
  activeDay = 22,
  totalDays = 30,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className={"w-80 bg-zinc-950/95 border border-white/10 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="text-sm font-black text-white text-center mb-4 tracking-wider uppercase border-b border-white/10 pb-2">
        {monthName}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2 text-[10px] text-white/40 font-bold">
        {days.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const isActive = day === activeDay;
          return (
            <div
              key={i}
              className={"h-8 rounded flex items-center justify-center font-bold " + (
                isActive ? 'bg-red-600 text-white shadow-lg animate-pulse' : 'text-white/70 hover:bg-zinc-900'
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
