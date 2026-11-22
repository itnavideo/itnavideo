import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AudiencePollOverlayProps {
  question?: string;
  optionA?: string;
  percentA?: number;
  optionB?: string;
  percentB?: number;
  totalVotes?: string;
  className?: string;
}

export const AudiencePollOverlay: React.FC<AudiencePollOverlayProps> = ({
  question = 'Will AI replace traditional desktop video editors by 2027?',
  optionA = 'YES, ABSOLUTELY',
  percentA = 74,
  optionB = 'NO, CO-EXIST',
  percentB = 26,
  totalVotes = '18,420 live votes',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const barProgress = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 80 } });

  const animA = percentA * barProgress;
  const animB = percentB * barProgress;

  return (
    <div
      className={`p-4 flex items-center justify-center font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 border border-sky-500/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 14, 20, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(56, 189, 248, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-[10px] text-sky-400 font-bold uppercase tracking-widest pb-2 border-b border-white/10">
          <span>LIVE AUDIENCE POLL</span>
          <span className="text-zinc-500">{totalVotes}</span>
        </div>

        <h4 className="text-white font-bold text-xs md:text-sm tracking-tight mt-2.5 leading-snug">
          {question}
        </h4>

        {/* Option A */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1 font-bold">
            <span className="text-white">{optionA}</span>
            <span className="text-sky-400">{animA.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-zinc-900 border border-white/10 overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full" style={{ width: `${animA}%` }} />
          </div>
        </div>

        {/* Option B */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-xs mb-1 font-bold">
            <span className="text-white">{optionB}</span>
            <span className="text-zinc-400">{animB.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-zinc-900 border border-white/10 overflow-hidden">
            <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${animB}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
