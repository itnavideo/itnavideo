import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BoardMeetingAgendaProps {
  items?: { time: string; topic: string; presenter: string }[];
  className?: string;
}

export const BoardMeetingAgenda: React.FC<BoardMeetingAgendaProps> = ({
  items = [
    { time: '09:00 AM', topic: 'CEO State of the Union & Strategy', presenter: 'Elena Rostova' },
    { time: '09:45 AM', topic: 'Q3 Financial Review & Runway', presenter: 'CFO Office' },
    { time: '10:30 AM', topic: 'Remotion Cloud Infrastructure Scale', presenter: 'Marcus Chen' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-slate-700 text-white font-bold border border-white/20">
          BOARD OF DIRECTORS AGENDA
        </span>
        <span className="text-white/40">MINUTES SCHEDULE</span>
      </div>

      <div className="flex-1 my-4 space-y-2 flex flex-col justify-center">
        {items.map((it, i) => (
          <div key={i} className="p-3 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-amber-400 font-bold">{it.time}</span>
              <span className="font-semibold text-white">{it.topic}</span>
            </div>
            <span className="text-[11px] text-white/40">{it.presenter}</span>
          </div>
        ))}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>LOCATION: HYBRID / ZOOM</span>
        <span>QUORUM VERIFIED</span>
      </div>
    </div>
  );
};
