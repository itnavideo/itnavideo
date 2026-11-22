import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ScheduleTimelineProps {
  slots?: { time: string; title: string; active?: boolean }[];
  className?: string;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  slots = [
    { time: '09:00 AM', title: 'Daily Architecture Standup' },
    { time: '11:00 AM', title: 'Remotion Pipeline Release', active: true },
    { time: '02:00 PM', title: 'Product Vision Keynote' },
    { time: '04:30 PM', title: 'Codebase Review & Sync' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-80 bg-zinc-950 border border-white/10 rounded-2xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="text-xs font-black text-white/60 mb-3 uppercase tracking-wider border-b border-white/10 pb-2">
        DAILY SCHEDULE TIMELINE
      </div>
      <div className="space-y-3">
        {slots.map((s, i) => (
          <div key={i} className={"p-2 rounded-lg border text-xs flex items-center justify-between " + (
            s.active ? 'border-emerald-500 bg-emerald-950/20' : 'border-white/5 bg-zinc-900/60'
          )}>
            <div>
              <div className="text-[10px] text-white/40 font-bold">{s.time}</div>
              <div className="font-bold text-white mt-0.5">{s.title}</div>
            </div>
            {s.active && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
          </div>
        ))}
      </div>
    </div>
  );
};
