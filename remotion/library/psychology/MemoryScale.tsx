import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MemoryScaleProps {
  retentionPercent?: number;
  decayTimeframe?: string;
  rehearsalsCount?: number;
  method?: string;
  className?: string;
}

export const MemoryScale: React.FC<MemoryScaleProps> = ({
  retentionPercent = 78,
  decayTimeframe = 'DAY 7 POST-EXPOSURE',
  rehearsalsCount = 3,
  method = 'SPACED REPETITION ACTIVE RECALL',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const decayFill = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 80 } });

  const animatedRetention = Math.round(retentionPercent * decayFill);

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-purple-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(16, 12, 22, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(168, 85, 247, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px]">
            EBBINGHAUS COGNITIVE MEMORY SCALE
          </span>
          <span className="text-zinc-500 text-[10px]">{decayTimeframe}</span>
        </div>

        {/* Big Recall Retention Metric */}
        <div className="flex items-center justify-between my-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase font-bold">RECALL RETENTION</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">{animatedRetention}%</span>
              <span className="text-emerald-400 text-xs font-bold">+52% VS FORGETTING</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xl shadow-lg">
            🧠
          </div>
        </div>

        {/* Spaced Intervals Timeline (1h, 1d, 3d, 7d, 30d) */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 my-2">
          <span>1h (100%)</span>
          <span>1d (85%)</span>
          <span className="text-purple-300 font-bold">7d (78%)</span>
          <span>30d (65%)</span>
        </div>

        {/* Progress Retention Bar */}
        <div className="w-full h-3 rounded-full bg-zinc-900 border border-white/10 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${animatedRetention}%`,
              background: 'linear-gradient(90deg, #a855f7, #6366f1)',
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)',
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-3 border-t border-white/10 mt-3">
          <span>Method: <strong className="text-white">{method}</strong></span>
          <span className="text-purple-400 font-bold">{rehearsalsCount} Rehearsals</span>
        </div>
      </div>
    </div>
  );
};
