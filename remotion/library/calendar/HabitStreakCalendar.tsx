import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HabitStreakCalendarProps {
  streakDays?: number;
  habitName?: string;
  className?: string;
}

export const HabitStreakCalendar: React.FC<HabitStreakCalendarProps> = ({
  streakDays = 42,
  habitName = 'Daily Video Creation Sprint',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-72 bg-gradient-to-br from-orange-950/60 to-zinc-950 border border-orange-500/30 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="flex items-center space-x-2 text-xs text-orange-400 font-bold mb-2">
        <span>🔥 HABIT STREAK</span>
      </div>
      <div className="text-4xl font-black text-orange-300 mb-1">{streakDays} DAYS</div>
      <div className="text-xs text-white/60 mb-3">{habitName}</div>
      <div className="flex space-x-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 h-2 rounded-full bg-orange-500 shadow-sm" />
        ))}
      </div>
    </div>
  );
};
