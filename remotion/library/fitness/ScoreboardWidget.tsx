import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ScoreboardWidgetProps {
  homeTeam?: string;
  homeScore?: number;
  awayTeam?: string;
  awayScore?: number;
  matchClock?: string;
  period?: string;
  tournament?: string;
  className?: string;
}

export const ScoreboardWidget: React.FC<ScoreboardWidgetProps> = ({
  homeTeam = 'BARCELONA',
  homeScore = 3,
  awayTeam = 'REAL MADRID',
  awayScore = 2,
  matchClock = "87:42",
  period = '2ND HALF',
  tournament = 'CHAMPIONS LEAGUE',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [-25, 0])}px) scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="flex items-center rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(12, 12, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.9), 0 0 25px rgba(56, 189, 248, 0.15)',
        }}
      >
        {/* Tournament & Clock Segment */}
        <div className="bg-sky-950/80 px-4 py-3 flex flex-col items-center border-r border-white/10 min-w-28">
          <span className="text-[9px] font-black uppercase tracking-wider text-sky-400 truncate">
            {tournament}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-white font-black text-sm tracking-tight">{matchClock}</span>
          </div>
          <span className="text-[9px] text-zinc-400 mt-0.5">{period}</span>
        </div>

        {/* Teams and Scoreboard */}
        <div className="flex items-center px-6 py-3 gap-5">
          {/* Home Team */}
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold text-sm tracking-wider">{homeTeam}</span>
            <span className="text-2xl font-black text-white px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10">
              {homeScore}
            </span>
          </div>

          <span className="text-zinc-600 font-bold text-sm">-</span>

          {/* Away Team */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10">
              {awayScore}
            </span>
            <span className="text-white font-extrabold text-sm tracking-wider">{awayTeam}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
