import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface EventDateCalloutProps {
  eventName?: string;
  date?: string;
  time?: string;
  venue?: string;
  className?: string;
}

export const EventDateCallout: React.FC<EventDateCalloutProps> = ({
  eventName = 'GLOBAL CREATOR KEYNOTE',
  date = 'DECEMBER 14, 2026',
  time = '10:00 AM PST',
  venue = 'SAN FRANCISCO & LIVESTREAM',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-80 bg-zinc-950 border border-white/10 rounded-2xl p-5 font-mono text-white shadow-2xl flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-[10px] text-sky-400 font-black uppercase tracking-widest mb-2">
        <span>UPCOMING EVENT</span>
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
      </div>
      <h3 className="text-base font-black tracking-tight text-white mb-3">{eventName}</h3>
      <div className="space-y-1 text-xs text-white/70 border-t border-white/10 pt-3">
        <div>📅 {date}</div>
        <div>⏰ {time}</div>
        <div>📍 {venue}</div>
      </div>
    </div>
  );
};
