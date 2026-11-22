import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  time: string;
  gap?: string;
}

export interface LeaderboardRankProps {
  entries?: LeaderboardEntry[];
  title?: string;
  category?: string;
  className?: string;
}

export const LeaderboardRank: React.FC<LeaderboardRankProps> = ({
  entries = [
    { rank: 1, name: 'Eliud Kipchoge', time: '02:01:09', gap: 'LEADER' },
    { rank: 2, name: 'Kenenisa Bekele', time: '02:01:41', gap: '+0:32' },
    { rank: 3, name: 'Birhanu Legese', time: '02:02:48', gap: '+1:39' },
  ],
  title = 'BERLIN MARATHON',
  category = 'ELITE MEN • SPLIT 40KM',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  const medalColors = ['#f59e0b', '#94a3b8', '#b45309'];

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 14, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-amber-400 font-black tracking-wider text-[11px] uppercase">
            🏆 {title}
          </span>
          <span className="text-zinc-500 text-[10px]">{category}</span>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          {entries.map((entry, idx) => {
            const rowEnter = spring({
              frame: frame - idx * 6,
              fps,
              config: { damping: 12, stiffness: 160 },
            });

            return (
              <div
                key={entry.rank}
                className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs"
                style={{
                  transform: `translateX(${interpolate(rowEnter, [0, 1], [-20, 0])}px)`,
                  opacity: rowEnter,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center font-black text-black text-[10px]"
                    style={{ backgroundColor: medalColors[idx] || '#64748b' }}
                  >
                    {entry.rank}
                  </span>
                  <span className="text-white font-bold truncate">{entry.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-zinc-300 font-semibold">{entry.time}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      entry.gap === 'LEADER' ? 'text-amber-400' : 'text-zinc-500'
                    }`}
                  >
                    {entry.gap}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
